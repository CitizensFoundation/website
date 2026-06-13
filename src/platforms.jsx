import { useState } from "react";
import HeroCanvas from "./HeroCanvas.jsx";
import { VideoCard } from "./company.jsx";
import {
  IconBulb, IconScales, IconBallot, IconChecklist, IconCoins, IconShield,
  IconTranslate, IconSparkles, IconImage, IconChart, IconBot, IconCode,
  IconPackage, IconGlobe, IconPairwise, IconUsers, IconGitHub,
} from "./icons.jsx";
import { PLAUSIBLE_EVENTS, plausibleClass } from "./plausible.js";

// Click-to-copy install command, styled like a mini terminal line.
function CopyInstall({ cmd }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };
  return (
    <button type="button" className="pkg-install" onClick={onCopy} title="Copy to clipboard">
      <code><span className="tprompt">$</span> {cmd}</code>
      <span className="copy-ico">{copied ? "copied ✓" : "copy"}</span>
    </button>
  );
}

// ---------- shared building blocks ----------

function PageHero({ eyebrow, title, lede, ctas, logo, logoHeight = 90, logoOnly = false, children }) {
  return (
    <section className="hero hero-compact">
      <HeroCanvas />
      <div className="shell hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        {logoOnly ? (
          // The logo carries the title visually; a visually-hidden text node
          // gives search engines and screen readers a real <h1> string.
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
        {children}
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, children }) {
  return (
    <article className="card feature-card">
      <span className="icon-chip"><Icon /></span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function CaseCard({ href, place, children }) {
  return (
    <a className="card case-card" href={href}>
      <h3>{place}</h3>
      <p>{children}</p>
      <span className="aurora-link card-link">Read the story →</span>
    </a>
  );
}

function CtaBand({ title, sub, ctas }) {
  return (
    <section className="section">
      <div className="shell cta-band">
        <h2 className="section-title">{title}</h2>
        {sub && <p className="cta-band-sub">{sub}</p>}
        <div className="cta-row">{ctas}</div>
      </div>
    </section>
  );
}

// ---------- Your Priorities ----------

export function YourPrioritiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our flagship platform — since 2008"
        logo="/assets/yp-logo.png"
        logoHeight={180}
        logoOnly
        title="Your Priorities"
        lede="An open-source idea generation, deliberation and decision-making
          platform connecting governments and citizens — in thousands of
          projects across over 50 countries."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="https://yrpri.org">Open Your Priorities →</a>
            <a className={`btn btn-ghost ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation/your-priorities-app">View source on GitHub</a>
          </>
        }
      />

      <section className="section">
        <div className="shell">
          <p className="eyebrow">What you can do</p>
          <h2 className="section-title">From ideas to decisions, together</h2>
          <p className="section-sub">
            Your Priorities empowers groups of any size to speak with one voice
            and organize around ideas — from a single neighbourhood to a whole nation.
          </p>
          <div className="card-grid">
            <Feature icon={IconBulb} title="Idea generation">
              Citizens propose their own solutions, organized into projects,
              communities and categories — with images, video, audio and map locations.
            </Feature>
            <Feature icon={IconScales} title="Constructive debate">
              Instead of comment threads, people add independent points for and
              against each idea. This unique format keeps debate civil and makes
              trolling nearly impossible.
            </Feature>
            <Feature icon={IconBallot} title="Voting and prioritization">
              Flexible voting with hearts, arrows or custom emoji, and up to four
              evaluation criteria — so the best ideas rise to the top.
            </Feature>
            <Feature icon={IconChecklist} title="Surveys and polls">
              From quick polls to advanced surveys with skip logic — gather
              structured input alongside open idea generation.
            </Feature>
            <Feature icon={IconCoins} title="Participatory budgeting">
              Let residents decide how public money is spent. Used in hundreds of
              participatory budgeting processes together with Open Active Voting.
            </Feature>
            <Feature icon={IconShield} title="Secure and inclusive">
              Government electronic IDs, email or anonymous participation, fraud
              detection and full GDPR compliance — engagement everyone can trust.
            </Feature>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell panel">
          <p className="eyebrow">Artificial intelligence, built in</p>
          <h2 className="section-title">AI that amplifies people — never replaces them</h2>
          <p className="section-sub">
            Your Priorities pairs collective intelligence with state-of-the-art AI
            to make participation easier, safer and more insightful, in any language.
          </p>
          <div className="card-grid">
            <Feature icon={IconTranslate} title="Real-time translation">
              Automated translation and speech-to-text in nearly 200 languages, so
              everyone can participate in their own language — side by side.
            </Feature>
            <Feature icon={IconShield} title="AI-assisted moderation">
              Every contribution is automatically screened for toxicity and
              moderators are alerted instantly — keeping conversations safe and
              welcoming around the clock.
            </Feature>
            <Feature icon={IconImage} title="AI image generation">
              Generate beautiful images for ideas and projects with built-in AI
              image creation — no design skills needed.
            </Feature>
            <Feature icon={IconBot} title="Built-in agent workflow engine">
              Design, run and monitor teams of{" "}
              <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.policySynth)}`} href="/policy-synth/">Policy Synth</a> AI
              agents right inside Your Priorities — research, drafting and
              evolving solutions, with human votes always in the loop.
            </Feature>
            <Feature icon={IconChart} title="AI analytics">
              Automatic clustering of ideas, topic analysis and rich dashboards
              turn thousands of contributions into clear, actionable insight.
            </Feature>
          </div>
          <p className="quote-line">
            “AI is a tool to enhance human intelligence and creativity — not replace it.”
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Trusted worldwide</p>
          <h2 className="section-title">Powering democracy around the world</h2>
          <p className="section-sub">
            From city halls to national parliaments, Your Priorities has helped
            governments listen — and act — since 2008.
          </p>
          <div className="card-grid">
            <CaseCard href="/impact/better_reykjavik/" place="Better Reykjavík — Iceland">
              Over 70,000 participants in a city of 120,000. Hundreds of citizen
              ideas funded and built through participatory budgeting since 2010.
            </CaseCard>
            <CaseCard href="/impact/engage-scottish-parliament/" place="Scottish Parliament">
              The Parliament’s Engage platform runs on Your Priorities, gathering
              citizen input for committee work.
            </CaseCard>
            <CaseCard href="/impact/rahvakogu/" place="Rahvakogu — Estonia">
              Estonia’s national People’s Assembly crowdsourced democratic reform
              — and seven citizen proposals became law.
            </CaseCard>
            <CaseCard href="/impact/new-jersey-ai-taskforce/" place="State of New Jersey — USA">
              The NJ AI Task Force, where worker input and Policy Synth agents
              turned public concerns into policy recommendations.
            </CaseCard>
            <CaseCard href="/impact/nhs-citizen/" place="NHS England — UK">
              NHS Citizen used Your Priorities to surface public priorities for
              discussion at NHS England board assemblies.
            </CaseCard>
            <CaseCard href="/impact/malta/" place="Malta">
              A national election manifesto crowdsourced with the public — 2,600
              ideas from citizens, many adopted into the final programme.
            </CaseCard>
          </div>
          <p className="ribbon">
            Rated <strong>#1</strong> in the People Powered 2025 Participation
            Platform Ratings · Top-ranked in the 2024 Digital Democracy Report ·
            Listed in the OECD Guidelines for Citizen Participation Processes
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Learn the platform</p>
          <h2 className="section-title">Video tutorials</h2>
          <div className="video-grid">
            <VideoCard src="https://www.youtube.com/embed/ilAerJfvMUY" title="Your Priorities tutorial" />
            <VideoCard src="https://www.youtube.com/embed/DIA-IKkaQN4" title="Creating communities & groups" />
            <VideoCard src="https://www.youtube.com/embed/_i5Hs-KcwTI" title="Community and group settings" />
            <VideoCard src="https://www.youtube.com/embed/Z3uCaRONuN8" title="Using Google Analytics with Your Priorities" />
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to put your community’s priorities first?"
        sub="Free and open source. Run it yourself, or let us host it for you."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="https://yrpri.org">Create a project →</a>
            <a className="btn btn-ghost" href="/impact/">See the impact</a>
          </>
        }
      />
    </>
  );
}

// ---------- Policy Synth ----------

export function PolicySynthPage() {
  return (
    <>
      <PageHero
        eyebrow="Collective intelligence × artificial intelligence"
        logo="/assets/policy-synth-logo.png"
        logoHeight={96}
        title="Policy Synth"
        lede="An open-source framework for orchestrating teams of AI agents that
          research problems, evolve solutions and answer with evidence — while
          people stay in charge of every judgment that matters."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation/policy-synth">View on GitHub →</a>
            <a className="btn btn-ghost" href="https://arxiv.org/abs/2407.13960">Read the research paper</a>
          </>
        }
      />

      <section className="section">
        <div className="shell">
          <p className="eyebrow">How it works</p>
          <h2 className="section-title">Humans set the question. Agents do the legwork.</h2>
          <ol className="step-list">
            <li>
              <span className="step-num">1</span>
              <div>
                <h3>Define the problem — with the community</h3>
                <p>
                  A problem statement is shaped together with the people it
                  affects, through engagement platforms like Your Priorities and
                  All Our Ideas, workshops or expert deliberations.
                </p>
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <h3>Agents research, generate and evolve</h3>
                <p>
                  Swarms of specialized agents run thousands of search queries,
                  map root causes, and breed populations of candidate solutions
                  over many generations — pairwise-ranked with Elo ratings, each
                  with researched pros and cons.
                </p>
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <h3>People review, vote and decide</h3>
                <p>
                  Every output flows back to human review — spreadsheets, voting
                  rounds, workshops. AI accelerates the work between human
                  judgments; it never replaces them.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell panel">
          <p className="eyebrow">Capabilities</p>
          <h2 className="section-title">One framework, many kinds of agents</h2>
          <div className="card-grid">
            <Feature icon={IconBot} title="Multi-agent workflows">
              Connect research, analysis, review and notification agents — from
              Google Docs in, to Google Sheets and Discord out — through Your
              Priorities’ built-in visual workflow engine, with full audit logs
              and cost tracking.
            </Feature>
            <Feature icon={IconSparkles} title="Evolving solutions">
              Genetic algorithms breed and refine solution populations across
              generations, with pros, cons and evolutionary trees for every idea.
            </Feature>
            <Feature icon={IconGlobe} title="Deep automated research">
              Over a thousand generated search queries per problem — general,
              scientific, data and news — distilled into root causes and evidence.
            </Feature>
            <Feature icon={IconShield} title="Grounded chatbots">
              A full RAG stack with ingestion, Elo-ranked chunking and validation
              agents that retract hallucinations by majority vote — powering ERIC
              and the Rebooting Democracy bot.
            </Feature>
            <Feature icon={IconScales} title="Multi-model by design">
              Run the same analysis through GPT, Claude and Gemini side by side
              and compare — trust through triangulation, not faith in one model.
            </Feature>
            <Feature icon={IconUsers} title="Human in the loop">
              Voting platforms, review sheets and workshops are first-class agent
              nodes — collective intelligence is part of the architecture, not an
              afterthought.
            </Feature>
          </div>
          <p className="ribbon">
            Use it two ways: <strong>standalone</strong> via the{" "}
            <code>@policysynth/agents</code> TypeScript library, or through the
            visual agent workflow engine <strong>built into{" "}
            <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="/your-priorities/">Your Priorities</a></strong>{" "}
            — the interface you see in our case studies.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">In the field</p>
          <h2 className="section-title">Already making policy, today</h2>
          <div className="card-grid">
            <CaseCard href="/impact/new-jersey-ai-taskforce/" place="New Jersey AI Task Force">
              2,200+ workers ranked 96 concerns about generative AI; Policy Synth
              turned the top 20 into evidence-based policy solutions.
            </CaseCard>
            <CaseCard href="/impact/gold-plating-iceland/" place="Iceland — Gold-plating">
              Scanning Icelandic law against EU directives, article by article —
              52 unjustified additions found in the telecoms pilot alone.
            </CaseCard>
            <CaseCard href="/impact/skills-first-new-jersey/" place="Skills-First Hiring">
              Thousands of state job descriptions analyzed and rewritten to
              remove unnecessary degree requirements.
            </CaseCard>
            <CaseCard href="/impact/smarter-crowdsourcing-election-subversion/" place="Countering Election Subversion">
              With Democracy Fund and The GovLab — the first real-world test of
              AI-accelerated Smarter Crowdsourcing.
            </CaseCard>
            <CaseCard href="/impact/eric-ecas-teleworking/" place="ERIC — European Union">
              An AI rights assistant for European citizens, grounded strictly in
              official legislation.
            </CaseCard>
            <CaseCard href="/impact/unlocking-literacy-boston/" place="Unlocking Literacy — Boston">
              Decomposing the reading gap and evolving evidence-based solutions
              with Boston schools and the Museum of Science.
            </CaseCard>
          </div>
        </div>
      </section>

      <CtaBand
        title="Build with Policy Synth"
        sub="MIT-licensed TypeScript, published on npm — the same packages we run in production."
        ctas={
          <>
            <a className="btn btn-primary" href="/open-source/">Explore the packages →</a>
            <a className={`btn btn-ghost ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation/policy-synth">GitHub</a>
          </>
        }
      />
    </>
  );
}

// ---------- All Our Ideas ----------

export function AllOurIdeasPage() {
  return (
    <>
      <PageHero
        eyebrow="Wiki surveys"
        logo="/assets/allourideas-logo.png"
        logoHeight={64}
        logoOnly
        title="All Our Ideas"
        lede="Show people two ideas. They pick one. Every vote sharpens a
          crowd-ranked list of what matters most — and anyone can add ideas of
          their own."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="https://yrpri.org">Run a wiki survey →</a>
            <a className={`btn btn-ghost ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation/allourideas.org">Source on GitHub</a>
          </>
        }
      >
        <div className="vote-demo" aria-hidden="true">
          <span className="vote-pill">More protected bike lanes</span>
          <span className="vote-or">or</span>
          <span className="vote-pill">Longer library opening hours</span>
        </div>
      </PageHero>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Why pairwise?</p>
          <h2 className="section-title">The simplest honest question</h2>
          <p className="section-sub">
            Rating scales get gamed and long surveys get abandoned. A choice
            between two options takes seconds, works in any language, and is
            remarkably hard to manipulate — while the mathematics of pairwise
            comparison turns thousands of quick votes into a robust ranking.
          </p>
          <div className="card-grid">
            <Feature icon={IconPairwise} title="Vote in seconds">
              Participants compare two ideas at a time — as many or as few pairs
              as they like. No forms, no friction, anonymous-friendly.
            </Feature>
            <Feature icon={IconBulb} title="The crowd adds ideas">
              It’s a survey and a brainstorm at once: anyone can submit a new
              idea, which immediately starts competing in the ranking.
            </Feature>
            <Feature icon={IconChart} title="Rankings you can defend">
              Every idea gets a score from all votes cast, with live results
              dashboards — a defensible, transparent picture of group priorities.
            </Feature>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell panel split">
          <div>
            <p className="eyebrow">From Princeton to Reykjavík</p>
            <h2 className="section-title">Now part of Your Priorities</h2>
            <p>
              All Our Ideas was created at Princeton University as a research
              project in “wiki surveys”, and its pairwise method has powered
              public consultations around the world. Citizens Foundation has
              taken over its open-source maintenance — and rebuilt it as a group
              type right inside <a className={`aurora-link ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="/your-priorities/">Your Priorities</a>,
              so wiki surveys run alongside idea generation, debates and
              participatory budgeting, with the same AI translation, moderation
              and analytics underneath.
            </p>
          </div>
          <div>
            <CaseCard href="/impact/new-jersey-ai-taskforce/" place="“AI and You” — New Jersey">
              More than 2,200 workers voted on pairs of statements about
              generative AI, producing a rank-ordered list of 96 concerns that
              drove the AI Task Force’s recommendations to the Governor.
            </CaseCard>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ask your crowd what matters most"
        sub="Wiki surveys are built into Your Priorities — free and open source."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.yourPriorities)}`} href="https://yrpri.org">Get started →</a>
            <a className="btn btn-ghost" href="/impact/">See the impact</a>
          </>
        }
      />
    </>
  );
}

// ---------- Open Source ----------

const PACKAGES = [
  {
    name: "@policysynth/agents",
    install: "npm install @policysynth/agents",
    desc: "The core of the Policy Synth ecosystem — multi-scale agent orchestration with queues, genetic algorithms, deep research and Elo pairwise ranking. Use it standalone, or through the agent workflow engine built into Your Priorities.",
    href: "https://www.npmjs.com/package/@policysynth/agents",
  },
  {
    name: "@yrpri/api",
    install: "npm install @yrpri/api",
    desc: "The Your Priorities server SDK — the engagement engine behind 17 years of citizen participation projects.",
    href: "https://www.npmjs.com/package/@yrpri/api",
  },
  {
    name: "@yrpri/webapp",
    install: "npm install @yrpri/webapp",
    desc: "The Your Priorities progressive web app, built with web components — voting, debate, surveys and participatory budgeting UI.",
    href: "https://www.npmjs.com/package/@yrpri/webapp",
  },
];

const REPOS = [
  {
    name: "your-priorities-app",
    href: "https://github.com/CitizensFoundation/your-priorities-app",
    desc: "The full Your Priorities platform — server, web app and AI services. In continuous development since 2008.",
  },
  {
    name: "policy-synth",
    href: "https://github.com/CitizensFoundation/policy-synth",
    desc: "The Policy Synth agent framework: TypeScript classes for orchestrating collective and artificial intelligence.",
  },
  {
    name: "allourideas.org",
    href: "https://github.com/CitizensFoundation/allourideas.org",
    desc: "The wiki-survey engine created at Princeton University, now maintained by Citizens Foundation.",
  },
];

export function OpenSourcePage() {
  return (
    <>
      <PageHero
        eyebrow="100% open source"
        title="Built in the open"
        lede="Democratic infrastructure should be inspectable by the people it
          serves. Everything we run is free, open-source and MIT-licensed — the
          exact packages behind Better Reykjavík, the New Jersey AI Task Force
          and ERIC, published on npm."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation">github.com/CitizensFoundation →</a>
          </>
        }
      >
        <div className="oss-hero-extra">
          <div className="terminal" aria-hidden="true">
            <div className="terminal-bar"><i /><i /><i /><span className="terminal-title">bash</span></div>
            <div className="terminal-body">
              <div><span className="tprompt">$</span> npm install <span className="tpkg">@policysynth/agents</span></div>
              <div className="tdim">added @policysynth/agents · MIT licensed</div>
              <div className="tgap" />
              <div><span className="tprompt">$</span> npm install <span className="tpkg">@yrpri/api @yrpri/webapp</span></div>
              <div className="tdim">✓ democracy infrastructure, ready to build</div>
            </div>
          </div>
          <div className="tech-pills">
            <span>TypeScript</span><span>Node 24</span><span>Docker</span><span>MIT licensed</span>
          </div>
        </div>
      </PageHero>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">npm packages</p>
          <h2 className="section-title">The building blocks</h2>
          <p className="section-sub">
            Three packages drive all of our platforms and projects — use them
            together as we do in production, or pick the pieces you need.
          </p>
          <div className="pkg-grid">
            {PACKAGES.map((p) => (
              <div key={p.name} className="card pkg-card">
                <span className="icon-chip"><IconPackage /></span>
                <h3 className="pkg-name">
                  <a className="aurora-link" href={p.href}>{p.name}</a>
                </h3>
                <p className="pkg-tags">
                  <span className="pkg-tag tag-ts">TypeScript</span>
                  <span className="pkg-tag tag-mit">MIT</span>
                </p>
                <p>{p.desc}</p>
                <CopyInstall cmd={p.install} />
              </div>
            ))}
          </div>
          <div className="why-band">
            <span className="icon-chip"><IconCode /></span>
            <div>
              <h3>Why it matters</h3>
              <p>
                No black boxes, no vendor lock-in, no per-citizen license fees.
                Cities and parliaments can audit every line that counts a vote —
                and researchers can build on 17 years of civic-tech engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell panel">
          <p className="eyebrow">Repositories</p>
          <h2 className="section-title">On GitHub</h2>
          <div className="card-grid">
            {REPOS.map((r) => (
              <a key={r.name} className={`card pkg-card repo-card ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href={r.href}>
                <span className="icon-chip"><IconGitHub /></span>
                <h3 className="pkg-name">
                  <span className="pkg-org">CitizensFoundation/</span>
                  {r.name}
                </h3>
                <p>{r.desc}</p>
                <span className="aurora-link card-link">View repository →</span>
              </a>
            ))}
          </div>
          <p className="ribbon">
            MIT licensed · Thousands of commits since 2008 · AI features shipping
            since 2014 — machine translation, toxicity detection, speech-to-text,
            and agent workflows long before they were fashionable
          </p>
        </div>
      </section>

      <CtaBand
        title="Use it, fork it, contribute"
        sub="Questions about self-hosting or building on our stack? We're happy to help."
        ctas={
          <>
            <a className={`btn btn-primary ${plausibleClass(PLAUSIBLE_EVENTS.github)}`} href="https://github.com/CitizensFoundation">Start on GitHub →</a>
            <a className={`btn btn-ghost ${plausibleClass(PLAUSIBLE_EVENTS.contactEmail)}`} href="mailto:robert@citizens.is">Talk to us</a>
          </>
        }
      />
    </>
  );
}
