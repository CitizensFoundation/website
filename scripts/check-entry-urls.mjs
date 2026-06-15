#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const DEFAULT_ORIGIN = "https://citizens.is";
const DEFAULT_INPUT_DIR = "debug";
const DEFAULT_CONCURRENCY = 8;
const DEFAULT_TIMEOUT_MS = 10000;

function usage() {
  console.log(`
Usage: node scripts/check-entry-urls.mjs [options]

Reads Plausible entry URL dumps from debug/*.txt, requests each URL against
citizens.is without following redirects, and reports 301/200/404 mechanically.

Options:
  --input <file>       Read one input file. Can be repeated.
  --dir <dir>          Directory of .txt files to read. Defaults to debug.
  --origin <url>       Origin for relative paths. Defaults to ${DEFAULT_ORIGIN}.
  --concurrency <n>    Concurrent requests. Defaults to ${DEFAULT_CONCURRENCY}.
  --timeout <ms>       Per-request timeout. Defaults to ${DEFAULT_TIMEOUT_MS}.
  --limit <n>          Only check the first n unique paths.
  --output <file>      Write full JSON results to a file.
  --fail-on <list>     Comma-separated failure classes: 404,error,non301,non2xx3xx.
                       Defaults to 404,error.
  --dry-run            Print parsed URLs without making requests.
  --help               Show this help.
`);
}

function parseArgs(argv) {
  const args = {
    inputs: [],
    dir: DEFAULT_INPUT_DIR,
    origin: DEFAULT_ORIGIN,
    concurrency: DEFAULT_CONCURRENCY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    limit: null,
    output: null,
    failOn: new Set(["404", "error"]),
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (!value) throw new Error(`${arg} requires a value`);
      return value;
    };

    if (arg === "--input") args.inputs.push(next());
    else if (arg === "--dir") args.dir = next();
    else if (arg === "--origin") args.origin = next();
    else if (arg === "--concurrency") args.concurrency = Number(next());
    else if (arg === "--timeout") args.timeoutMs = Number(next());
    else if (arg === "--limit") args.limit = Number(next());
    else if (arg === "--output") args.output = next();
    else if (arg === "--fail-on") args.failOn = new Set(next().split(",").map((v) => v.trim()).filter(Boolean));
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!Number.isInteger(args.concurrency) || args.concurrency < 1) throw new Error("--concurrency must be a positive integer");
  if (!Number.isInteger(args.timeoutMs) || args.timeoutMs < 1) throw new Error("--timeout must be a positive integer");
  if (args.limit !== null && (!Number.isInteger(args.limit) || args.limit < 1)) throw new Error("--limit must be a positive integer");

  return args;
}

async function inputFiles(args) {
  if (args.inputs.length) return args.inputs.map((p) => resolve(p));

  const dir = resolve(args.dir);
  const names = await readdir(dir);
  return names
    .filter((name) => name.endsWith(".txt"))
    .sort()
    .map((name) => join(dir, name));
}

function htmlDecodeLight(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function normalizeCandidate(raw, origin) {
  const candidate = htmlDecodeLight(raw.trim());
  if (!candidate || candidate.startsWith("#")) return null;
  if (!candidate.startsWith("/") && !/^https?:\/\//i.test(candidate)) return null;

  try {
    const url = new URL(candidate, origin);
    if (url.origin !== origin) return null;
    return {
      path: `${url.pathname}${url.search}`,
      url: url.href,
    };
  } catch {
    return null;
  }
}

async function parseInputs(files, origin) {
  const seen = new Set();
  const entries = [];

  for (const file of files) {
    const text = await readFile(file, "utf8");
    const lines = text.split(/\r?\n/);

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
      const parsed = normalizeCandidate(lines[lineNumber], origin);
      if (!parsed || seen.has(parsed.url)) continue;
      seen.add(parsed.url);
      entries.push({ ...parsed, sourceFile: file, line: lineNumber + 1 });
    }
  }

  return entries;
}

async function fetchStatus(entry, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let method = "HEAD";
    let response = await fetch(entry.url, {
      method: "HEAD",
      redirect: "manual",
      signal: controller.signal,
    });

    if (response.status === 405) {
      method = "GET";
      response = await fetch(entry.url, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
      });
    }

    return {
      ...entry,
      ok: true,
      status: response.status,
      location: response.headers.get("location") || "",
      method,
    };
  } catch (error) {
    return {
      ...entry,
      ok: false,
      status: null,
      location: "",
      method: "HEAD",
      error: error && error.name === "AbortError" ? "timeout" : String(error && error.message ? error.message : error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length);
  let index = 0;

  async function runWorker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  return results;
}

function isFailure(result, failOn) {
  if (!result.ok) return failOn.has("error");
  if (result.status === 404) return failOn.has("404");
  if (result.status !== 301) return failOn.has("non301");
  if ((result.status < 200 || result.status >= 400) && result.status !== 404) return failOn.has("non2xx3xx");
  return false;
}

function statusLabel(result) {
  if (!result.ok) return "ERROR";
  return String(result.status);
}

function printSummary(results, failures) {
  const counts = new Map();
  for (const result of results) counts.set(statusLabel(result), (counts.get(statusLabel(result)) || 0) + 1);

  console.log(`Checked ${results.length} URLs`);
  console.log(
    [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([status, count]) => `${status}: ${count}`)
      .join(", ")
  );

  const redirects = results.filter((r) => r.status === 301).length;
  const notFound = results.filter((r) => r.status === 404).length;
  const current = results.filter((r) => r.status === 200).length;
  console.log(`301 redirects: ${redirects}; 200 current pages/assets: ${current}; 404s: ${notFound}`);

  if (!failures.length) return;

  console.log("\nFailures:");
  for (const result of failures.slice(0, 50)) {
    const suffix = result.location ? ` -> ${result.location}` : result.error ? ` (${result.error})` : "";
    console.log(`${statusLabel(result)} ${result.path}${suffix}`);
  }
  if (failures.length > 50) console.log(`...and ${failures.length - 50} more`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const origin = new URL(args.origin).origin;
  const files = await inputFiles(args);
  let entries = await parseInputs(files, origin);
  if (args.limit !== null) entries = entries.slice(0, args.limit);

  if (args.dryRun) {
    console.log(`Parsed ${entries.length} unique URLs from ${files.length} file(s)`);
    for (const entry of entries) console.log(entry.path);
    return;
  }

  console.log(`Checking ${entries.length} URLs against ${origin} with concurrency ${args.concurrency}`);
  const results = await mapConcurrent(entries, args.concurrency, (entry) => fetchStatus(entry, args.timeoutMs));
  const failures = results.filter((result) => isFailure(result, args.failOn));
  printSummary(results, failures);

  if (args.output) {
    await writeFile(resolve(args.output), JSON.stringify({ origin, checkedAt: new Date().toISOString(), results }, null, 2) + "\n");
    console.log(`Wrote ${args.output}`);
  }

  if (failures.length) process.exit(1);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
