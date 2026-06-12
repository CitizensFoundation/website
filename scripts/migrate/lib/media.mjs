// Shared media pipeline: resolve a wp-content/uploads URL from the old site
// to a local file in the archive, copy it (downscaled if very wide) into
// public/uploads/, and return the new web path.

import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import sharp from "sharp";
import { ARCHIVE, UPLOADS_DIR, readMeta } from "./archive.mjs";

const MAX_WIDTH = 1600;
const RASTER = /\.(jpe?g|png|webp)$/i;

export function normalizeUrl(u) {
  let url = String(u).trim();
  url = url.replace(/^http:\/\//, "https://").replace(/^https:\/\/www\./, "https://");
  url = url.split(/[?#]/)[0];
  return url;
}

// Canonical comparison key: the scraper stored NFD percent-encoded filenames
// (Betra-I%CC%81sland-2.png) while page content uses precomposed unicode
// (Betra-Ísland-2.png) — decode and NFC-normalize so both forms match.
function canon(u) {
  let url = normalizeUrl(u);
  try {
    url = decodeURIComponent(url);
  } catch {}
  return url.normalize("NFC");
}

// media-manifest.json maps original URLs to local archive files.
const manifest = new Map();
for (const rec of readMeta("media-manifest.json")) {
  if (rec.url && rec.ok && rec.file) manifest.set(canon(rec.url), rec.file);
}

const stripSize = (u) => u.replace(/-\d+x\d+(\.\w+)$/, "$1");

// Resolve a (possibly size-suffixed, possibly www/http) URL to an archive file.
function resolveLocal(url) {
  const key = canon(url);
  for (const candidate of [key, stripSize(key)]) {
    const hit = manifest.get(candidate);
    if (hit) return { archiveFile: join(ARCHIVE, hit), url: candidate };
    const m = candidate.match(/wp-content\/uploads\/(.+)$/);
    if (m) {
      for (const name of [m[1], m[1].normalize("NFD"), encodeURI(m[1].normalize("NFD"))]) {
        const p = join(ARCHIVE, "media", "originals", "wp-content", "uploads", name);
        if (existsSync(p)) return { archiveFile: p, url: candidate };
      }
    }
  }
  return null;
}

const copied = new Map(); // normalized source url -> web path or null
let resized = 0;
export const unresolved = [];

export async function copyMedia(url) {
  if (!url || !/wp-content\/uploads\//.test(url)) return null;
  const key = stripSize(canon(url));
  if (copied.has(key)) return copied.get(key);

  const hit = resolveLocal(url);
  if (!hit) {
    unresolved.push(url);
    copied.set(key, null);
    return null;
  }

  // Destination keeps clean NFC unicode filenames; the web path is
  // percent-encoded so it is safe to embed in markdown/HTML attributes.
  const rel = hit.url.match(/wp-content\/uploads\/(.+)$/)[1]; // YYYY/MM/file
  const dest = join(UPLOADS_DIR, rel);
  const webPath = encodeURI("/uploads/" + rel);
  mkdirSync(dirname(dest), { recursive: true });

  if (RASTER.test(basename(dest))) {
    try {
      const img = sharp(hit.archiveFile);
      const meta = await img.metadata();
      if ((meta.width || 0) > MAX_WIDTH) {
        await img
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: 82, force: false })
          .toFile(dest);
        resized++;
      } else {
        copyFileSync(hit.archiveFile, dest);
      }
    } catch (e) {
      // Corrupt or unreadable image: keep the original bytes.
      copyFileSync(hit.archiveFile, dest);
    }
  } else {
    copyFileSync(hit.archiveFile, dest);
  }

  copied.set(key, webPath);
  return webPath;
}

export function report() {
  const ok = [...copied.values()].filter(Boolean).length;
  console.log(`\nMedia: ${ok} files copied (${resized} downscaled to ≤${MAX_WIDTH}px).`);
  if (unresolved.length) {
    console.warn(`Unresolved media (${unresolved.length}) — dropped from content:`);
    for (const u of unresolved) console.warn("  " + u);
  } else {
    console.log("Unresolved media: 0");
  }
}
