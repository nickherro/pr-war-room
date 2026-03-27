# Market Sentiment Tracker (PR War Room)

**Live:** https://pr-war-room.vercel.app/
**Repository:** https://github.com/nickherro/pr-war-room

## Quick Start
```bash
npm run dev     # Vite dev server
npm run build   # Production build
```
Deployed on Vercel (zero-config from GitHub main branch). SPA rewrite configured in `vercel.json`.

## Stack
- **Vite 5 + React 18** — no TypeScript, no react-router
- **Recharts** for all charts (LineChart, BarChart, ResponsiveContainer)
- **Browser History API** for routing (pushState/popstate in App.jsx)
- **SHA-256 auth gate** in main.jsx (Web Crypto API, sessionStorage key `_a`)
- **localStorage** for scoring weight override persistence
- **JetBrains Mono** + **Source Serif 4** via Google Fonts CDN
- All data is static in config files — no backend, no API calls

## Architecture

### Routing
- No react-router. `App.jsx` reads `window.location.pathname` to determine active dispute.
- `null` = homepage, string (e.g. `"bcbsm"`) = dispute dashboard view.
- `navigate()` uses `history.pushState`. `popstate` listener handles back/forward.
- `vercel.json` has SPA rewrite so all paths serve `index.html`.

### Config Auto-Discovery
- `import.meta.glob("./configs/*.js", { eager: true })` loads all 26 dispute configs.
- Config filename (without `.js`) becomes the route path and dashboard ID.
- Adding a new dispute requires only creating a new config file — no changes to App.jsx or any other file.

### Key Components
| File | Purpose |
|------|---------|
| `src/main.jsx` | Auth gate, renders App |
| `src/App.jsx` | Router, nav bar, scoring overrides state |
| `src/Homepage.jsx` | Dispute inventory with scores, sparklines, status badges |
| `src/WarRoomDashboard.jsx` | Main dashboard: 3 tabs (Dashboard, Media Summary, Coverage Analysis) |
| `src/DeepAnalysis.jsx` | Coverage Analysis tab: weekly favorability chart, message discipline, top sources |
| `src/ScoringSettings.jsx` | Scoring weight configuration panel |
| `src/Methodologies.jsx` | Full methodology page: scoring framework, trend modes, data aggregation |
| `src/PrintReport.jsx` | Print-optimized PDF export of dashboard (via browser print dialog) |
| `src/logos.jsx` | Logo lookup by providerKey/payorKey, OrgLogo component |
| `public/logos/*.png` | Organization favicon/logos (30 files, sourced from Google favicons) |
| `public/logos/jarrard-full.svg` | Jarrard horizontal wordmark (includes "A Chartis Company") |
| `public/logos/chartis-full.svg` | Chartis horizontal wordmark (blue) |
| `src/configs/*.js` | 26 dispute config files |

### Dashboard Features
1. **Composite Narrative Advantage Score** — credibility-weighted composite (-100 to +100)
2. **Narrative Momentum Trendline** — composite over time with volume bars, channel filter overlays
3. **Google Search Trends** — relative public interest over the dispute period
4. **Dispute Timeline** — horizontal timeline with key dates (news break, termination, extensions, agreement)
5. **Arguments Section** — side-by-side payor vs provider arguments organized by phase
6. **Filter Tabs** — All / Media / Social / Stakeholder / Employer. Recalculates all scores for filtered channel
7. **Executive Summary** — auto-generated narrative analysis with channel-specific takeaways
8. **Dimension Score Gauges** — horizontal diverging bars per dimension
9. **Distribution Bars** — raw count stacked bars (unweighted)
10. **Collapsible Entry Logs** — source names clickable where URLs are available

---

## Config File Format

Each config exports a default object:

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
  gradientId: "mskuhc",         // Unique SVG gradient prefix

  // Dates
  monitorStart: "May 1, 2025",
  monitorEnd: "July 31, 2025",
  disputePublicDate: "2025-06-19",
  disputeStatus: "resolved",    // "active" or "resolved"

  // Colors
  colors: { providerColor, payorColor, neutral, accent, bg, surface, surfaceHover, border, text, textMuted },
  distColors: ["#1B4D8E", "#5D7380", "#8B2332"],
  yAxisWidth: 78,

  // Data arrays
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

  // Talking points (for message discipline analysis)
  talkingPoints: {
    provider: [{ name: "Patient access", keywords: ["access", "patient"] }],
    payor: [{ name: "Cost control", keywords: ["cost", "affordable"] }],
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

5 dimensions with configurable weights:
- `reach` — Reach / Amplification
- `sophistication` — Narrative Sophistication
- `callToAction` — Call to Action
- `independence` — Source Independence
- `stakeholder` — Stakeholder Mobilization

Default weights in `WarRoomDashboard.jsx` (`DEFAULT_DIMENSION_WEIGHTS`, `DEFAULT_SOURCE_TYPE_WEIGHTS`).
3 trend modes: exponential decay (default), cumulative, rolling window.
`computeScores()` and `computeTrend()` exported from `WarRoomDashboard.jsx` (used by Homepage).

### Source Credibility Weighting (8 tiers)

| Tier | Weight | Category | Examples |
|---|---|---|---|
| **1** | **1.5x** | National record | NBC News, CNN, KFF Health News, Bloomberg |
| **2** | **1.2x** | Regional authority | CBS local TV, Crain's, Detroit News, local affiliates |
| **3** | **1.0x** | Trade/niche | Becker's, Healthcare Dive, Fierce Healthcare |
| **4** | **0.7x** | Organic social | Reddit, TikTok, Facebook groups |
| **5** | **0.4x** | Comment sections | News article comments |
| **6** | **0.3x** | Owned/party media | Hospital websites, insurer FAQs, press releases |
| **7** | **1.3x** | Stakeholder actions | Union contracts, regulator actions |
| **8** | **1.5-1.8x** | Employer/Benefits | Benefits brokers, employer HR communications |

---

## Design System (Jarrard Inc. palette)
- **Navy**: `#053b57` (primary text)
- **Orange**: `#f5841f` (accent, active indicators, CTA)
- **Medium blue**: `#2593d0` (neutral scores, links)
- **Light blue**: `#93c4e3` (muted headers, labels)
- **Green**: `#45bb89` (positive/agreement indicators)
- **Yellow**: `#FEB925` (employer channel)
- **Gray text**: `#5D7380` (secondary text)
- **Surfaces**: `#f7fafc` (page bg), `#f2f7fb` (cards), `#e8f0f7` (hover)
- **Borders**: `#c8dce8` (primary), `#D7E8F7` (light)

## Dispute Status
- `disputeStatus: "active"` — 4 disputes: bcbsm, memorial-hermann-bcbstx, mtsinai, scripps-anthem
- `disputeStatus: "resolved"` — 22 disputes (have agreement timeline events)

## Nav Bar Layout
- **Homepage header**: Jarrard × Chartis wordmark logos above title
- **Homepage nav**: `TRACKER HOME` (left) | spacer | `METHODS` | `LOGOUT` (right)
- **Dispute view**: `TRACKER HOME` (left, clickable) | `<select>` | `CONFIG` | `METHODS` | spacer | `LOGOUT` (right)
- **Dispute dashboard**: Provider vs payor logos in header; `EXPORT PDF` button on tab bar
- **Dispute rows (homepage)**: Paired provider + payor logos next to dispute name
- **PDF report**: Provider vs payor logos in cover header

---

## All 26 Disputes

| Config | Provider | Payor | Entries | Status |
|--------|----------|-------|---------|--------|
| bcbsm | Michigan Medicine | BCBSM | 84 | Active |
| mtsinai | Mt Sinai | Anthem BCBS | 100 | Active |
| memorial-hermann-bcbstx | Memorial Hermann | BCBS TX | 75 | Active |
| scripps-anthem | Scripps Health | Anthem Blue Cross | 60 | Active |
| msk-uhc | MSK | UnitedHealthcare | 50 | Resolved |
| dignity-aetna | Dignity Health | Aetna | 71 | Resolved |
| bsw-bcbstx | Baylor Scott & White | BCBS TX | 75 | Resolved |
| hartford-uhc | Hartford HealthCare | UHC | 48 | Resolved |
| huntsville-uhc | Huntsville Hospital | UHC | 51 | Resolved |
| jefferson-cigna | Jefferson Health | Cigna | 48 | Resolved |
| duke-aetna | Duke Health | Aetna | 77 | Resolved |
| unc-cigna | UNC Health | Cigna | 69 | Resolved |
| providence-aetna | Providence | Aetna | 68 | Resolved |
| uw-aetna | UW Medicine | Aetna | 55 | Resolved |
| ahn-cigna | Allegheny Health Network | Cigna | 62 | Resolved |
| dignity-bcbsaz | Dignity Health | BCBS Arizona | 78 | Resolved |
| providence-cigna | Providence | Cigna | 41 | Resolved |
| bon-secours-sc-cigna | Bon Secours St. Francis | Cigna | 60 | Resolved |
| spartanburg-cigna | Spartanburg Regional | Cigna | 56 | Resolved |
| main-line-cigna | Main Line Health | Cigna | 60 | Resolved |
| bon-secours-va-cigna | Bon Secours | Cigna | 60 | Resolved |
| tenet-cigna | Tenet/Baptist | Cigna | 65 | Resolved |
| piedmont-cigna | Piedmont Medical Center | Cigna | 50 | Resolved |
| mu-anthem | MU Health | Anthem | 88 | Resolved |
| northern-light-anthem | Northern Light | Anthem | 95 | Resolved |
| osu-anthem | OSU Health | Anthem | 60 | Resolved |

---

## How to Add a New Dispute

1. Create `src/configs/your-dispute.js` following the format above
2. The app auto-discovers it via `import.meta.glob` — no other files need changes
3. Push to main — Vercel deploys automatically

## Conventions
- Always push changes after committing
- Keep all styling inline (no CSS files)
- Config files are the single source of truth for dispute data
- Each config per-dispute color scheme lives in `config.colors`
