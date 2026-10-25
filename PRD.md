# Signal Room product brief

## Challenge

Velho is a strategic AI growth partner. It helps established companies find manual work that slows growth, build a fix and ensure people use it. The challenge is reaching the right operator at a moment when a specific, useful conversation is more welcome than a generic AI pitch.

## Product bet

Give a Velho operator a small, repeatable way to turn a public company signal into **proof before pitch**. The operator brings a real signal, Signal Room helps frame the operational hypothesis and first experiment, then prepares an evidence-led invitation to a working session.

## Primary user

Velho's growth team, preparing to approach established companies with real operations and budget. The relevant buyer is usually a CEO, CFO, COO or head of operations.

## Core flow

1. Select an illustrative signal or enter a company chosen by the user.
2. Record the signal type, company context, public observation and source link.
3. Generate an operational hypothesis, clearly marked as unverified.
4. Suggest one narrow workflow proof that Velho could discuss with the buyer.
5. Prepare a discovery question and a short follow-up draft.
6. A human reviews and decides what to do. Signal Room never contacts a company.

## Prototype behavior

The working prototype is browser-only. It uses fictional example companies to demonstrate the interface and asks the operator to provide evidence for a real company. Signal type changes the hypothesis, proof wedge and question. The draft references the supplied evidence. The source link is optional and opens in a separate tab. The copy action copies a draft to the user's clipboard; there is no send action or external write.

## Signal types

- **Hiring for operations:** a role may point to a workflow that is growing with the team.
- **Expansion:** a new site or market may multiply existing coordination work.
- **Manual handoffs:** an observed handoff can reveal where work waits or gets re-entered.
- **Rising workload:** increasing volume may be outpacing current operating capacity.

These are prompts for discovery, not claims. A signal alone does not prove the company has an automation opportunity.

## What success looks like

- A teammate can prepare a useful, company-specific conversation in under five minutes.
- The output references an observation the buyer can recognize and verify.
- The first proof is narrow and practical, with a clear question for the buyer.
- A reviewer can distinguish source, inference and open question at a glance.
- No company is contacted or represented as a Velho prospect by the prototype.

## Out of scope for this prototype

Automated web research, company registry integrations, contact enrichment, intent scoring, CRM writes, message sending, campaign analytics and claims about expected ROI. Any future connection to external data or outreach requires a reviewed source and human approval before use.

## Product direction

The repository originated as a video-led outbound system for a different hackathon. Signal Room replaces its active user experience and product definition. Existing backend and media modules are currently unused by the Signal Room UI and should only be reconnected if a later product decision calls for them.
