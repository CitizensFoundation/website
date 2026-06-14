import { marked } from "marked";
import { CONTENT_INDEX } from "virtual:content-index";

// The page title is the only <h1>; demote any stray <h1> in a markdown body to
// <h2> (leaves existing h2/h3 section headings untouched, so no level skips).
marked.use({
  walkTokens(token) {
    if (token.type === "heading" && token.depth === 1) token.depth = 2;
  },
});

// Render an article body: lazy-load its images (the hero above stays eager) and
// open external links in a new tab (internal "/..." links stay in the same tab).
function renderArticleHtml(body) {
  return marked
    .parse(body)
    .replace(/<img /g, '<img loading="lazy" decoding="async" ')
    .replace(/<a href="(https?:\/\/[^"]*)"/g, '<a href="$1" target="_blank" rel="noopener"');
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Explicit English formatting — toLocaleDateString would differ between the
// build's Node and visitors' browsers and cause hydration mismatches.
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// Impact dates often only carry month/year precision (day defaulted to 01
// during migration), so stories show "May 2010" rather than a fake exact day.
export function formatMonthYear(iso) {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function BlogIndex() {
  const posts = CONTENT_INDEX.filter((e) => e.type === "blog");
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">News &amp; writing since 2011</p>
        <h1 className="page-title">Blog</h1>
        <ul className="post-list post-list-full">
          {posts.map((p) => (
            <li key={p.slug}>
              <a className="post-row" href={`/blog/${p.slug}/`}>
                {p.hero && (
                  <span
                    className="post-thumb"
                    style={{ backgroundImage: `url(${p.hero})` }}
                    aria-hidden="true"
                  />
                )}
                <span className="post-row-main">
                  <span className="post-title">{p.title}</span>
                  {p.excerpt && <p className="post-excerpt">{p.excerpt}</p>}
                </span>
                <span className="post-date">{formatDate(p.date)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ImpactIndex() {
  const stories = CONTENT_INDEX.filter((e) => e.type === "impact");
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Citizen engagement in over 50 countries since 2008</p>
        <h1 className="page-title">Impact</h1>
        <a
          className="impact-award"
          href="https://www.solonian-institute.com/post/2022-sdi-digital-democracy-awards"
          target="_blank"
          rel="noopener"
        >
          <img
            src="/uploads/2022/09/sdi-digital-democracy-impact-award-2022.jpg"
            alt="Citizens Foundation receiving the 2022 SDI Digital Democracy Impact Award"
          />
          <span className="impact-award-copy">
            <span className="story-place">Award</span>
            <strong>2022 SDI Digital Democracy Impact Award</strong>
            <span>
              The Solonian Democracy Institute recognized Citizens Foundation for
              pioneering bottom-up e-democracy projects across over 50 countries,
              from ideation and deliberation to public consultation,
              decision-making and participatory budgeting.
            </span>
            <span className="aurora-link card-link">Read the award note <span aria-hidden="true">→</span></span>
          </span>
        </a>
        <div className="card-grid">
          {stories.map((s) => (
            <a key={s.slug} className="card story-card" href={`/impact/${s.slug}/`}>
              <div
                className="story-thumb"
                style={s.hero ? { backgroundImage: `url(${s.hero})` } : undefined}
              />
              <h3>{s.title}</h3>
              <p>{s.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticlePage({ doc }) {
  if (!doc) return null;
  const isImpact = doc.type === "impact";
  const gallery = (doc.gallery || []).filter((g) => g !== doc.hero);
  return (
    <article className="section">
      <div className="shell article-shell">
        <p className="eyebrow">
          <a className="aurora-link" href={isImpact ? "/impact/" : "/blog/"}>
            {isImpact ? "Impact" : "Blog"}
          </a>
          {" · "}
          {isImpact ? formatMonthYear(doc.date) : formatDate(doc.date)}
          {doc.categories?.length ? ` · ${doc.categories.join(", ")}` : ""}
        </p>
        <h1 className="article-title">{doc.title}</h1>
        {doc.hero && <img className="article-hero" src={doc.hero} alt="" />}
        <div className="article" dangerouslySetInnerHTML={{ __html: renderArticleHtml(doc.body) }} />
        {doc.videos?.map((v) => (
          <div className="video-embed" key={v}>
            <iframe src={v} title={doc.title} allowFullScreen loading="lazy" />
          </div>
        ))}
        {gallery.length > 0 && (
          <figure
            className="article-gallery"
            aria-label={`Gallery — ${doc.title} (${gallery.length} ${gallery.length === 1 ? "image" : "images"})`}
          >
            {gallery.map((g) => (
              <img key={g} src={g} alt="" loading="lazy" />
            ))}
          </figure>
        )}
        {doc.link && (
          <p className="article-visit">
            <a className="btn btn-primary" href={doc.link}>Visit project <span aria-hidden="true">→</span></a>
          </p>
        )}
      </div>
    </article>
  );
}
