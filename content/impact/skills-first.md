---
title: "Skills-First Hiring: Opening State Jobs with AI"
slug: "skills-first"
date: "2026-05-01"
hero: "/uploads/2026/06/skills-first-cover-chatgpt.png"
excerpt: "Policy Synth helps New Jersey review public job descriptions and remove unnecessary degree requirements, with expansion to more states underway."
categories: ["Policy Synth"]
link: "https://burnes.northeastern.edu/skills-first-workforce-hiring-creating-more-equitable-and-inclusive-state-employment-opportunities-using-ai/"
gallery: ["/uploads/2026/06/skills-first-agent-config.png","/uploads/2026/06/skills-first-eval.png"]
---

Most state government job postings still ask for a college degree — even where the actual work doesn't require one. Skills-first hiring policies aim to change that, opening public-sector careers to everyone with the right skills. But the barriers hide in thousands of job descriptions and in the laws and regulations behind them, far more than any team could review by hand.

Together with the [Burnes Center for Social Change](https://burnes.northeastern.edu/) at Northeastern University, Citizens Foundation built a Policy Synth agent system that does the review automatically — starting with the State of New Jersey.

The next phase is about scale. After an initial GitLab Foundation award helped launch the work, a second $500,000 GitLab Foundation grant in 2026 is supporting Citizens Foundation's continued development of the system as the Burnes Center expands the model from New Jersey into three to five new states. The goal is to make skills-first hiring reform practical for states that want to remove unnecessary degree barriers but need a faster way to inspect the job descriptions, classification rules, laws, and regulations that shape public hiring.

## Reading every job description, and the law behind it

The Job Description Analysis Agent works through thousands of postings per run — pulling them straight from shared drives, determining whether each requires a college degree, quoting the evidence, distinguishing mandatory from permissive language, checking professional license requirements, flagging barriers for non-degree applicants, and even scoring readability so descriptions can be written in plainer language. A companion Rewriter Agent then drafts skills-first versions of problematic postings, and results flow into spreadsheets for human review.

A second system, the Barriers Research Agent, scans laws and regulations in three deepening passes — potential, likely, confirmed — to find statutory requirements blocking skills-first policies, then ranks the barriers and generates recommendation reports, with each recommendation evolved over generations of AI review and web research before humans evaluate it.

To trust the results, we benchmarked the agents across multiple frontier models — GPT-4o, o1, o3-mini and hybrids — comparing outputs sheet by sheet. The methodology is described in the Burnes Center's report, [Skills-First Workforce Hiring: Creating More Equitable and Inclusive State Employment Opportunities Using AI](https://burnes.northeastern.edu/skills-first-workforce-hiring-creating-more-equitable-and-inclusive-state-employment-opportunities-using-ai/).

With the follow-on GitLab Foundation support, this work is moving from a single-state implementation into a reusable approach for state hiring reform. Each new state brings different job structures and legal constraints, but the same core challenge: outdated requirements are often scattered across documents no one can review quickly by hand. Policy Synth helps public teams find those barriers, rewrite job descriptions, and prepare evidence for human decision-makers.
