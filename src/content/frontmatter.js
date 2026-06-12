// Minimal frontmatter reader/writer shared by the app, the content-index Vite
// plugin, and the one-time migration scripts. We control both ends, so the
// format is a strict YAML subset: every value is JSON-encoded on one line.
//
//   ---
//   title: "Better Reykjavik"
//   gallery: ["/uploads/a.png", "/uploads/b.png"]
//   ---

export function serializeFrontmatter(meta) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(meta)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (value === "") continue;
    lines.push(`${key}: ${JSON.stringify(value)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

export function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return { meta: {}, body: raw };
  const meta = {};
  for (const line of raw.slice(4, end).split("\n")) {
    const sep = line.indexOf(": ");
    if (sep === -1) continue;
    try {
      meta[line.slice(0, sep)] = JSON.parse(line.slice(sep + 2));
    } catch {
      meta[line.slice(0, sep)] = line.slice(sep + 2);
    }
  }
  return { meta, body: raw.slice(end + 5).replace(/^\n+/, "") };
}
