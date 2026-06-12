import { useEffect, useRef } from "react";
import HeroCanvas from "./HeroCanvas.jsx";
import { CONTENT_INDEX } from "virtual:content-index";
import { BlogIndex, ImpactIndex, ArticlePage, formatDate, formatMonthYear } from "./pages.jsx";
import { YourPrioritiesPage, PolicySynthPage, AllOurIdeasPage, OpenSourcePage } from "./platforms.jsx";
import { AboutPage, ContactPage, NewsPage, WorkWithUsPage } from "./company.jsx";
import { IconGitHub, IconLinkedIn, IconFacebook, IconX } from "./icons.jsx";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/CitizensFoundation", Icon: IconGitHub },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/citizens-foundation-global/", Icon: IconLinkedIn },
  { label: "Facebook", href: "https://www.facebook.com/Citizens.is/", Icon: IconFacebook },
  { label: "X (Twitter)", href: "https://twitter.com/CitizensFNDN", Icon: IconX },
];

const NAV = [
  { label: "Platforms", href: "/#platforms" },
  { label: "Impact", href: "/impact/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
];

const FOOTER_NAV = [
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "In the News", href: "/in-the-news/" },
  { label: "Open Source", href: "/open-source/" },
  { label: "Work with us", href: "/work-with-us/" },
];

const PLATFORMS = [
  {
    name: "Your Priorities",
    href: "/your-priorities/",
    blurb:
      "Our flagship engagement platform: idea generation, civil debate, voting, surveys and participatory budgeting — trusted by cities and parliaments since 2008.",
  },
  {
    name: "Policy Synth",
    href: "/policy-synth/",
    blurb:
      "Teams of AI agents that research problems and evolve policy solutions — standalone or built right into Your Priorities, with human votes always in the loop.",
  },
  {
    name: "All Our Ideas",
    href: "/all-our-ideas/",
    blurb:
      "Wiki surveys: show people two ideas, let them pick one. Created at Princeton, now maintained by us and built into Your Priorities.",
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
            Open-source platforms and AI tools that connect citizens and
            governments — in thousands of projects across 45 countries.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="/impact/">Explore our work</a>
            <a className="btn btn-ghost" href="/your-priorities/">Your Priorities →</a>
          </div>
        </div>
      </section>

      <a className="press-strip reveal" href="/in-the-news/">
        <span className="press-strip-label">As featured in</span>
        <span className="press-strip-names">
          Financial Times · The Guardian · The Washington Post · Fast Company ·
          Scientific American · GovTech
        </span>
      </a>

      <section className="stats reveal">
        <div className="shell stats-row">
          <Stat value={2008} animate={false} label="founded in Reykjavík" />
          <Stat value={45} label="countries" />
          <Stat value={1000000} grouped suffix="+" label="citizen voices" />
          <Stat value={100} suffix="%" label="open source" />
        </div>
      </section>

      <section className="section reveal" id="platforms">
        <div className="shell">
          <h2 className="section-title">Platforms</h2>
          <div className="card-grid">
            {PLATFORMS.map((p) => (
              <article key={p.name} className="card">
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <a className="aurora-link card-link" href={p.href}>Learn more →</a>
              </article>
            ))}
          </div>
          <a className="os-strip" href="/open-source/">
            <span>
              <strong>100% open source.</strong> Every platform above is free,
              MIT-licensed and published on npm — inspect the code that counts the votes.
            </span>
            <span className="aurora-link">Explore the packages →</span>
          </a>
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
  else if (initialRoute === "your-priorities") page = <YourPrioritiesPage />;
  else if (initialRoute === "policy-synth") page = <PolicySynthPage />;
  else if (initialRoute === "all-our-ideas") page = <AllOurIdeasPage />;
  else if (initialRoute === "open-source") page = <OpenSourcePage />;
  else if (initialRoute === "about") page = <AboutPage />;
  else if (initialRoute === "contact") page = <ContactPage />;
  else if (initialRoute === "in-the-news") page = <NewsPage />;
  else if (initialRoute === "work-with-us") page = <WorkWithUsPage />;
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
            <a className="btn btn-primary btn-small" href="/work-with-us/">Work with us</a>
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
            {FOOTER_NAV.map((item) => (
              <a key={item.label} className="aurora-link" href={item.href}>{item.label}</a>
            ))}
          </span>
          <span className="footer-social">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={label} href={href} aria-label={label} title={label}>
                <Icon />
              </a>
            ))}
          </span>
        </div>
      </footer>
    </>
  );
}
