import { useEffect, useState } from "react";

// "News That Caught Our Eye" — a live, client-side widget pulling the latest
// curated roundup from our partners at Reboot Democracy (Burnes Center for
// Social Change & The GovLab). Their Directus CMS is public and CORS-allows
// citizens.is, so we read it directly. If it's ever unreachable the band
// simply doesn't render — it never blocks or breaks the page.

const FEED =
  "https://directus.theburnescenter.org/items/reboot_democracy_blog" +
  "?filter[title][_contains]=" + encodeURIComponent("Caught Our Eye") +
  "&filter[status][_eq]=published&sort=-date&limit=1" +
  "&fields=" + encodeURIComponent("title,date,fullURL,slug,content");

const MAX_ITEMS = 6;

function issueUrl(post) {
  const u = post.fullURL || "";
  if (/^https?:\/\//.test(u)) return u;
  return "https://rebootdemocracy.ai/blog/" + (post.slug || "");
}

// Each curated item is a <p> that leads with the article link, followed by
// " — Source, Author, Date". Quote/blurb paragraphs (which start with text)
// are skipped. Section comes from the nearest preceding <h2>.
function parseItems(html) {
  if (typeof window === "undefined" || !window.DOMParser) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out = [];
  let section = null;
  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase();
    if (tag === "h1" || tag === "h2" || tag === "h3") {
      section = (el.textContent || "").trim();
      continue;
    }
    if (tag !== "p") continue;
    const a = el.querySelector("a");
    if (!a) continue;
    const leadsWithLink =
      el.firstChild === a ||
      (el.firstChild &&
        el.firstChild.nodeType === 3 &&
        !el.firstChild.textContent.trim() &&
        el.firstElementChild === a);
    if (!leadsWithLink) continue;
    const title = (a.textContent || "").replace(/\s+/g, " ").trim();
    const href = a.getAttribute("href") || "";
    if (!title || !/^https?:/.test(href)) continue;
    const full = (el.textContent || "").replace(/\s+/g, " ").trim();
    const meta = full.slice(title.length).replace(/^\s*[-–—:]\s*/, "").trim();
    out.push({ section, title, href, meta });
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

export default function PartnerNews() {
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    fetch(FEED, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("status"))))
      .then((j) => {
        const post = j && j.data && j.data[0];
        if (!alive || !post) return;
        const items = parseItems(post.content || "");
        if (items.length) {
          setIssue({ title: post.title, date: post.date, url: issueUrl(post), items });
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => {
      alive = false;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  // Nothing renders until a roundup loads — both SSR and first client paint
  // return null, so hydration matches and a failed fetch is invisible.
  if (!issue) return null;

  return (
    <section className="partners" aria-label="News from our partners">
      <div className="shell">
        <div className="partners-head">
          <div>
            <p className="eyebrow">From our partners</p>
            <h2 className="section-title">News that caught our eye</h2>
            <p className="partners-sub">
              A weekly roundup of AI, governance and democracy reading, curated by{" "}
              <a className="aurora-link" href={issue.url} target="_blank" rel="noopener noreferrer">
                Reboot&nbsp;Democracy
              </a>.
            </p>
          </div>
          <a
            className="partner-logos"
            href="https://rebootdemocracy.ai/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reboot Democracy — by the Burnes Center for Social Change and The GovLab"
          >
            <img src="/assets/partner-burnes.svg" alt="Burnes Center for Social Change" />
            <img src="/assets/partner-govlab.svg" alt="The GovLab" />
          </a>
        </div>

        <ul className="partner-list">
          {issue.items.map((it) => (
            <li key={it.href}>
              <a href={it.href} target="_blank" rel="noopener noreferrer">
                {it.section && <span className="partner-tag">{it.section}</span>}
                <span className="partner-title">{it.title}</span>
                {it.meta && <span className="partner-meta">{it.meta}</span>}
              </a>
            </li>
          ))}
        </ul>

        <a className="partners-more aurora-link" href={issue.url} target="_blank" rel="noopener noreferrer">
          See the full roundup at Reboot Democracy →
        </a>
      </div>
    </section>
  );
}
