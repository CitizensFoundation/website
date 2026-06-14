import { useEffect, useRef, useState } from "react";
import HeroCanvas from "./HeroCanvas.jsx";
import { CONTENT_INDEX } from "virtual:content-index";
import { BlogIndex, ImpactIndex, ArticlePage, formatDate, formatMonthYear } from "./pages.jsx";
import { YourPrioritiesPage, PolicySynthPage, AllOurIdeasPage, OpenSourcePage } from "./platforms.jsx";
import { AboutPage, ContactPage, NewsPage, WorkWithUsPage } from "./company.jsx";
import { IconGitHub, IconLinkedIn, IconFacebook, IconX } from "./icons.jsx";
import { PLAUSIBLE_EVENTS, plausibleClass, trackPlausible } from "./plausible.js";
// Partner "News That Caught Our Eye" widget — parked until Reboot Democracy
// exposes the current weekly collection for public read. To re-enable: restore
// this import and the <PartnerNews /> mount before the footer.
// import PartnerNews from "./PartnerNews.jsx";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/CitizensFoundation", Icon: IconGitHub },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/citizens-foundation-global/", Icon: IconLinkedIn },
  { label: "Facebook", href: "https://www.facebook.com/Citizens.is/", Icon: IconFacebook },
  { label: "X (Twitter)", href: "https://twitter.com/CitizensFNDN", Icon: IconX },
];

const NAV = [
  { label: "Platforms", href: "/#platforms" },
  { label: "Impact", href: "/impact/" },
  { label: "Open Source", href: "/open-source/" },
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

// Is this nav link the current section? Platform pages light up "Platforms";
// article routes (blog/<slug>, impact/<slug>) light up their section.
function isNavActive(href, route) {
  if (href === "/#platforms") {
    return ["your-priorities", "policy-synth", "all-our-ideas"].includes(route);
  }
  const id = href.replace(/^\/+|\/+$/g, "").split("#")[0];
  return !!id && (route === id || route.startsWith(id + "/"));
}

const PLATFORMS = [
  {
    name: "Your Priorities",
    href: "/your-priorities/",
    icon: "/assets/yp-mark.png",
    event: PLAUSIBLE_EVENTS.yourPriorities,
    blurb:
      "Our flagship engagement platform: idea generation, civil debate, voting, surveys and participatory budgeting — trusted by cities and parliaments since 2008.",
  },
  {
    name: "Policy Synth",
    href: "/policy-synth/",
    icon: "/assets/ps-mark.png",
    event: PLAUSIBLE_EVENTS.policySynth,
    blurb:
      "Teams of AI agents that research problems and evolve policy solutions — standalone or built right into Your Priorities, with human votes always in the loop.",
  },
  {
    name: "All Our Ideas",
    href: "/all-our-ideas/",
    icon: "/assets/aoi-mark.png",
    blurb:
      "Wiki surveys: show people two ideas, let them pick one. Created at Princeton, now maintained by us and built into Your Priorities.",
  },
];

// Count-up stat. SSR renders the final value; on the client the number is
// animated by writing textContent directly, so hydration never mismatches.
function Stat({ value, suffix = "", grouped = false, animate = true, label, srLabel }) {
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
      <span className="stat-value" ref={ref} aria-hidden="true">{fmt(value)}</span>
      <span className="stat-label" aria-hidden="true">{label}</span>
      <span className="sr-only">{srLabel || `${fmt(value)} ${label}`}</span>
    </div>
  );
}

function HomePage() {
  const stories = CONTENT_INDEX.filter((e) => e.type === "impact").slice(0, 3);
  const posts = CONTENT_INDEX.filter((e) => e.type === "blog").slice(0, 3);

  return (
    <>
      <section className="hero">
        <HeroCanvas faces />
        <div className="shell hero-inner">
          <p className="eyebrow">Reykjavík, Iceland — since 2008</p>
          <h1>
            Better public decisions with collective intelligence&nbsp;&amp;&nbsp;AI
          </h1>
          <p className="lede">
            Open-source platforms that help people surface ideas, weigh
            trade-offs, and turn public input into decisions governments can act
            on — building trust across over 50 countries.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="/impact/">Explore our work</a>
            <a className={`btn btn-ghost ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="/your-priorities/">Your Priorities <span aria-hidden="true">→</span></a>
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
          <Stat value={2008} animate={false} label="founded in Reykjavík" srLabel="Founded in 2008, Reykjavík" />
          <Stat value={50} suffix="+" label="countries" />
          <Stat value={1000000} grouped suffix="+" label="citizen voices" />
          <Stat value={100} suffix="%" label="open source" />
        </div>
      </section>

      <section className="section reveal" id="platforms">
        <div className="shell">
          <h2 className="section-title">Platforms</h2>
          <div className="card-grid">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                className={`card platform-card ${p.event ? plausibleClass(p.event) : ""}`}
                href={p.href}
              >
                <span className="platform-mark"><img src={p.icon} alt="" /></span>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <span className="aurora-link card-link">Learn more <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="shell">
          <div className="section-head">
            <h2 className="section-title">Impact</h2>
            <a className="aurora-link" href="/impact/">View all stories <span aria-hidden="true">→</span></a>
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
            <a className="aurora-link" href="/blog/">All posts <span aria-hidden="true">→</span></a>
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

      <section className="section reveal">
        <div className="shell">
          <p className="eyebrow">In the spotlight</p>
          <h2 className="section-title">Human + AI policymaking — the paper and the article</h2>
          <div className="spotlight">
            <a
              className="spotlight-feature"
              href="/impact/smarter-crowdsourcing-election-subversion/"
            >
              <span
                className="spotlight-cover"
                style={{ backgroundImage: "url(/uploads/2026/06/smarter-crowdsourcing-election-subversion-cover-chatgpt.png)" }}
                aria-hidden="true"
              />
              <span className="spotlight-feature-copy">
                <span className="story-place">Impact study</span>
                <h3>Smarter Crowdsourcing: Countering Election Subversion</h3>
                <p>
                  With Democracy Fund and The GovLab — the first real-world case
                  study of Smarter Crowdsourcing accelerated by Policy Synth AI
                  agents, delivered ahead of the 2024 US elections.
                </p>
                <span className="aurora-link card-link">Read the case study <span aria-hidden="true">→</span></span>
              </span>
            </a>
            <div className="spotlight-refs">
              <a
                className="spotlight-ref"
                href="https://arxiv.org/abs/2407.13960"
                target="_blank"
                rel="noopener"
              >
                <span
                  className="spotlight-ref-thumb"
                  style={{ backgroundImage: "url(/uploads/2026/06/smarter-crowdsourcing-arxiv.png)" }}
                  aria-hidden="true"
                />
                <span className="spotlight-ref-copy">
                  <span className="story-place">Research paper · ACM CI 2024</span>
                  <strong>Using Artificial Intelligence to Accelerate Collective Intelligence</strong>
                  <span className="spotlight-ref-meta">Róbert Bjarnason, Dane Gambrell &amp; Joshua Lanthier-Welch</span>
                  <span className="aurora-link card-link">Read on arXiv <span aria-hidden="true">↗</span></span>
                </span>
              </a>
              <a
                className="spotlight-ref"
                href="https://www.fastcompany.com/91001497/ai-faith-in-democracy"
                target="_blank"
                rel="noopener"
              >
                <span
                  className="spotlight-ref-thumb"
                  style={{ backgroundImage: "url(/uploads/2026/06/smarter-crowdsourcing-fastcompany.png)" }}
                  aria-hidden="true"
                />
                <span className="spotlight-ref-copy">
                  <span className="story-place">Fast Company</span>
                  <strong>How AI could restore our faith in democracy</strong>
                  <span className="spotlight-ref-meta">By Beth Simone Noveck</span>
                  <span className="aurora-link card-link">Read the article <span aria-hidden="true">↗</span></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="shell">
          <h2 className="section-title">100% open source</h2>
          <a className="os-banner" href="/open-source/">
            <span className="aurora-glow" aria-hidden="true" />
            <div className="os-banner-text">
              <h3 className="os-banner-title">Trust is earned<br />in the open</h3>
              <p className="os-banner-sub">
                So everything we build is open — free, MIT-licensed and published
                on npm. The exact code running New Jersey, Iceland’s ministries
                and ERIC, there for anyone to audit. No black boxes, no lock-in.
              </p>
              <span className="os-banner-cta">Explore the packages <span aria-hidden="true">→</span></span>
              <div className="os-pills">
                <span>TypeScript</span><span>MIT</span><span>npm</span><span>GitHub</span>
              </div>
            </div>
            <div className="os-banner-visual" aria-hidden="true">
              <div className="terminal">
                <div className="terminal-bar"><i /><i /><i /><span className="terminal-title">bash</span></div>
                <div className="terminal-body">
                  <div><span className="tprompt">$</span> npm install <span className="tpkg">@policysynth/agents</span></div>
                  <div className="tdim">added @policysynth/agents · MIT licensed</div>
                  <div className="tgap" />
                  <div><span className="tprompt">$</span> git clone <span className="tpkg">CitizensFoundation/your-priorities-app</span></div>
                  <div className="tdim">✓ 17 years of civic-tech, in the open</div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      <section className="section reveal">
        <div className="shell">
          <div className="recognition">
            <span className="aurora-glow" aria-hidden="true" />
            <p className="eyebrow">Independently top-rated</p>
            <h2 className="recognition-title">
              The top-rated citizen<br />engagement platform
            </h2>
            <p className="recognition-score">
              Your Priorities scored <strong>97<span className="of">/100</span></strong>
              {" "}— the highest-rated platform in People Powered’s independent
              2025 Digital Participation Tools ratings.
            </p>
            <div className="badges">
              <a className="badge" href="https://www.peoplepowered.org/platform-ratings">
                <span className="badge-rank">#1</span>
                <span className="badge-label">People Powered<br />2025 Ratings</span>
              </a>
              <a className="badge" href="https://www.oecd.org/publications/oecd-guidelines-for-citizen-participation-processes-f765caf6-en.htm">
                <span className="badge-rank" aria-hidden="true">◆</span>
                <span className="badge-label">OECD<br />Guidelines</span>
              </a>
              <a className="badge" href="https://www.solonian-institute.com/publications">
                <span className="badge-rank" aria-hidden="true">★</span>
                <span className="badge-label">Digital Democracy<br />Report 2024</span>
              </a>
            </div>
            <div className="cta-row recognition-cta">
              <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.workWithUs)}`} href="/work-with-us/">Start a project <span aria-hidden="true">→</span></a>
              <a className={`btn btn-ghost ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="/your-priorities/">Explore the platform</a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-logo-strip reveal" aria-label="Citizens Foundation">
        <img
          src="/uploads/2022/03/Citizens-FoundationWideNoText-transparent.png"
          alt="Citizens Foundation"
        />
      </section>
    </>
  );
}

function NotFound() {
  useEffect(() => {
    trackPlausible(PLAUSIBLE_EVENTS.notFound, {
      props: { path: window.location.pathname },
    });
  }, []);

  return (
    <section className="section">
      <div className="shell notfound">
        <p className="eyebrow">Error 404</p>
        <h1>Page not found</h1>
        <p className="lede">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/">Back to home</a>
          <a className="btn btn-ghost" href="/impact/">Explore our work</a>
        </div>
      </div>
    </section>
  );
}

export default function App({ initialRoute, initialDoc }) {
  // Mobile nav drawer. Starts closed on both server and client, so there's no
  // hydration mismatch; the toggle only exists on small screens (CSS).
  const [menuOpen, setMenuOpen] = useState(false);

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
  if (initialRoute === "not-found") page = <NotFound />;
  else if (initialRoute === "blog") page = <BlogIndex />;
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
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="shell header-row">
          <a className="wordmark" href="/">
            <img src="/assets/citizens-logo.png" alt="citizens.is — Citizens Foundation" />
          </a>
          <nav className="site-nav">
            {NAV.map((item) => {
              const active = isNavActive(item.href, initialRoute);
              return (
                <a
                  key={item.label}
                  className={`aurora-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  href={item.href}
                >{item.label}</a>
              );
            })}
            <a className={`btn btn-primary btn-small ${plausibleClass(PLAUSIBLE_EVENTS.workWithUs)}`} href="/work-with-us/">Work with us</a>
          </nav>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav">
            {NAV.map((item) => {
              const active = isNavActive(item.href, initialRoute);
              return (
                <a
                  key={item.label}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.workWithUs)}`} href="/work-with-us/" onClick={() => setMenuOpen(false)}>
              Work with us
            </a>
          </nav>
        )}
      </header>

      <main id="main" tabIndex={-1}>{page}</main>

      {/* <PartnerNews /> — parked (see import note above) */}

      <footer className="site-footer">
        <div className="shell footer-row">
          <span className="footer-brand">
            <img src="/assets/cf-mark.png" alt="" width="14" height="20" />
            © 2026 Citizens Foundation
          </span>
          <span className="footer-links">
            {FOOTER_NAV.map((item) => {
              const active = isNavActive(item.href, initialRoute);
              return (
                <a
                  key={item.label}
                  className={`aurora-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  href={item.href}
                >{item.label}</a>
              );
            })}
          </span>
          <span className="footer-social">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                className={label === "GitHub" ? plausibleClass(PLAUSIBLE_EVENTS.github) : undefined}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                title={label}
              >
                <Icon />
              </a>
            ))}
          </span>
        </div>
      </footer>
    </>
  );
}
