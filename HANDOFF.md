# PR War Room — Handoff Brief

## What This Is

A dual-dashboard React application tracking who is winning the public narrative in two concurrent healthcare contract disputes:

1. **Mt Sinai vs Anthem BCBS** (New York City) — fully out of network since March 4, 2026
2. **BCBSM vs Michigan Medicine** (Michigan) — June 30, 2026 deadline, currently negotiating

Behind a login gate (credentials hashed via SHA-256, not discoverable from source). Toggle bar at top switches between dashboards. Deployed via Vite + React to Vercel/GitHub Pages.

**Repository:** https://github.com/nickherro/pr-war-room

---

## Project Structure

```
src/
  main.jsx          — Auth gate (SHA-256 credential check, sessionStorage persistence)
  App.jsx           — Toggle wrapper (sticky top bar, switches between dashboards)
  MtSinaiDashboard.jsx  — 95 coded entries, complete dashboard
  BCBSMDashboard.jsx    — 79 coded entries, complete dashboard
index.html          — Generic title ("Dashboard"), no content hints
package.json        — Vite 5, React 18, @vitejs/plugin-react
HANDOFF.md          — This file
```

---

## Dispute 1: Mt Sinai vs Anthem BCBS

### Parties

- **Mt Sinai:** Non-profit academic medical system. 7 hospitals, ~9,000 physicians, 48,000 employees. NYC metro + Westchester + Long Island + Florida. U.S. News Honor Roll. Brand colors: cyan `#06ABEB`, magenta `#DC298D`, deep blue `#212070`, near-black `#00002D`.
- **Anthem:** Subsidiary of Elevance Health, 2nd largest for-profit insurer in the US. $197.6B revenue, $5.7B profit (2025).

### Timeline

1. Contract renegotiation began spring 2025.
2. Negotiations stalled around Thanksgiving 2025 — Mt Sinai says Anthem withdrew all offers; Anthem says they had a deal ready and Mt Sinai refused to sign.
3. Contract expired Dec 31, 2025. ~9,000 physicians went out-of-network Jan 1, 2026.
4. NY state law mandated cooling-off keeping hospitals in-network until March 1.
5. Brief extension to March 3. Final breakdown March 4, 2026 — hospitals and facilities also went out of network.
6. As of March 25, 2026: **fully out of network, negotiations ongoing but stalled.** ~200,000 Anthem patients affected annually.

### Competing Narratives

| | Mt Sinai's Frame | Anthem's Frame |
|---|---|---|
| **Rates** | Seeking single-digit annual increases. Anthem pays 35% less than peer NYC systems. | Mt Sinai demands 50%+ increase over 3 years. |
| **$450M claim** | Anthem owes $450M for care already delivered. | Mt Sinai has provided no documentation. Anthem pays 95.4% of claims within 15 days. |
| **Contract terms** | Wants protections against excessive denials, delayed determinations, prolonged appeals. | Mt Sinai wants to eliminate billing checks, block claim reviews, leave network without warning. |
| **Who walked away** | Anthem withdrew agreed-upon terms at the last minute. | Mt Sinai refused to sign a ready contract. |

### Current Data: 95 Coded Entries

**By channel:** ~45 Media, ~19 Social, ~18 Stakeholder, plus owned media entries
**Credibility-weighted composite score: Mt Sinai leading**

### Key Sources

**Tier 1–2 Media:** CBS New York (7 stories — DeQuevedo, Lugo, Esposito, Kim, breakdown), NBC News national (Reichel cancer story, Leemore Dafny Harvard, Jason Buxbaum Brown), Gothamist/WNYC (Benjamin "It's always about money"), PIX11, News 12 LI (3 stories — Fischman family, multiple breakdown segments), Crain's NY Business (5 stories — earliest Dec 2025, $300M→$450M evolution, 32BJ deal details, March split).

**Tier 3 Media:** Healthcare Dive, MedCity News, Becker's ("reaches for the mic"), HR Brew (employer angle), LI Herald (Amy Potter cardiac arrest), El Diario NY (Spanish-language), NYC Today (2 stories), KFF Health News (national trend piece), Manila Times (international syndication).

**Owned Media (0.3x weight):** keepmountsinai.org (patient mobilization + DFS complaint instructions), choosemountsinai.org (Medicare enrollment + Chapter.org partnership), The Vitals podcast (34-min episode), Setting the Record Straight PDF, coordinated social campaign (FB, IG, X, LinkedIn). Anthem: anthem.com FAQ, Myths vs Facts page.

**Social (0.7x weight):** Massiel Lugo viral TikTok, CBS/YouTube shares, comment sections (CBS, Gothamist, PIX11, Yahoo), Mt Sinai employee/clinician posts (Leslie Schlachter PA-C), Reddit r/nyc, Facebook groups, HR community, Medicare forum.

**Stakeholders (1.3x weight):** 32BJ SEIU direct contract (100K workers, 6 hospitals, 400 outpatient, growth capped 3-4%), Hochul 120-day proposal, Benjamin/CSS systemic reform, Buxbaum/Brown 18% stat, Pearson/Peterson consolidation analysis, UN HLIS, Hotel Trades Council (separate contract), AHA letter to Elevance re: nonparticipating provider policy, AANS/physician orgs, NYP/UHC parallel dispute (April 1 deadline), UHC/MSK resolved, Memorial Hermann/BCBS TX.

**Vulnerabilities for Mt Sinai:** Molina Medicaid also dropped (hurts patient champion narrative), UHC/Oxford dropped 2024 (pattern), competitor silence, physician direct-contracting with Anthem, DFS silence, political silence.

---

## Dispute 2: BCBSM vs Michigan Medicine

### Parties

- **Michigan Medicine:** University of Michigan Health academic medical center. $7B system, 200+ locations. State's only academic medical center. C.S. Mott Children's Hospital, Frankel Cardiovascular Center, Von Voigtlander Women's Hospital. $233.5M operating income (FY2025, 2.7% margin). Operating at 95% capacity (recommended max 85%). Brand colors: Michigan blue `#00274C`, maize `#FFCB05`.
- **BCBSM:** Blue Cross Blue Shield of Michigan. 4.5M members, 63% market share. $43.3B revenue. Reported $246M loss in 2025 (5th consecutive loss year). CEO Tricia Keith earned $6.9M. $20.7B medical spend. Three major health systems (HFH, Corewell, MM) represent 61% of claims.

### Timeline

1. Negotiations began early 2025. Current contract ongoing.
2. BCBSM offered terms Michigan Medicine calls a "30% reduction in reimbursement." BCBS calls MM's counter a "44% increase demand."
3. March 2, 2026: Michigan Medicine issued 120-day termination notice.
4. **June 30, 2026 deadline.** If no deal, hospitals/clinics go out-of-network July 1.
5. As of March 25, 2026: **actively negotiating, no changes yet.** ~300,000 BCBS patients affected.
6. Context: Henry Ford Health and Corewell Health both signed value-based deals with BCBS — MM is the last holdout of the "Big 3."

### Competing Narratives

| | Michigan Medicine's Frame | BCBSM's Frame |
|---|---|---|
| **Rates** | Proposing single-digit annual increases. BCBS pays 22% below other major MI commercial plans. | MM demanding 44% increase. Already the highest-paid system in MI. |
| **Financial health** | $233.5M operating income reflects reinvestment needs at 95% capacity. | BCBS lost $1.03B (2024), $246M (2025). GLP-1 drugs alone cost $1.1B. |
| **Quality** | State's only academic medical center. Treats "the sickest of the sick." Patients travel statewide. | Common procedures cost 100% more at MM vs peer hospitals. |
| **Value-based care** | Open to tying increases to quality outcomes. | Henry Ford and Corewell already agreed to value-based deals. MM is the outlier. |

### Current Data: 79 Coded Entries

**By channel:** ~30 Media, ~27 Social, ~22 Stakeholder
**Credibility-weighted composite score: Michigan Medicine leading (but closer than Mt Sinai)**

### Key Sources

**Tier 1–2 Media:** Detroit News (3 stories — 300K patients, Grasso Regents, Candice Williams), Bridge Michigan (deep dive — BCBS $246M vs MM $234M), Crain's Detroit (4 stories — "most important talks in existence," deep dive with Keith/Miller, HFH deal, March 4 initial), WXYZ (3 stories — patient families: Graber pregnant, Murphy genetic disorder, Formo chronic illness), CBS Detroit, Michigan Public NPR (Tracy Samilton, Julie Ishak nursing exec), WEMU (latest update Mar 23), ABC12 Flint.

**Tier 3 Media:** Michigan Advance (patient concerns), Michigan Daily (Amina Ignatius student impact), DBusiness, ClickOnDetroit/WDIV, Live Insurance News, InsuranceNewsNet syndication, WOWO Indiana syndication, Blue Water Healthy Living/Yahoo/AOL syndication.

**Owned Media (0.3x weight):** BCBSM mibluedaily.com ("Lock Blue Cross Members Out" framing), BCBS CEO Keith interview, MM CEO Miller interview, UM HR reassurance, MM Facebook #KeepMichiganMedicine campaign.

**Social (0.7x weight):** Threads viral post (@michellewhisks — 75+ likes, 60+ replies), multiple Threads threads (CEO pay criticism, single-payer advocacy, BCBS denial anecdotes, open enrollment frustration), Reddit r/AnnArbor, comment sections (Michigan Advance, ClickOnDetroit).

**Stakeholders (1.3x weight):** UM Interim President Grasso (publicly accused BCBS of lying at Regents meeting), MSMS (monitoring, neutral), DIFS (declined to comment — no regulatory authority), DMC/Tenet (ready to absorb patients), Corewell value-based deal (through 2030), Henry Ford value-based deal (Feb 27), BCBS $246M loss/1,300 jobs cut, Trinity Health/Humana parallel dispute, independent analysts (Gulick, Baumgarten, Gaba).

**Vulnerabilities for Michigan Medicine:** HFH and Corewell both signed (2-vs-1 pressure), BCBS financial losses are real ($1.03B + $246M), "44% increase" number is sticky even if disputed, Governor Whitmer silent (historically funded by BCBS), no legislative pressure, 60% of BCBS members are self-insured employer plans (employer perception critical).

---

## Scoring Architecture

### Composite Score (-100 to +100)

Positive = hospital/provider winning. Negative = insurer winning.

Four dimensions, weighted:
- **Frame Adoption (30%):** Whose narrative does coverage echo? `(pro-Hospital − pro-Insurer) / totalWeight × 100`
- **Sentiment (30%):** Emotional tone against each party. `(anti-Insurer − anti-Hospital) / totalWeight × 100`
- **Blame Direction (25%):** Who is positioned as the obstacle? `(blames-Insurer − blames-Hospital) / totalWeight × 100`
- **Patient Story Saturation (15%):** Weighted patient story entries / totalWeight × 100. Inherently favors provider side.

### Source Credibility Weighting

**All scoring uses credibility-adjusted weights.** Each entry's contribution to every dimension is multiplied by its source tier weight. This prevents owned-media spam or comment-section volume from distorting the composite.

| Tier | Weight | Category | Examples | Rationale |
|---|---|---|---|---|
| **1** | **1.5x** | National record | NBC News, KFF Health News, NPR national | Shapes the frame for everyone else. If NBC calls it an "Anthem problem," that's the story. |
| **2** | **1.2x** | Regional authority | CBS local TV, Crain's, Detroit News, Bridge MI, Gothamist, News 12, WXYZ, Michigan Public | Trusted by the affected population. Local TV = highest raw viewership. Business press = employer decision-makers. |
| **3** | **1.0x** | Trade/niche | Healthcare Dive, Becker's, HR Brew, Michigan Daily, LI Herald, El Diario, Michigan Advance | Credible but narrower audiences. Trade press shapes industry perception. Student/community papers shape local. |
| **4** | **0.7x** | Organic social | Reddit, TikTok (patient-originated), Threads, Facebook groups, LinkedIn clinician posts | Authentic signal of public sentiment, but unvetted, small reach per post, easily cherry-picked. |
| **5** | **0.4x** | Comment sections | News article comments (CBS, Gothamist, PIX11, Yahoo, Michigan Advance, WDIV) | Lowest-effort engagement. Selection bias — angry people comment. Directional signal only. |
| **6** | **0.3x** | Owned/party media | keepmountsinai.org, anthem.com, mibluedaily.com, choosemountsinai.org, party social accounts, press releases, podcasts | Propaganda. Matters for tracking narrative effort and PR sophistication, but should barely move the "who's winning" score because it's not independent. |
| **7** | **1.3x** | Stakeholder actions | 32BJ direct contract, AHA letter, Grasso at Regents, HFH/Corewell deals, DIFS, MSMS, DMC absorption offer | Actions > words. A union bypassing an insurer is more persuasive than 50 news articles. A competitor signing validates the insurer's framework. |

**Implementation:** Each source name is mapped to a weight in `SOURCE_WEIGHTS`. Unmapped sources fall back to `SOURCE_TYPE_WEIGHTS` by `sourceType` field (`tv: 1.2`, `radio: 1.2`, `news: 1.0`, `social: 0.7`, `owned: 0.3`, `opinion: 0.8`, `other: 1.0`).

**Raw counts are preserved** in distribution bars (unweighted). Only the composite score and its four dimension scores use credibility weighting.

### Coding Codebook

**Frame:** `mtsinai`/`mm` (hospital frame), `anthem`/`bcbs` (insurer frame), `balanced`
**Sentiment:** `negative_anthem`/`negative_bcbs` (anti-insurer), `negative_mtsinai`/`negative_mm` (anti-hospital), `neutral`, `positive_*` variants
**Blame:** `anthem`/`bcbs` (blames insurer), `mtsinai`/`mm` (blames hospital), `both`
**Patient Story:** `true`/`false` — named individual whose experience creates sympathy
**Reach:** `high` (national outlet, major metro daily, local TV, viral social), `medium` (regional, trade, mid-engagement), `low` (niche, low-engagement)
**Source Type:** `tv`, `radio`, `news`, `social`, `owned`, `opinion`, `other`

---

## Dashboard Components

1. **Composite Score** — big number with label and credibility-weighted methodology
2. **Narrative Momentum Trendline** — SVG sparkline, cumulative composite over time. Volume bar chart behind the line shows per-date mention count (grayed out). Channel filter overlays. When filtered to a tab, bars show only that channel's volume.
3. **Filter Tabs** — All / Media / Social / Stakeholder. Recalculates all scores for filtered channel.
4. **Dimension Score Gauges** — horizontal diverging bars per dimension (credibility-weighted)
5. **Distribution Bars** — raw counts stacked bars (unweighted)
6. **Entry Log** — sortable table with date, source, headline, frame, sentiment, blame, reach, analyst notes
7. **Add Entry Form** — manual entry with all scoring dimensions (not persisted across refreshes — add to INITIAL_ENTRIES array for persistence)

---

## Strategic Assessment (as of March 25, 2026)

### Mt Sinai vs Anthem: Mt Sinai winning decisively

**Why:**
1. **Patient stories are completely one-sided.** DeQuevedo (Tourette's/DBS), Reichel (breast cancer), Lugo (lupus/single mom/3 jobs), Esposito ("healthcare refugee"), Fischman family, Kim, Potter (cardiac arrest). Anthem has zero patient advocates in public.
2. **PR operation is sophisticated.** Two dedicated domains, 34-min podcast, PDF rebuttal, organized DFS complaint campaign, Chapter.org Medicare enrollment, coordinated multi-platform social. Anthem has one FAQ page.
3. **$450M claim is stickier** than "consumer protections." Concrete dollars beat abstract policy language.
4. **Non-profit vs. for-profit framing** resonates in post-UHC CEO shooting environment. Mt Sinai leverages Elevance's $5.7B profit explicitly.
5. **32BJ direct contract** validates Mt Sinai pricing. $46M savings vs standard rates (Northwell precedent). Growth capped at 3-4%. Devastating for Anthem's intermediary value proposition.
6. **National context helps Mt Sinai.** NBC, KFF, NPR all framing hospital-insurer disputes as systemic — patients are victims, insurers are obstacles.
7. **NYP/UHC parallel** (April 1 deadline) undermines Anthem's "every other system works with us" — the OTHER major insurer has the SAME problem with a DIFFERENT NYC hospital.
8. **AHA and physician orgs** actively opposing Anthem's nonparticipating provider policy nationally. Cross-specialty institutional opposition.
9. **Spanish-language coverage** (El Diario NY) reaches significant affected population that English media misses.

**Anthem's best cards:**
1. Molina Medicaid also dropped (pattern of aggressive negotiation).
2. UHC/Oxford dropped 2024 (Mt Sinai has done this before).
3. Competitor silence — NYU Langone, Northwell, Columbia all in Anthem's network.
4. Some physicians broke ranks to contract directly with Anthem.
5. "50% increase by 2028" has traction in trade press / employer audience.
6. Political silence — no regulatory pressure on Anthem.

### BCBSM vs Michigan Medicine: Michigan Medicine leading, but closer

**Why MM leads:**
1. **Patient stories favor MM.** Collin Shuler (developmentally disabled, "life-threatening"), 14yo Crohn's patient at Mott, Julie Graber (pregnant daughter due July), Haley Murphy (rare genetic disorder baby), Kristin Formo (chronic illness).
2. **Grasso's Regents speech** directly accused BCBS of lying — escalated to institutional level.
3. **"Only academic medical center"** framing is powerful. Patients travel statewide for complex care unavailable elsewhere.
4. **BCBS financial losses are a double-edged sword.** $246M loss looks sympathetic until paired with CEO Keith's $6.9M compensation.
5. **Operating at 95% capacity** narrative (recommended max 85%) creates urgency around investment needs.

**Why it's closer:**
1. **Henry Ford + Corewell both signed value-based deals.** 2-vs-1 pressure. MM is the holdout.
2. **BCBS financial losses are real.** $1.03B (2024) + $246M (2025) + GLP-1 costs $1.1B. Not fabricated.
3. **"44% increase" number is sticky** even though MM disputes it. BCBS framing as "affordability crisis" resonates with employers.
4. **Governor Whitmer silent.** Historically funded by BCBS (per The Intercept 2018). No political pressure on BCBS.
5. **BCBS "lock out" framing** to employers (300K members + their employers) creates counter-pressure.
6. **No analog to 32BJ.** No major stakeholder has bypassed BCBS to validate MM's pricing.

---

## Data Gaps (priority order)

### Both disputes:
- **Social listening at scale** — Reddit, Facebook groups, Nextdoor, X/Twitter, TikTok. Web search has minimal reach into these platforms. Need Brandwatch, Meltwater, or Sprout Social.
- **Employer-level reactions** — are specific large employers pressuring insurers or switching? Private but critical.

### Mt Sinai specific:
- **DFS complaint volume** — Mt Sinai is actively driving regulatory complaints. If DFS gets flooded, state intervention possible.
- **Physician attrition** — how many Mt Sinai docs contracted directly with Anthem?
- **Patient volume shifts** — are patients actually leaving or paying out-of-network?
- **Hochul's 120-day bill status** — in the budget, passage changes future timeline dynamics.

### BCBSM specific:
- **Employer switching signals** — are large SE Michigan employers considering alternatives to BCBS?
- **Legislature response** — any bills to mandate cooling-off periods in Michigan?
- **MM patient volume impact** — are BCBS patients pre-switching before July 1?
- **Value-based deal terms** — what exactly did Henry Ford and Corewell agree to? MM may argue those terms are inappropriate for an academic center.

---

## Tech Notes

- React 18 with hooks. Each dashboard is a single-file component with no external dependencies beyond React.
- JetBrains Mono (Google Fonts CDN) for data. System sans-serif for body.
- Auth gate in `main.jsx`: SHA-256 hash of credentials via Web Crypto API (SubtleCrypto). SessionStorage key `_a` for tab persistence. No branding or project hints on login screen.
- SVG sparkline and volume bars are hand-rolled, no charting library.
- All data in `INITIAL_ENTRIES` array at top of each dashboard file. Easy to add/modify.
- Mt Sinai palette: dark bg `#00002D`, cyan `#06ABEB`, magenta `#DC298D`, deep blue `#212070`.
- BCBSM palette: Michigan blue `#00274C`, maize `#FFCB05`, BCBS blue `#2F65A7`, MM crimson `#9A3324`.
- Vite project deploys to Vercel with zero config.

## How to Continue This Work

1. **Add new entries** as coverage appears. Use the in-app form for quick adds, then backport to `INITIAL_ENTRIES`. Don't forget to assign the correct source weight tier.
2. **New source? Add to `SOURCE_WEIGHTS` map** in the dashboard file. If not mapped, it falls back to `SOURCE_TYPE_WEIGHTS` by `sourceType`.
3. **Monitor social platforms directly** — the biggest data gap. Set up alerts on Reddit, X, TikTok for both disputes.
4. **Track employer reactions** — the financial pressure point that matters most for both disputes.
5. **Watch for regulatory action** — DFS in NY, DIFS in MI. Organized complaint volume could trigger intervention.
6. **Monitor 32BJ model expansion** — if other unions/employers pursue direct contracts, Anthem's position erodes.
7. **Track Molina story** (Mt Sinai) and **HFH/Corewell deal terms** (BCBSM) — both are the respective hospital's biggest vulnerability.
8. **BCBSM deadline is June 30** — coverage will intensify as deadline approaches. Expect patient stories to accelerate in May/June.
9. **NYP/UHC deadline is April 1** — resolution or breakdown there directly impacts Mt Sinai/Anthem narrative framing.
