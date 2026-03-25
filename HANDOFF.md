# PR War Room — Mt Sinai vs Anthem BCBS: Handoff Brief

## What This Is

An interactive React dashboard (single `.jsx` file) that tracks who is winning the public narrative in the contract dispute between **Mount Sinai Health System** and **Anthem Blue Cross Blue Shield (Elevance Health)** in New York City. Built for internal strategy use.

## Files

- `pr-war-room.jsx` — The complete dashboard as a single React component. Works as a Claude artifact or as `src/App.jsx` in the Vite project.
- `pr-war-room-deploy.zip` — Complete Vite + React project. `npm install && npm run dev` or drag to Vercel.
  - `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore`

## The Dispute — Essential Context

**Parties:**
- **Party A (Mt Sinai):** Non-profit academic medical system. 7 hospitals, ~9,000 physicians, 48,000 employees. NYC metro + Westchester + Long Island + Florida. U.S. News Honor Roll hospital. Brand colors: cyan `#06ABEB`, magenta `#DC298D`, deep blue `#212070`, near-black `#00002D`.
- **Party B (Anthem):** Subsidiary of Elevance Health, the 2nd largest for-profit insurer in the US. $197.6B revenue, $5.7B profit (2025).

**What happened:**
1. Contract renegotiation began spring 2025.
2. Negotiations stalled around Thanksgiving 2025 — Mt Sinai says Anthem withdrew all offers; Anthem says they had a deal ready and Mt Sinai refused to sign.
3. Contract expired Dec 31, 2025. ~9,000 Mt Sinai physicians went out-of-network for Anthem Jan 1, 2026.
4. NY state law mandated a cooling-off period keeping hospitals in-network until March 1.
5. Brief extension to March 3. Final breakdown March 4, 2026 — hospitals and facilities also went out of network.
6. As of March 25, 2026: **fully out of network, negotiations ongoing but stalled.** ~200,000 Anthem patients affected annually.

**Core disagreement — two competing narratives:**

| | Mt Sinai's Frame | Anthem's Frame |
|---|---|---|
| **Rates** | Seeking single-digit annual increases. Anthem pays 35% less than peer NYC systems. | Mt Sinai demands 50%+ increase over 3 years. |
| **$450M claim** | Anthem owes $450M for care already delivered. | Mt Sinai has provided no documentation. Anthem pays 95.4% of claims within 15 days. |
| **Contract terms** | Wants protections against excessive denials, delayed determinations, prolonged appeals. | Mt Sinai wants to eliminate billing checks, block claim reviews, leave network without warning. |
| **Who walked away** | Anthem withdrew agreed-upon terms at the last minute. | Mt Sinai refused to sign a ready contract. |

## Dashboard Architecture

### Scoring Model (Composite Score: -100 to +100)

Positive = Mt Sinai winning. Negative = Anthem winning.

- **Frame Adoption (30%):** Whose narrative does coverage echo? `(pro-A − pro-B) / total × 100`
- **Sentiment (30%):** Emotional tone against each party. `(anti-B − anti-A) / total × 100`
- **Blame Direction (25%):** Who is positioned as the obstacle? `(blames-B − blames-A) / total × 100`
- **Patient Story Saturation (15%):** Entries with named patient stories / total × 100. Inherently favors the provider side.

### Components

1. **Composite Score** — big number with label
2. **Narrative Momentum Trendline** — SVG sparkline, cumulative composite over time. Channel filter overlays.
3. **Filter Tabs** — All / Media / Social / Stakeholder. Recalculates scores for filtered channel.
4. **Dimension Score Gauges** — horizontal diverging bars per dimension
5. **Distribution Bars** — raw counts stacked bars
6. **Entry Log** — sortable table with date, source, headline, frame, sentiment, blame, reach, analyst notes
7. **Add Entry Form** — manual entry with all scoring dimensions

### Coding Codebook

**Frame:** `A` (Mt Sinai frame), `B` (Anthem frame), `Balanced`
**Sentiment:** `anti-B`, `anti-A`, `Neutral`, `pro-A`, `pro-B`
**Blame:** `A` (blames Mt Sinai), `B` (blames Anthem), `Both`
**Patient Story:** `true`/`false` — named individual whose experience creates sympathy
**Reach:** `High` (national outlet, major metro daily, local TV, viral social), `Medium` (regional, trade, mid-engagement), `Low` (niche, low-engagement)

## Current Data: 50 Coded Entries

**By channel:** 19 Media, 19 Social, 12 Stakeholder
**Current composite score: ~+30 (Mt Sinai leading)**

### Key Sources Tracked

**Media (19):**
- CBS New York (TV) — 4 stories, most impactful local outlet. Features DeQuevedo family, Massiel Lugo, John Esposito, Susan Kim.
- NBC News — national pickup. Natalie Reichel cancer patient story.
- Gothamist/WNYC — Elisabeth Benjamin (Community Service Society) interview. Systemic framing.
- PIX11 — most balanced local TV.
- News 12 Long Island — Fischman family, suburban angle.
- Healthcare Dive, MedCity News, Becker's Hospital Review/Payer Issues — trade press.
- HR Brew — employer/HR angle.
- Crain's New York Business — 32BJ direct contract story (critical).
- Mt Sinai owned media: keepmountsinai.org, choosemountsinai.org, The Vitals podcast, Setting the Record Straight PDF.
- Anthem owned media: anthem.com/update/mountsinai, Myths vs Facts page.

**Social (19):**
- TikTok: Massiel Lugo (lupus patient, Queens, single mom, 3 jobs)
- CBS/YouTube video shares of DeQuevedo family story
- News comment sections (CBS, Gothamist, PIX11, Yahoo News)
- Mt Sinai official social campaign across Facebook, Instagram, X, LinkedIn
- Mt Sinai employee/clinician posts (Leslie Schlachter PA-C, others on LinkedIn)
- keepmountsinai.org organized call-to-action (call Anthem, contact HR, file DFS complaints)
- Medicare patient forum confusion
- HR professional community discussion
- Reddit r/nyc — limited visibility, estimated anti-Anthem

**Stakeholder (12):**
- 32BJ SEIU — bypassed Anthem with direct Mt Sinai contract for 100K+ workers. Most significant stakeholder move.
- Gov. Hochul — proposed extending cooling-off from 60 to 120 days but has NOT directly weighed in on this dispute. Previously forced Anthem to reverse anesthesia coverage policy.
- Elisabeth Benjamin / Community Service Society — systemic reform advocate, calls for standardized contracting calendar.
- Jason Buxbaum / Brown University — 18% of hospitals had public insurer disputes 2021-2025.
- Caroline Pearson / Peterson Health Technology Institute — provider consolidation gives hospitals leverage.
- UN Health & Life Insurance Section — notified international staff.
- Hotel Trades Council — retained in-network access (separate contract).
- Molina Healthcare — Mt Sinai ALSO dropped Molina Medicaid plans (hurts Mt Sinai framing).
- NYC hospital competitors — SILENT. All remain in Anthem's network.
- Anthem's direct-contract physician recruitment — some Mt Sinai docs broke ranks.

## Strategic Assessment

### Mt Sinai is winning. Here's why:

1. **Patient stories are one-sided.** Every named patient (DeQuevedo, Reichel, Lugo, Esposito, Fischman, Kim) generates sympathy for Mt Sinai. Anthem has zero patient advocates in public.

2. **PR operation is sophisticated and well-resourced.** Dedicated campaign domain (keepmountsinai.org), second site (choosemountsinai.org), 34-min podcast episode, formal PDF rebuttal, organized call-to-action directing patients to pressure Anthem AND file DFS complaints, Chapter.org Medicare enrollment partnership, coordinated social media campaign. Anthem's response is a single FAQ page.

3. **$450M unpaid claims message is stickier** than Anthem's "consumer protections" counter-frame. Dollar amounts are concrete; "billing safeguards" is abstract.

4. **Non-profit vs. for-profit framing is powerful** in current public sentiment (post-UHC CEO shooting environment). Mt Sinai explicitly contrasts its non-profit status with Elevance's $5.7B profit.

5. **32BJ direct contract validates Mt Sinai.** A major union bypassing Anthem entirely says Mt Sinai's pricing is reasonable and Anthem is the unnecessary middleman. Crain's coverage was devastating for Anthem.

6. **Grassroots mobilization is asymmetric.** Mt Sinai has organized patient pressure campaigns. Anthem has nothing equivalent — no patients are calling Mt Sinai demanding they accept Anthem's terms.

### Anthem's best cards:

1. **Molina parallel.** Mt Sinai also dropped Molina Medicaid/HARP/Child Health Plus plans for 2026. This undermines "patient champion" narrative — low-income patients losing access is bad optics for Mt Sinai.

2. **UHC/Oxford precedent (2024).** Mt Sinai dropped UnitedHealthcare/Oxford plans the prior year. Pattern of aggressive negotiation weakens "Anthem is uniquely unreasonable" argument.

3. **Competitor silence.** Every other major NYC hospital system (NYU Langone, NewYork-Presbyterian, Northwell, Columbia) remains in Anthem's network and none have commented. Anthem's "every other system works with us" line is factually true.

4. **Divide and conquer.** Some Mt Sinai-affiliated physicians contracted directly with Anthem. Weakens unified front.

5. **Cost framing has some traction in trade press.** "50% increase by 2028" is a big number even if Mt Sinai disputes it. Employers and HR professionals respond to cost arguments.

6. **Political silence.** Governor and legislators have not pressured either side. No regulatory threat to Anthem.

### What's NOT in the data (gaps to fill):

- **Reddit, Facebook groups, Nextdoor, X/Twitter** — web search has minimal reach into these platforms. Need social listening tools (Brandwatch, Meltwater, Sprout Social) or direct platform search.
- **Employer-level reactions** — are specific large NYC employers pressuring Anthem? This would be private but critical to track.
- **Mt Sinai physician attrition** — how many doctors are contracting directly with Anthem? Anthem lists some on their site but total unknown.
- **Patient volume shifts** — are Anthem patients actually leaving Mt Sinai or paying out-of-network? Operational data Mt Sinai would have internally.
- **DFS complaint volume** — Mt Sinai is directing patients to file regulatory complaints. If DFS gets flooded, it could trigger state intervention.
- **Hochul's next move** — the 120-day cooling-off proposal is in the budget. If it passes, it changes the timeline dynamics for future disputes.

## Tech Notes

- React 18 with hooks. Single-file component, no external dependencies beyond React.
- JetBrains Mono (Google Fonts CDN) for data. System sans-serif for body.
- Mt Sinai brand palette: dark background `#00002D`, accent `#06ABEB` (cyan), secondary `#DC298D` (magenta), deep blue `#212070`.
- All data is in the `ENTRIES` array at the top of the file. Easy to add/modify entries.
- The Add Entry form allows runtime additions (not persisted across refreshes — add to ENTRIES array for persistence).
- SVG sparkline is hand-rolled, no charting library.
- Vite project deploys to Vercel with zero config.

## How to Continue This Work

1. **Add new entries** as coverage appears. Use the in-app form for quick adds, then backport to the ENTRIES array.
2. **Monitor social platforms directly** — the biggest data gap. Set up alerts for "mount sinai anthem" on Reddit, X, TikTok.
3. **Track employer reactions** — if large NYC employers start switching away from Anthem, that's the game-changer signal.
4. **Watch for DFS/regulatory action** — Mt Sinai is actively generating complaint volume.
5. **Monitor 32BJ model expansion** — if other unions or large employers pursue direct contracts, Anthem's intermediary position erodes.
6. **Track the Molina story** — if this gets more coverage, it damages Mt Sinai's narrative. It's their biggest vulnerability.
