---
title: "Active Citizen: Empowering Citizens with AI"
slug: "active-citizen"
date: "2024-06-04"
hero: "/uploads/2017/11/Active-Citizen.png"
excerpt: "Active Citizen was Citizens Foundation's first civic AI architecture. It grew from recommendation engines and social listening into Policy Synth, our human-in-the-loop AI agent framework for public decisions."
categories: ["Active Citizen","Policy Synth","Artificial Intelligence","Policy Crowdsourcing"]
link: "/uploads/2017/11/Active-Citizen-AI-VR-2020.pdf"
gallery: ["/uploads/2017/11/deep1-1.png","/uploads/2026/06/nj-ai-taskforce-agents.png","/uploads/2026/06/skills-first-agent-config.png","/uploads/2026/06/gold-plating-agents.png","/uploads/2026/06/nj-ai-taskforce-results.png"]
---

Long before generative AI became a public policy issue, Citizens Foundation was asking a practical question: can artificial intelligence help people participate in democracy without taking judgment away from them?

Active Citizen was our first full answer to that question. Started in 2013, it explored how open-source AI could support democratic participation by recommending relevant issues, notifying people about opportunities to take part, analyzing public discussion, and helping decision-makers see the signals inside large volumes of public input.

The idea was simple but ambitious. Civic AI should be informative, not intrusive. It should help people find issues that match their interests, help communities work through large volumes of ideas, and help institutions understand what citizens are saying. It should not manipulate the feed, replace public judgment, or turn participation into a black box.

<div class="paper-download">
  <div>
    <p class="paper-download-label">Original concept note · 2013</p>
    <h3>Active Citizen: AI, VR and better participation</h3>
    <p>Download the Active Citizen concept note, first drafted in 2013 and lightly updated in 2020, describing personal AI assistants, virtual-reality interfaces, online and offline assemblies, and civic dashboards as a next step for democratic participation.</p>
  </div>
  <a class="btn btn-primary" href="/uploads/2017/11/Active-Citizen-AI-VR-2020.pdf" target="_blank" rel="noopener">Download PDF <span aria-hidden="true">→</span></a>
</div>

> **A glimpse into our future**
>
> Alex has her breakfast while her AI Assistant (AIA) tells her about an open meeting in City Hall concerning cycling regulations and local planning. Alex confirms she'll be there and her AIA creates an info pack about the issue to help her plan a proposal for the meeting.
>
> Alex uses her time on the train to review AIA's ideas for her proposal. Some require a few minutes as Alex adds some details from her own experience but mostly it's a matter of reviewing quickly and confirming. She actually has time for a short nap before her train arrives.
>
> Meanwhile AIA creates a plan that uses an AI-managed group to brainstorm and prioritize the best ideas and debates them in combined online and offline assemblies. The result will be a plan for the neighborhood to be presented formally to City Hall with the signatures of supporting participants. The first task is to formulate a plan that will have wide approval from citizens.
>
> A few days later AIA reminds Alex that an assembly is starting in her group. Alex grabs her tablet and enters a virtual world mirroring her neighborhood. At a visualization of her idea she checks the debate once more before transporting to the assembly hall where both online and offline participants have equal status and communication possibilities.
>
> The meeting starts and due to their preplanning Alex and AIA manage to get her planning proposal for the neighborhood approved by a big majority of voting citizens. It will be submitted to the municipal council with the support of almost 30% of the voting population of the neighborhood behind it.
>
> From Citizens Foundation's 2013 Active Citizen concept note.

## The first civic AI architecture

The original Active Citizen diagram described the direction clearly: AI assistants, big-data dashboards, open-data visualizations, assemblies, groups, and democracy games connected around citizens and institutions. That was not a product mockup for a single chatbot. It was an early architecture for democratic AI, where algorithms helped people navigate civic information and where humans still made the decisions.

At the time, Citizens Foundation was already running [Your Priorities](/your-priorities/) and projects such as [Better Reykjavik](/impact/better_reykjavik/). The challenge was scale. Once thousands of people can propose ideas, debate arguments, vote, and submit evidence, public institutions need help answering deeper questions:

What is most relevant to each citizen? Which ideas connect to which public issues? What arguments are appearing again and again? What outside evidence or news might help people make a better decision? Which topics deserve attention now?

Active Citizen explored recommendation engines and notifications for this purpose. Instead of waiting for people to search through every open consultation, the system could alert them to issues connected to their interests. Instead of treating each idea as isolated text, it could analyze ideas and connect them to relevant news, social media, and public data.

Part of this development was funded by the European Commission, first through CHEST FP7 and later through Erasmus+ for the Deep Linking Youth / Active Citizen Dashboard work.

## From recommendations to social listening

The most visible experiment was [DEEP-Linking Youth](/impact/deep-linking-youth/), an Erasmus+ project exploring how young people could participate more effectively in European policymaking. Its Active Citizen Dashboard listened to public social media discussion about Erasmus+ and youth mobility, classified posts with machine-learning models, translated material across languages, and surfaced emerging themes for policymakers.

![The DEEP-Linking Youth Active Citizen Dashboard showing AI-filtered social media listening across languages](/uploads/2017/11/deep1-1.png)

The dashboard used a TensorFlow text-CNN classifier for social-media and news classification. That sounds technical, but the democratic purpose was straightforward: make it easier for policymakers to hear young people where they were already speaking, across borders and languages, without reducing participation to a single survey form.

This was the first version of a pattern that still defines our AI work:

1. People create the signal through participation, discussion, voting, or public expression.
2. AI helps organize, classify, translate, recommend, and research.
3. Human reviewers and decision-makers stay responsible for interpretation and action.

That pattern later became much more powerful.

## How Active Citizen became Policy Synth

As large language models matured, the limitation was no longer only classification or recommendation. AI could now help with the hard work between public input and policy action: research root causes, generate policy options, compare evidence, summarize trade-offs, identify weak arguments, and prepare structured material for review.

That is where [Policy Synth](/policy-synth/) grew out of the Active Citizen line of work.

<img src="/assets/policy-synth-logo.png" alt="Policy Synth logo" style="width: 50%; max-width: 360px; min-width: 220px; height: auto;" />

Policy Synth is an open-source framework for orchestrating teams of AI agents around public problems. The core principle is the same as Active Citizen: AI supports collective intelligence, but people stay in charge of every judgment that matters. The difference is depth. Active Citizen helped citizens find relevant civic issues and helped institutions listen. Policy Synth helps communities and institutions move from listening to evidence-based options.

In practice, Policy Synth agents can:

1. Decompose a public problem into sub-problems.
2. Generate large sets of search queries across general, scientific, data, and news sources.
3. Research root causes and cite evidence.
4. Generate many candidate solutions.
5. Evolve those solutions over multiple generations.
6. Score ideas with pros, cons, and pairwise Elo ratings.
7. Send outputs to spreadsheets, workshops, and voting rounds for human review.

The important point is not that AI writes policy by itself. It does not. The value is that AI can do weeks or months of research and synthesis work between human judgments, while the final interpretation, prioritization, and decision-making remain with people.

## The first real-world test

Policy Synth's first major real-world test came through [Smarter Crowdsourcing: Countering Election Subversion](/impact/smarter-crowdsourcing-election-subversion/), with Democracy Fund and The GovLab. Expert deliberations identified key problems, while Policy Synth agents ran more than a thousand search queries, mapped causes, generated solution candidates, and helped prepare recommendations for human review.

The method was documented in the 2024 paper [Using Artificial Intelligence to Accelerate Collective Intelligence: Policy Synth and Smarter Crowdsourcing](https://arxiv.org/abs/2407.13960), by Robert Bjarnason, Dane Gambrell, and Joshua Lanthier-Welch, written for the ACM Collective Intelligence Conference.

This was the moment Active Citizen's original idea became a full AI-assisted policy workflow. AI was no longer only recommending content or classifying public discussion. It was helping structure the work that turns public knowledge into possible public action.

## Citizens first: New Jersey, skills-first hiring, and gold-plating

The same approach now powers several Citizens Foundation impact projects.

In the [New Jersey AI Task Force](/impact/new-jersey-ai-taskforce/) project, more than 2,200 workers used All Our Ideas to rank concerns about generative AI and work. Those ranked concerns then flowed into Policy Synth, where agents researched root causes and generated evidence-based policy proposals. The public helped set the agenda; AI expanded the solution space; experts and officials reviewed the results.

In [Skills-First Hiring](/impact/skills-first/), Policy Synth agents analyze thousands of public-sector job descriptions, identify unnecessary degree requirements, quote the evidence, check related legal barriers, and draft clearer alternatives for human review. The goal is not to automate hiring decisions. It is to help public agencies find and remove hidden barriers that would otherwise take too long to inspect manually.

In [Iceland's gold-plating project](/impact/gold-plating-iceland/), Policy Synth compares Icelandic law against EU directives to find national additions that may go beyond what the directive requires. Multiple models run in parallel, outputs are compared, and human reviewers make the final call. Again, AI accelerates the evidence work; people decide.

Across these projects, the line from Active Citizen to Policy Synth is direct. We started by asking how AI could help citizens find, understand, and act on civic issues. We now build agent systems that help institutions research those issues, expose trade-offs, and prepare better choices for democratic review.

## Open source continuity

Active Citizen remains an important part of our history because it set the operating rule we still follow: use AI to empower citizens, not to replace them.

The original code archives are still available:

[Active Citizen GitHub archive](https://github.com/rbjarnason/active-citizen)

[Active Citizen Dashboard GitHub archive](https://github.com/CitizensFoundation/active-citizen-dashboard)

The current generation is Policy Synth:

[Policy Synth page](/policy-synth/)

[Policy Synth on GitHub](https://github.com/CitizensFoundation/policy-synth)

The technology has changed dramatically since 2013. The democratic commitment has not. AI belongs in public decision-making only when it makes participation more meaningful, evidence easier to inspect, and human judgment more informed.
