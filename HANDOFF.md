# PR War Room — Handoff Brief

## What This Is

A config-driven React dashboard tracking who is winning the public narrative across **22 healthcare contract disputes** between providers and payors. Each dispute is analyzed using a composite scoring model with credibility-weighted media entries, patient stories, stakeholder actions, and employer reactions.

Behind a login gate (credentials hashed via SHA-256, not discoverable from source). Dropdown selector at top switches between disputes. Deployed via Vite + React to Vercel.

**Live:** https://pr-war-room.vercel.app/
**Repository:** https://github.com/nickherro/pr-war-room

---

## Architecture

### Project Structure

```
src/
  main.jsx              — Auth gate (SHA-256 credential check, sessionStorage)
  App.jsx               — Dropdown selector, routes all disputes to WarRoomDashboard
  WarRoomDashboard.jsx  — Shared parameterized component (~1200 lines)
  configs/              — 22 config files, one per dispute (auto-discovered)
    bcbsm.js            — BCBSM vs Michigan Medicine (84 entries)
    mtsinai.js          — Mt Sinai vs Anthem BCBS (100 entries)
    msk-uhc.js          — MSK vs UnitedHealthcare (50 entries)
    dignity-aetna.js    — Dignity Health vs Aetna (71 entries)
    bsw-bcbstx.js       — Baylor Scott & White vs BCBS TX (75 entries)
    scripps-anthem.js   — Scripps vs Anthem Blue Cross (60 entries)
    hartford-uhc.js     — Hartford HealthCare vs UHC (48 entries)
    huntsville-uhc.js   — Huntsville Hospital vs UHC (51 entries)
    jefferson-cigna.js  — Jefferson Health vs Cigna (48 entries)
    duke-aetna.js       — Duke Health vs Aetna (56 entries) [NC State Health Plan]
    unc-cigna.js        — UNC Health vs Cigna (51 entries)
    providence-aetna.js — Providence vs Aetna (44 entries)
    uw-aetna.js         — UW Medicine vs Aetna (45 entries)
    ahn-cigna.js        — Allegheny Health Network vs Cigna (44 entries)
    dignity-bcbsaz.js   — Dignity Health vs BCBS Arizona (45 entries)
    providence-cigna.js — Providence vs Cigna (41 entries)
    bon-secours-sc-cigna.js  — Bon Secours St. Francis vs Cigna SC (60 entries)
    spartanburg-cigna.js     — Spartanburg Regional vs Cigna (56 entries)
    main-line-cigna.js       — Main Line Health vs Cigna (60 entries)
    bon-secours-va-cigna.js  — Bon Secours vs Cigna VA (60 entries)
    tenet-cigna.js           — Tenet/Baptist vs Cigna national (65 entries)
    piedmont-cigna.js        — Piedmont Medical Center vs Cigna SC (50 entries)
index.html            — Generic title ("Dashboard"), no content hints
package.json          — Vite 5, React 18, Recharts
HANDOFF.md            — This file
```

### How Config Auto-Discovery Works

`App.jsx` uses `import.meta.glob("./configs/*.js", { eager: true })` to automatically discover and load all config files. Adding a new dispute requires only creating a new config file — no changes to App.jsx or any other file.

### Legacy Files (no longer imported)

`BCBSMDashboard.jsx` and `MtSinaiDashboard.jsx` still exist in `/src/` but are no longer imported. Both were converted to config files (`bcbsm.js`, `mtsinai.js`) so all 22 disputes flow through the shared `WarRoomDashboard` component.

---

## Dashboard Features

Each dispute dashboard includes:

1. **Composite Narrative Advantage Score** — credibility-weighted composite (-100 to +100) with four dimension breakdowns
2. **Narrative Momentum Trendline** — cumulative composite over time with volume bars, channel filter overlays
3. **Google Search Trends** — relative public interest over the dispute period
4. **Dispute Timeline** — horizontal timeline with equally-spaced dots showing key dates (news break, termination, extensions, agreement)
5. **Arguments Section** — side-by-side payor vs provider arguments organized by phase, showing how messaging evolved over time
6. **Filter Tabs** — All / Media / Social / Stakeholder / Employer. Recalculates all scores for filtered channel
7. **Executive Summary** — auto-generated narrative analysis with channel-specific takeaways
8. **Dimension Score Gauges** — horizontal diverging bars per dimension (frame adoption, sentiment, blame direction)
9. **Distribution Bars** — raw count stacked bars (unweighted)
10. **Collapsible Entry Logs** — per-channel logs collapsed by default on "All" view, expanded when a specific channel is selected. Source names are clickable links to original articles where URLs are available.

---

## Config File Format

Each config exports a default object with these properties:

```js
export default {
  // Identity
  providerKey: "msk",           // Used in frameAdoption, sentiment, blameDirection values
  payorKey: "uhc",
  providerName: "Memorial Sloan Kettering",
  payorName: "UnitedHealthcare",
  providerShort: "MSK",         // Abbreviation for UI labels
  payorShort: "UHC",
  navShort: "MSK v. UHC",       // Dropdown label
  title: "MSK vs UnitedHealthcare",
  subtitle: "Contract dispute · Resolved July 1, 2025",
  gradientId: "mskuhc",         // Unique SVG gradient prefix (prevents conflicts)

  // Dates
  monitorStart: "May 1, 2025",
  monitorEnd: "July 31, 2025",
  disputePublicDate: "2025-06-19",

  // Colors
  colors: { providerColor, payorColor, neutral, accent, bg, surface, surfaceHover, border, text, textMuted },
  distColors: ["#1B4D8E", "#465E85", "#8B2332"],
  yAxisWidth: 78,

  // Data arrays (defined as constants above the export)
  entries: ENTRIES,              // 40-100 coded entries
  labels: LABELS,               // Display labels for coded values
  sourceWeights: SOURCE_WEIGHTS, // 8-tier credibility weighting
  searchTrends: SEARCH_TRENDS,  // Weekly Google Trends data
  searchLabel: '"search term" · weekly',

  // Complaint data
  complaintData: { insurerIndex, nationalMedian, networkComplaints, priorYearComplaints, regulatorAction, signalRead },

  // Executive summary
  executiveSummary: { statement, keyMessages: [], marcomm: [] },
  channelTakeaways: { media: [], social: [], stakeholder: [], employer: [] },

  // Arguments (payor and provider, 2-4 phases each)
  arguments: {
    payor: [{ phase: "Early (Mon YYYY)", points: ["..."] }],
    provider: [{ phase: "Early (Mon YYYY)", points: ["..."] }],
  },

  // Timeline
  timeline: [
    { date: "YYYY-MM-DD", type: "newsBreak", label: "News breaks publicly" },
    { date: "YYYY-MM-DD", type: "termination", label: "Contract terminates" },
    { date: "YYYY-MM-DD", type: "extension", label: "Extension granted" },
    { date: "YYYY-MM-DD", type: "agreement", label: "Agreement reached" },
  ],
};
```

### Entry Format

```js
{
  id: 1,
  date: "2025-06-19",
  source: "CBS New York",
  url: "https://...",                    // Optional — makes source clickable
  sourceType: "tv",                      // news, tv, radio, owned, social, opinion
  channel: "media",                      // media, social, stakeholder, employer
  headline: "...",
  frameAdoption: "msk",                  // providerKey, payorKey, or "balanced"
  sentiment: "negative_uhc",             // negative_payorKey, negative_providerKey, neutral, positive_*
  patientStory: true,
  blameDirection: "uhc",                 // payorKey, providerKey, or "both"
  reachEstimate: "high",                 // high, medium, low
  notes: "Analyst notes...",
}
```

---

## Scoring Architecture

### Composite Score (-100 to +100)

Positive = provider winning. Negative = payor winning.

Four dimensions, credibility-weighted:
- **Frame Adoption (30%):** Whose narrative does coverage echo?
- **Sentiment (30%):** Emotional tone against each party
- **Blame Direction (25%):** Who is positioned as the obstacle?
- **Patient Story Saturation (15%):** Weighted patient story entries / total

### Source Credibility Weighting (8 tiers)

| Tier | Weight | Category | Examples |
|---|---|---|---|
| **1** | **1.5x** | National record | NBC News, CNN, KFF Health News, Bloomberg |
| **2** | **1.2x** | Regional authority | CBS local TV, Crain's, Detroit News, local NBC/ABC affiliates |
| **3** | **1.0x** | Trade/niche | Becker's, Healthcare Dive, Fierce Healthcare, community papers |
| **4** | **0.7x** | Organic social | Reddit, TikTok, Facebook groups, patient community posts |
| **5** | **0.4x** | Comment sections | News article comments |
| **6** | **0.3x** | Owned/party media | Hospital websites, insurer FAQs, press releases, party social accounts |
| **7** | **1.3x** | Stakeholder actions | Union contracts, regulator actions, executive statements, parallel disputes |
| **8** | **1.5-1.8x** | Employer/Benefits | Benefits brokers, employer HR communications |

---

## All 22 Disputes

| Config | Provider | Payor | Entries | Period | Status |
|--------|----------|-------|---------|--------|--------|
| bcbsm | Michigan Medicine | BCBSM | 84 | Jan–Jun 2026 | Active |
| mtsinai | Mt Sinai | Anthem BCBS | 100 | Sep 2025–Mar 2026 | Out of network |
| msk-uhc | MSK | UnitedHealthcare | 50 | May–Jul 2025 | Resolved Jul 1 |
| dignity-aetna | Dignity Health | Aetna | 71 | Feb–Apr 2024 | Resolved Apr 2024 |
| bsw-bcbstx | Baylor Scott & White | BCBS TX | 75 | May–Oct 2024 | Resolved Sep 27 |
| scripps-anthem | Scripps Health | Anthem Blue Cross | 60 | Oct 2024–May 2025 | Extension |
| hartford-uhc | Hartford HealthCare | UHC | 48 | Feb–Apr 2025 | Resolved Apr 1 |
| huntsville-uhc | Huntsville Hospital | UHC | 51 | Oct–Nov 2024 | Resolved Nov 14 |
| jefferson-cigna | Jefferson Health | Cigna | 48 | Mar–Apr 2025 | Resolved Apr 4 |
| duke-aetna | Duke Health | Aetna | 56 | Jul–Oct 2025 | Resolved Oct 3 |
| unc-cigna | UNC Health | Cigna | 51 | Jul–Dec 2025 | Resolved Dec 12 |
| providence-aetna | Providence | Aetna | 44 | Aug–Sep 2024 | Resolved Sep 3 |
| uw-aetna | UW Medicine | Aetna | 45 | May–Jul 2025 | Resolved Jul 3 |
| ahn-cigna | Allegheny Health Network | Cigna | 44 | May–Jun 2025 | Resolved Jun 28 |
| dignity-bcbsaz | Dignity Health | BCBS Arizona | 45 | Jan–Apr 2024 | Resolved Mar 15 |
| providence-cigna | Providence | Cigna | 41 | Jul–Sep 2024 | Resolved Aug 8 |
| bon-secours-sc-cigna | Bon Secours St. Francis | Cigna | 60 | Nov 2024–Apr 2025 | Resolved Apr 1 |
| spartanburg-cigna | Spartanburg Regional | Cigna | 56 | Nov 2024–Feb 2025 | Resolved Feb 15 |
| main-line-cigna | Main Line Health | Cigna | 60 | Nov 2024–Feb 2025 | Resolved Feb 15 |
| bon-secours-va-cigna | Bon Secours | Cigna | 60 | Feb–Apr 2025 | Resolved Apr 1 |
| tenet-cigna | Tenet/Baptist | Cigna | 65 | Oct–Dec 2025 | Resolved Dec 31 |
| piedmont-cigna | Piedmont Medical Center | Cigna | 50 | Oct–Dec 2025 | Resolved Dec 31 |

---

## Tech Stack

- **Vite 5** + **React 18** with hooks (useState, useMemo, useCallback)
- **Recharts** for charts (ComposedChart, Area, Line, Bar, XAxis, YAxis, etc.)
- **JetBrains Mono** (Google Fonts CDN) for data labels
- **Source Serif 4** for body text
- Auth gate in `main.jsx`: SHA-256 hash via Web Crypto API. SessionStorage key `_a`
- Zero-config Vercel deployment from GitHub main branch
- All data is static in config files — no backend, no API calls

## How to Add a New Dispute

1. Create `src/configs/your-dispute.js` following the format in `msk-uhc.js`
2. The app auto-discovers it via `import.meta.glob` — no other files need changes
3. Push to main — Vercel deploys automatically

## How to Continue This Work

1. **Add new entries** to existing config files as coverage appears
2. **New source? Add to `SOURCE_WEIGHTS`** in the config. Unmapped sources fall back to `SOURCE_TYPE_WEIGHTS` by sourceType
3. **Monitor social platforms** — biggest data gap. Set up alerts on Reddit, X, TikTok
4. **Track employer reactions** — the financial pressure point that matters most
5. **Watch for regulatory action** — DFS in NY, DIFS in MI, state DOIs elsewhere
6. **Add URLs** to entries that don't have them yet — makes source links clickable
