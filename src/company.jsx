import HeroCanvas from "./HeroCanvas.jsx";
import { IconUsers, IconGlobe, IconCode, IconGitHub, IconLinkedIn, IconFacebook, IconX } from "./icons.jsx";
import { PLAUSIBLE_EVENTS, plausibleClass } from "./plausible.js";

function PageHero({ eyebrow, title, lede, ctas }) {
  return (
    <section className="hero hero-compact">
      <HeroCanvas />
      <div className="shell hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
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
    role: "Designer & board member",
    photo: "/uploads/2014/07/marenFinal.jpg",
    bio: "Maren is a multimedia artist and designer — a force of creative energy at Citizens Foundation. She has shaped the design of our apps and websites since 2012, contributes to overall strategy and sits on the board of directors.",
  },
  {
    name: "Gunnar Grímsson",
    role: "CO-FOUNDER & AMBASSADOR",
    photo: "/uploads/2019/06/GunnarCF-Ambassador-sharper-1-1.jpg",
    bio: "Gunnar has been at the heart of Citizens Foundation since its start. He is an experienced process and interface designer with a strong background in multiple fields, and has worked on citizen engagement projects all over the world.",
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

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Citizens Foundation"
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
