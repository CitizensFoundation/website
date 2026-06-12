// Paths and loaders for the read-only WordPress scrape. Nothing in this
// migration may ever write inside ARCHIVE.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..", "..", "..");
export const ARCHIVE = join(ROOT, "allContentFromOldWebsite");

export const CONTENT_DIR = join(ROOT, "content");
export const UPLOADS_DIR = join(ROOT, "public", "uploads");

export function readMeta(name) {
  return JSON.parse(readFileSync(join(ARCHIVE, "metadata", name), "utf8"));
}
