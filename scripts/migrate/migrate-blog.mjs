// One-time: rest-posts.json -> content/blog/<date>-<slug>.md

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { readMeta, CONTENT_DIR } from "./lib/archive.mjs";
import { copyMedia } from "./lib/media.mjs";
import { createConverter } from "./lib/html-to-md.mjs";
import { serializeFrontmatter } from "../../src/content/frontmatter.js";

// WP category ids; id 1 ("Uncategorized") is intentionally absent.
const CATEGORY_NAMES = { 145: "Democracy Games", 147: "Digital Democracy" };

const textOf = (html) => load(html).text().replace(/\s+/g, " ").trim();

function cleanExcerpt(html) {
  const text = textOf(html);
  const truncated = /(\[…\]|\[\.\.\.\]|…|\.\.\.)\s*$/.test(text);
  let out = text.replace(/\s*(\[…\]|\[\.\.\.\]|…|\.\.\.)\s*$/, "").trim();
  // WP truncation often cuts mid-sentence ("… Check it out! 📢 The") — end at
  // the last complete sentence when one exists.
  if (truncated) {
    const m = out.match(/^[\s\S]*[.!?]["”’')\]]*(?=\s|$)/);
    if (m && m[0].length > 40) out = m[0].trim();
  }
  return out;
}

export async function migrateBlog({ blogSlugs, impactSlugs }) {
  const posts = readMeta("rest-posts.json").filter((p) => p.status === "publish");
  const mediaById = new Map(readMeta("rest-media.json").map((m) => [m.id, m]));
  const convert = createConverter({ blogSlugs, impactSlugs });
  mkdirSync(join(CONTENT_DIR, "blog"), { recursive: true });

  for (const post of posts) {
    const date = post.date.slice(0, 10);
    const att = mediaById.get(post.featured_media);
    const heroUrl =
      att?.media_details?.sizes?.full?.source_url ||
      att?.source_url ||
      post.yoast_head_json?.og_image?.[0]?.url ||
      null;

    const meta = {
      title: textOf(post.title.rendered),
      slug: post.slug,
      date,
      hero: heroUrl ? await copyMedia(heroUrl) : null,
      excerpt: cleanExcerpt(post.excerpt.rendered),
      categories: post.categories.map((id) => CATEGORY_NAMES[id]).filter(Boolean),
    };
    const body = await convert(post.content.rendered);
    writeFileSync(
      join(CONTENT_DIR, "blog", `${date}-${post.slug}.md`),
      serializeFrontmatter(meta) + "\n" + body + "\n"
    );
  }
  console.log(`Blog: ${posts.length} posts -> content/blog/`);
  return posts.length;
}
