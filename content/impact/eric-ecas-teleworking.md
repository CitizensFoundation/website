---
title: "ERIC: An AI Rights Assistant for European Citizens"
slug: "eric-ecas-teleworking"
date: "2025-06-24"
hero: "/uploads/2026/06/eric-ecas-hero.png"
excerpt: "ERIC uses Policy Synth to answer European citizens' rights questions with evidence from official EU and national sources."
categories: ["Policy Synth"]
link: "https://ecas-eric.eu/telework"
---

Cross-border teleworking is an increasingly common way of working in the EU — citizens living in one Member State while working for an employer in another. It opens opportunities, but also a maze: which immigration, social security, tax and labour-law rules apply? Even specialists struggle to give quick answers.

For the [European Citizen Action Service (ECAS)](https://ecas.org/), the Brussels-based civil society organisation that has defended citizens' rights in the EU for over three decades, Citizens Foundation built **ERIC** — ECAS's AI-driven Rights Information Centre — launched in June 2025 with cross-border teleworking as its pilot topic.

## Grounded answers, not guesses

ERIC runs on the Policy Synth retrieval-augmented generation stack we first developed for the Rebooting Democracy chatbot: an ingestion agent analyzes, cleans, chunks and Elo-ranks every source document into a vector store, and a chat agent routes each question, re-ranks the retrieved passages, and assembles answers chapter by chapter. Dedicated validation agents check every response — with majority voting across multiple runs — and retract or clarify anything that looks like a hallucination before it reaches the citizen.

The knowledge base is deliberately narrow and authoritative: official EU and national legislation plus ECAS's Teleworking Info Toolkit, covering social security, tax, labour law and immigration questions for employees, employers and the self-employed. ERIC provides information rather than legal advice, and ECAS reviews its answers through regular quality control while the pilot expands toward new rights topics. Citizens can [try ERIC](https://ecas-eric.eu/telework) directly.
