# Market Sentiment Tracker (PR War Room)

## Quick Start
```bash
npm run dev     # Vite dev server
npm run build   # Production build
```
Deployed on Vercel. SPA rewrite configured in `vercel.json`.

## Stack
- **Vite 5 + React 18** — no TypeScript, no react-router
- **Recharts** for all charts (LineChart, BarChart, ResponsiveContainer)
- **Browser History API** for routing (pushState/popstate in App.jsx)
- **SHA-256 auth gate** in main.jsx (password hash check)
- **localStorage** for scoring weight override persistence

## Architecture

### Routing
- No react-router. `App.jsx` reads `window.location.pathname` to determine active dispute.
- `null` = homepage, string (e.g. `"bcbsm"`) = dispute dashboard view.
- `navigate()` uses `history.pushState`. `popstate` listener handles back/forward.
- `vercel.json` has SPA rewrite so all paths serve `index.html`.

### Config Auto-Discovery
- `import.meta.glob("./configs/*.js", { eager: true })` loads all 26 dispute configs.
- Config filename (without `.js`) becomes the route path and dashboard ID.
- Each config exports: `title`, `providerShort`, `payorShort`, `providerKey`, `payorKey`, `colors`, `sourceWeights`, `entries[]`, `timeline[]`, `talkingPoints`, `disputeStatus`, `disputePublicDate`, `navShort`.

### Scoring Model
- 5 dimensions: `reach`, `sophistication`, `callToAction`, `independence`, `stakeholder`
- Default weights in `WarRoomDashboard.jsx` (`DEFAULT_DIMENSION_WEIGHTS`, `DEFAULT_SOURCE_TYPE_WEIGHTS`)
- 3 trend modes: exponential decay (default), cumulative, rolling window
- `computeScores()` and `computeTrend()` exported from `WarRoomDashboard.jsx` (used by Homepage)

### Key Components
| File | Purpose |
|------|---------|
| `src/main.jsx` | Auth gate, renders App |
| `src/App.jsx` | Router, nav bar, scoring overrides state |
| `src/Homepage.jsx` | Dispute inventory with scores, sparklines, status badges |
| `src/WarRoomDashboard.jsx` | Main dashboard: 3 tabs (Dashboard, Media Summary, Coverage Analysis) |
| `src/DeepAnalysis.jsx` | Coverage Analysis tab: weekly favorability chart, message discipline, top sources |
| `src/ScoringSettings.jsx` | Scoring weight configuration panel |
| `src/configs/*.js` | 26 dispute config files |

### Design System (Jarrard Inc. palette)
- **Navy**: `#053b57` (primary text)
- **Orange**: `#f5841f` (accent, active indicators, CTA)
- **Medium blue**: `#2593d0` (neutral scores, links)
- **Light blue**: `#93c4e3` (muted headers, labels)
- **Green**: `#45bb89` (positive/agreement indicators)
- **Yellow**: `#FEB925` (employer channel)
- **Gray text**: `#5D7380` (secondary text)
- **Surfaces**: `#f7fafc` (page bg), `#f2f7fb` (cards), `#e8f0f7` (hover)
- **Borders**: `#c8dce8` (primary), `#D7E8F7` (light)
- **Fonts**: `'JetBrains Mono'` (mono/data), `'Source Serif 4'` (serif/editorial)

### Dispute Status
- `disputeStatus: "active"` — 4 disputes: bcbsm, memorial-hermann-bcbstx, mtsinai, scripps-anthem
- `disputeStatus: "resolved"` — 22 disputes (have agreement timeline events)

## Nav Bar Layout
- **Homepage**: `TRACKER HOME` (left) | spacer | `LOGOUT` (right)
- **Dispute view**: `TRACKER HOME` (left, clickable) | `<select>` | `CONFIG` | spacer | `LOGOUT` (right)

## Conventions
- Always push changes after committing
- Keep all styling inline (no CSS files)
- Config files are the single source of truth for dispute data
- Each config per-dispute color scheme lives in `config.colors` (providerColor, payorColor, etc.)
