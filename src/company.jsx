import HeroCanvas from "./HeroCanvas.jsx";
import { IconUsers, IconGlobe, IconCode, IconGitHub, IconLinkedIn, IconFacebook, IconX } from "./icons.jsx";
import { PLAUSIBLE_EVENTS, plausibleClass } from "./plausible.js";

function PageHero({ eyebrow, title, lede, ctas, logo, logoHeight = 150, logoOnly = false }) {
  return (
    <section className="hero hero-compact">
      <HeroCanvas />
      <div className="shell hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        {logoOnly ? (
          <h1 className="hero-logo-h1">
            <img className="hero-logo" src={logo} alt="" style={{ height: logoHeight }} />
            <span className="sr-only">{title}</span>
          </h1>
        ) : (
          <>
            {logo && <img className="hero-logo" src={logo} alt="" style={{ height: logoHeight }} />}
            <h1>{title}</h1>
          </>
        )}
        <p className="lede">{lede}</p>
        {ctas && <div className="cta-row">{ctas}</div>}
      </div>
    </section>
  );
}

function VideoCard({ src, title }) {
  return (
    <figure className="video-card">
      <div className="video-embed">
        <iframe src={src} title={title} allowFullScreen loading="lazy" />
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
}

export { PageHero, VideoCard };

// ---------- About ----------

const TEAM = [
  {
    name: "Róbert Bjarnason",
    role: "Co-founder & CEO",
    photo: "/uploads/2014/07/robertFinal.jpg",
    bio: "Róbert is an entrepreneur who introduced the Web to Iceland in 1993 and to Denmark in 1995. Before co-founding Citizens Foundation in 2008 he worked in the videogame industry, where his teams received many industry awards — including two BAFTAs.",
  },
  {
    name: "Maren Valsdóttir",
    role: "Creative Director",
    photo: "/uploads/2014/07/marenFinal.jpg",
    bio: "Maren is a multimedia artist and designer — a force of creative energy at Citizens Foundation. She has shaped the design of our apps and websites since 2012, contributes to overall strategy and sits on the board of directors.",
  },
  {
    name: "Gunnar Grímsson",
    role: "Co-founder & Ambassador",
    photo: "/uploads/2019/06/GunnarCF-Ambassador-sharper-1-1.jpg",
    bio: "Gunnar has been at the heart of Citizens Foundation since its start. He is an experienced process and interface designer with a strong background in multiple fields, and has worked on citizen engagement projects all over the world.",
  },
];

const FORMER_TEAM = [
  {
    name: "Alexander Máni Gautason",
    role: "Programmer & QA Manager",
    photo: null,
    bio: "Alexander started testing new versions of our open-source software at age 11. Over the years he tested most major releases, helped keep quality high, and later ported much of the new web app from JavaScript to TypeScript before the days of AI coding assistants. He has also supported the Citizens Foundation family in many other ways over the years.",
  },
  {
    name: "Joshua Lanthier-Welch",
    role: "Executive Director, Citizens Foundation America",
    photo: "/uploads/2021/12/josh123.jpg",
    bio: "Josh brought Citizens Foundation America a diverse background, with stints in academic development and philanthropy fundraising, work with Robert in writing, design and business development in the videogame industry, and socially responsible entrepreneurship promoting sustainable agriculture and improved food systems.",
  },
  {
    name: "Katherine Breedlove",
    role: "Director, Citizens Foundation America",
    photo: "/uploads/2020/01/kat.jpg",
    bio: "Katherine brought years of experience in logistics and operations. She worked closely with Josh in social, political and educational outreach in the agricultural sector, helping build a brand that promoted sustainable agriculture and best practices in the food industry.",
  },
  {
    name: "Dave Parsons",
    role: "Consultant",
    photo: "/uploads/2020/01/dave.jpg",
    bio: "David has been involved in the development of Internet applications since 1996, delivering enterprise-level applications for companies including PwC, UBS, Vodafone and BP. In 2004 he founded Decypher Media, developing advanced fintech applications and websites for global hedge funds.",
  },
];

const FILMS = [
  {
    src: "https://player.vimeo.com/video/88214900",
    title: "Short documentary about Better Reykjavík, Your Priorities and Citizens Foundation (2014)",
  },
  {
    src: "https://www.youtube.com/embed/2r444-7kVs0",
    title: "Introduction to Citizens Foundation (2019)",
  },
  {
    src: "https://www.youtube.com/embed/OqzAp4WMHOY",
    title: "Citizens Foundation — CODE Europe Iceland study visit (2021)",
  },
];

const CLOUD_SERVICES = [
  {
    tier: "Free",
    description:
      "If you don't have the budget, for any reason, you don't pay. Unlimited projects and users with free email support.",
    price: "$0",
  },
  {
    tier: "Small",
    description: "For small organizations.",
    price: "$390",
  },
  {
    tier: "Medium",
    description: "For medium sized organizations.",
    price: "$3,300",
  },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Citizens Foundation"
        logo="/uploads/2022/03/Citizens-FoundationWideNoText-transparent.png"
        logoHeight={170}
        logoOnly
        lede="A non-profit in Reykjavík, Iceland, founded in 2008 — bringing
          people together to debate and prioritize ideas that improve their
          communities."
        ctas={
          <>
            <a className="btn btn-primary" href="/impact/">See our impact →</a>
            <a className="btn btn-ghost" href="/contact/">Contact us</a>
          </>
        }
      />

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Our story</p>
          <h2 className="section-title">Born from a crisis of trust</h2>
          <div className="prose-cols">
            <p>
              Citizens Foundation was founded in the aftermath of Iceland’s
              economic — and trust — collapse in 2008. Our mission has stayed the
              same ever since: help citizens and governments make better
              decisions together — building open-source tools and methods that
              turn public participation into action.
            </p>
            <p>
              What began with Better Reykjavík has grown into platforms used in
              thousands of projects across over 50 countries — recognized with the
              European e-Democracy Award in 2011, the Nordic Best Practice award
              from the mayors of the Nordic capitals in 2015, and the #1 rating
              in the People Powered Participation Platform Ratings. Today we
              pair that experience with AI through{" "}
              <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.policySynth)}`} href="/policy-synth/">Policy Synth</a> —
              always with people in charge.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">The team</p>
          <h2 className="section-title">Three people in Reykjavík</h2>
          <div className="card-grid">
            {TEAM.map((m) => (
              <article key={m.name} className="card team-card">
                <img className="team-photo" src={m.photo} alt={m.name} />
                <h3>{m.name}</h3>
                <p className="story-place">{m.role}</p>
                <p>{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="shell">
          <p className="eyebrow">Former team and supporters</p>
          <h2 className="section-title">People who helped build the foundation</h2>
          <div className="card-grid">
            {FORMER_TEAM.map((m) => (
              <article key={m.name} className="card team-card">
                {m.photo ? (
                  <img className="team-photo legacy-team-photo" src={m.photo} alt={m.name} />
                ) : (
                  <div
                    className="team-photo legacy-team-photo team-photo-placeholder"
                    role="img"
                    aria-label={`${m.name} photo placeholder`}
                  />
                )}
                <h3>{m.name}</h3>
                <p className="story-place">{m.role}</p>
                <p>{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell panel">
          <p className="eyebrow">Films</p>
          <h2 className="section-title">Watch our story</h2>
          <div className="video-grid">
            {FILMS.map((f) => (
              <VideoCard key={f.src} {...f} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell cta-band">
          <h2 className="section-title">Want to work with us?</h2>
          <p className="cta-band-sub">
            From participation consultancy to hosted platforms — see what we offer.
          </p>
          <div className="cta-row">
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.workWithUs)}`} href="/work-with-us/">Work with us →</a>
            <a className="btn btn-ghost" href="/in-the-news/">In the news</a>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------- Contact ----------

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        lede="Questions, ideas or a participation project in mind? We are a small
          team in Reykjavík and we answer our own email."
      />
      <section className="section">
        <div className="shell">
          <div className="card-grid">
            <article className="card feature-card">
              <span className="icon-chip"><IconUsers /></span>
              <h3>General enquiries</h3>
              <p>
                For projects, partnerships, press or anything else:{" "}
                <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.contactEmail)}`} href="mailto:citizens@citizens.is">citizens@citizens.is</a>
              </p>
            </article>
            <article className="card feature-card">
              <span className="icon-chip"><IconCode /></span>
              <h3>Technical & open source</h3>
              <p>
                Bug reports, feature ideas and contributions are welcome on{" "}
                <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation">GitHub</a>.
              </p>
            </article>
            <article className="card feature-card">
              <span className="icon-chip"><IconGlobe /></span>
              <h3>Find us</h3>
              <p>
                Citizens Foundation, Reykjavík, Iceland — and on{" "}
                <a className="aurora-link" href="https://www.linkedin.com/company/citizens-foundation-global/">LinkedIn</a>,{" "}
                <a className="aurora-link" href="https://www.facebook.com/Citizens.is/">Facebook</a> and{" "}
                <a className="aurora-link" href="https://twitter.com/CitizensFNDN">X</a>.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------- In the News ----------

const PRESS = [
  {
    outlet: "Fast Company",
    year: 2024,
    title: "How AI could restore our faith in democracy",
    href: "https://www.fastcompany.com/91001497/ai-faith-in-democracy",
  },
  {
    outlet: "Government Technology",
    year: 2024,
    title: "N.J. AI Task Force Report Addresses Workforce, Innovation",
    href: "https://www.govtech.com/artificial-intelligence/n-j-ai-task-force-report-addresses-workforce-innovation",
  },
  {
    outlet: "The Washington Post",
    year: 2018,
    title: "Elections won’t save our democracy. But ‘crowdlaw’ could.",
    href: "https://www.washingtonpost.com/news/theworldpost/wp/2018/10/02/participatory-democracy/",
  },
  {
    outlet: "Carnegie Endowment",
    year: 2018,
    title: "Renewing U.S. Political Representation: Lessons from Europe and U.S. History",
    href: "https://carnegieendowment.org/2018/03/12/renewing-u.s.-political-representation-lessons-from-europe-and-u.s-history-pub-75758",
  },
  {
    outlet: "Financial Times",
    year: 2017,
    title: "The world watches Reykjavík’s digital democracy experiment",
    href: "https://www.ft.com/content/754a9442-af7b-11e7-8076-0a4bdda92ca2",
  },
  {
    outlet: "The Guardian",
    year: 2017,
    title: "Digital democracy: lessons from Brazil, Iceland and Spain",
    href: "https://www.theguardian.com/public-leaders-network/2017/feb/23/democracy-digital-lessons-brazil-iceland-spain",
  },
  {
    outlet: "Scientific American",
    year: 2016,
    title: "Citizen Science Is Stimulating a Wealth of Innovative Projects",
    href: "https://www.scientificamerican.com/article/citizen-science-is-stimulating-a-wealth-of-innovative-projects/",
  },
  {
    outlet: "Government Technology",
    year: 2016,
    title: "Icelandic Citizen Engagement Tool Offers Tips for U.S.",
    href: "https://www.govtech.com/civic/Icelandic-Citizen-Engagement-Tool-Offers-Tips-for-US.html",
  },
  {
    outlet: "Computer Weekly",
    year: 2017,
    title: "How software can support public involvement with democracy",
    href: "https://www.computerweekly.com/feature/How-software-can-support-public-involvement-with-democracy",
  },
  {
    outlet: "Eurocities",
    year: 2019,
    title: "Listen to the people",
    href: "https://www.100days.eurocities.eu/article/Listen-to-the-people",
  },
  {
    outlet: "The Hollywood Reporter",
    year: 2015,
    title: "Iceland Renames Street After Darth Vader",
    href: "https://www.hollywoodreporter.com/news/iceland-renames-street-darth-vader-818926",
  },
];

export function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="In the news"
        title="What others say"
        lede="Coverage of Citizens Foundation, Better Reykjavík and our platforms
          — from the Financial Times to, yes, the Darth Vader street."
      />
      <section className="section">
        <div className="shell">
          <ul className="post-list post-list-full press-list">
            {PRESS.map((p) => (
              <li key={p.href}>
                <div>
                  <span className="press-outlet">{p.outlet}</span>
                  <a className="aurora-link post-title" href={p.href}>{p.title}</a>
                </div>
                <span className="post-date">{p.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

// ---------- Start a project (shared launch section) ----------

// Your Priorities hosted server clusters — people create a project directly on
// the one closest to them (see the old /getting-started/ "choose a server").
const LAUNCH_REGIONS = [
  {
    region: "Europe",
    domain: "yrpri.org",
    href: "https://yrpri.org/",
    hint: "Best for Europe, Africa and Asia. GDPR-ready hosting in the EU.",
  },
  {
    region: "United States",
    domain: "ypus.org",
    href: "https://ypus.org/",
    hint: "Best for the Americas — hosted in the US.",
  },
];

// Reusable "create your own community" block — used on Work with us and Your
// Priorities. Drops in between sections (renders its own <section>).
export function StartProject({
  eyebrow = "Get started",
  title = "Create your own projects in minutes",
  sub = "Spin up your own Your Priorities project right now on our hosted servers — free to start, with secure sign-in and AI translation, moderation and analytics built in. Choose the server cluster closest to you.",
}) {
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        <p className="section-sub launch-sub">{sub}</p>
        <div className="launch-grid">
          {LAUNCH_REGIONS.map((r) => (
            <a
              key={r.domain}
              className={`card launch-card ${plausibleClass(PLAUSIBLE_EVENTS.startProject)}`}
              href={r.href}
              target="_blank"
              rel="noopener"
            >
              <span className="launch-top">
                <span className="icon-chip"><IconGlobe /></span>
                <span className="launch-region">{r.region}</span>
              </span>
              <span className="launch-domain">{r.domain}</span>
              <span className="launch-hint">{r.hint}</span>
              <span className="launch-go aurora-link card-link">Create your project →</span>
            </a>
          ))}
        </div>
        <p className="launch-note">
          Somewhere else, or want Your Priorities on your own custom domain?{" "}
          <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.contactEmail)}`} href="mailto:citizens@citizens.is">
            We’ll set it up with you →
          </a>
        </p>
      </div>
    </section>
  );
}

// ---------- Work with us ----------

export function WorkWithUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Work with us"
        lede="Seventeen years of running citizen participation, from neighbourhood
          budgets to national assemblies — available for your project."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.contactEmail)}`} href="mailto:citizens@citizens.is">citizens@citizens.is →</a>
            <a className="btn btn-ghost" href="/impact/">See past projects</a>
          </>
        }
      />
      <section className="section">
        <div className="shell">
          <div className="card-grid">
            <article className="card feature-card">
              <span className="icon-chip"><IconUsers /></span>
              <h3>Participation consultancy</h3>
              <p>
                We help you plan and execute successful citizen engagement —
                process design, question framing, outreach and evaluation, based
                on what has actually worked across over 50 countries.
              </p>
            </article>
            <article className="card feature-card">
              <span className="icon-chip"><IconGlobe /></span>
              <h3>Hosted platforms</h3>
              <p>
                Your Priorities, wiki surveys and participatory budgeting — run
                on our infrastructure with your branding, secure authentication
                and AI translation, moderation and analytics included.
              </p>
            </article>
            <article className="card feature-card">
              <span className="icon-chip"><IconCode /></span>
              <h3>Custom development & AI agents</h3>
              <p>
                From platform features to Policy Synth agent systems like those
                built for New Jersey, Iceland’s ministries and ECAS — everything
                we build is open source.
              </p>
            </article>
          </div>
          <p className="ribbon">
            Everything is open source — you are never locked in. Start small,
            scale when it works.
          </p>
        </div>
      </section>

      <StartProject />

      <section className="section">
        <div className="shell panel services-panel">
          <p className="eyebrow">Cloud services</p>
          <h2 className="section-title">Hosted platforms where you own the data</h2>
          <p className="section-sub">
            Our nonprofit partly funds itself operating cloud services. Here are
            monthly prices for service level agreements where you and your
            citizens own the data.
          </p>
          <div className="service-price-list" aria-label="Cloud services monthly prices">
            {CLOUD_SERVICES.map((service) => (
              <div className="service-price-row" key={service.tier}>
                <div>
                  <h3>{service.tier}</h3>
                  <p>{service.description}</p>
                </div>
                <strong className="service-price">{service.price}</strong>
              </div>
            ))}
          </div>
          <p className="service-docs-note">
            <em>
              For more information, download PDFs about{" "}
              <a
                className="aurora-link"
                href="https://docs.google.com/document/d/1T7oK_xoozsyCp_LZrspyjQviZsof0mIT0cmD17F80Ec/export?format=pdf"
                target="_blank"
                rel="noopener"
              >
                Service Level Agreements
              </a>{" "}
              and{" "}
              <a
                className="aurora-link"
                href="https://docs.google.com/document/d/1lJM_L57WB1gwjUzvHIuxn2HGN2pSoIb-cCZu3ZiAPv0/export?format=pdf"
                target="_blank"
                rel="noopener"
              >
                Startup Packages
              </a>.
            </em>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell cta-band">
          <h2 className="section-title">Tell us about your project</h2>
          <p className="cta-band-sub">
            We are happy to share what has worked elsewhere — no strings attached.
          </p>
          <div className="cta-row">
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.contactEmail)}`} href="mailto:citizens@citizens.is">Email us →</a>
          </div>
        </div>
      </section>
    </>
  );
}
