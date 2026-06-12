import { useEffect, useRef } from "react";
import HeroCanvas from "./HeroCanvas.jsx";
import { CONTENT_INDEX } from "virtual:content-index";
import { BlogIndex, ImpactIndex, ArticlePage, formatDate, formatMonthYear } from "./pages.jsx";

const NAV = [
  { label: "Platforms", href: "#" },
  { label: "Impact", href: "/impact/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "#" },
];

// Homepage copy is still placeholder; the teasers below pull real migrated
// content from the index.
const PLATFORMS = [
  {
    name: "Your Priorities",
    blurb:
      "Placeholder — a two-line description of the platform lives here, what it does and who it is for.",
  },
  {
    name: "Policy Synth",
    blurb:
      "Placeholder — a two-line description of the platform lives here, what it does and who it is for.",
  },
  {
    name: "All Our Ideas",
    blurb:
      "Placeholder — a two-line description of the platform lives here, what it does and who it is for.",
  },
];

// Count-up stat. SSR renders the final value; on the client the number is
// animated by writing textContent directly, so hydration never mismatches.
function Stat({ value, suffix = "", grouped = false, animate = true, label }) {
  const ref = useRef(null);
  const fmt = (n) =>
    (grouped ? Math.round(n).toLocaleString("en-US") : String(Math.round(n))) + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(value * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  });

  return (
    <div className="stat">
      <span className="stat-value" ref={ref}>{fmt(value)}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function HomePage() {
  const stories = CONTENT_INDEX.filter((e) => e.type === "impact").slice(0, 3);
  const posts = CONTENT_INDEX.filter((e) => e.type === "blog").slice(0, 3);

  return (
    <>
      <section className="hero">
        <HeroCanvas />
        <div className="shell hero-inner">
          <p className="eyebrow">Reykjavík, Iceland — since 2008</p>
          <h1>
            Forging better communities with democratic innovation&nbsp;&amp;&nbsp;AI
          </h1>
          <p className="lede">
            Placeholder subtitle — one calm sentence about open-source platforms,
            citizens and governments will live here.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="/impact/">Explore our work</a>
            <a className="btn btn-ghost" href="#">Your Priorities →</a>
          </div>
        </div>
      </section>

      <section className="stats reveal">
        <div className="shell stats-row">
          <Stat value={2008} animate={false} label="founded in Reykjavík" />
          <Stat value={45} label="countries" />
          <Stat value={1000000} grouped suffix="+" label="citizen voices" />
          <Stat value={100} suffix="%" label="open source" />
        </div>
      </section>

      <section className="section reveal">
        <div className="shell">
          <h2 className="section-title">Platforms</h2>
          <div className="card-grid">
            {PLATFORMS.map((p) => (
              <article key={p.name} className="card">
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <a className="aurora-link card-link" href="#">Learn more →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="shell">
          <div className="section-head">
            <h2 className="section-title">Impact</h2>
            <a className="aurora-link" href="/impact/">View all stories →</a>
          </div>
          <div className="card-grid">
            {stories.map((s) => (
              <a key={s.slug} className="card story-card" href={`/impact/${s.slug}/`}>
                <div
                  className="story-thumb"
                  style={s.hero ? { backgroundImage: `url(${s.hero})` } : undefined}
                />
                <h3>{s.title}</h3>
                <p className="story-place">{formatMonthYear(s.date)}</p>
                <p>{s.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="shell">
          <div className="section-head">
            <h2 className="section-title">From the blog</h2>
            <a className="aurora-link" href="/blog/">All posts →</a>
          </div>
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <a className="aurora-link post-title" href={`/blog/${p.slug}/`}>{p.title}</a>
                <span className="post-date">{formatDate(p.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default function App({ initialRoute, initialDoc }) {
  // Scroll reveals: sections start hidden only once JS is running, then fade
  // in as they enter the viewport. SSR output stays fully visible.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.classList.add("reveal-init");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  let page;
  if (initialRoute === "blog") page = <BlogIndex />;
  else if (initialRoute === "impact") page = <ImpactIndex />;
  else if (initialRoute.startsWith("blog/") || initialRoute.startsWith("impact/")) {
    page = <ArticlePage doc={initialDoc} />;
  } else page = <HomePage />;

  return (
    <>
      <header className="site-header">
        <div className="shell header-row">
          <a className="wordmark" href="/">
            <img src="/assets/cf-mark.png" alt="" width="21" height="30" />
            Citizens Foundation
          </a>
          <nav className="site-nav">
            {NAV.map((item) => (
              <a key={item.label} className="aurora-link" href={item.href}>{item.label}</a>
            ))}
            <a className="btn btn-primary btn-small" href="#">Donate</a>
          </nav>
        </div>
      </header>

      <main>{page}</main>

      <footer className="site-footer">
        <div className="shell footer-row">
          <span className="footer-brand">
            <img src="/assets/cf-mark.png" alt="" width="14" height="20" />
            © 2026 Citizens Foundation
          </span>
          <span className="footer-links">
            {NAV.map((item) => (
              <a key={item.label} className="aurora-link" href={item.href}>{item.label}</a>
            ))}
          </span>
        </div>
      </footer>
    </>
  );
}
