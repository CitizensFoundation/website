---
title: "Skills-First Hiring: Opening State Jobs with AI"
slug: "skills-first-new-jersey"
date: "2025-02-01"
hero: "/uploads/2026/06/skills-first-hero.png"
excerpt: "With Northeastern University's Burnes Center, our Policy Synth agents analyze thousands of state job descriptions and the laws behind them — finding and rewriting unnecessary degree requirements that block qualified candidates without college diplomas. Live in New Jersey, with more states signing up."
categories: ["Policy Synth"]
link: "https://burnes.northeastern.edu/skills-first-workforce-hiring-creating-more-equitable-and-inclusive-state-employment-opportunities-using-ai/"
gallery: ["/uploads/2026/06/skills-first-agent-config.png","/uploads/2026/06/skills-first-eval.png"]
---

Most state government job postings still ask for a college degree — even where the actual work doesn't require one. Skills-first hiring policies aim to change that, opening public-sector careers to everyone with the right skills. But the barriers hide in thousands of job descriptions and in the laws and regulations behind them, far more than any team could review by hand.

Together with the [Burnes Center for Social Change](https://burnes.northeastern.edu/) at Northeastern University, Citizens Foundation built a Policy Synth agent system that does the review automatically — starting with the State of New Jersey, with more states signing up.

## Reading every job description, and the law behind it

The Job Description Analysis Agent works through thousands of postings per run — pulling them straight from shared drives, determining whether each requires a college degree, quoting the evidence, distinguishing mandatory from permissive language, checking professional license requirements, flagging barriers for non-degree applicants, and even scoring readability so descriptions can be written in plainer language. A companion Rewriter Agent then drafts skills-first versions of problematic postings, and results flow into spreadsheets for human review.

A second system, the Barriers Research Agent, scans laws and regulations in three deepening passes — potential, likely, confirmed — to find statutory requirements blocking skills-first policies, then ranks the barriers and generates recommendation reports, with each recommendation evolved over generations of AI review and web research before humans evaluate it.

To trust the results, we benchmarked the agents across multiple frontier models — GPT-4o, o1, o3-mini and hybrids — comparing outputs sheet by sheet. The methodology is described in the Burnes Center's report, [Skills-First Workforce Hiring: Creating More Equitable and Inclusive State Employment Opportunities Using AI](https://burnes.northeastern.edu/skills-first-workforce-hiring-creating-more-equitable-and-inclusive-state-employment-opportunities-using-ai/).
