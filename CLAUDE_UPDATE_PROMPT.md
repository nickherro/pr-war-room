# PR War Room — Daily Update Prompt

You are updating the PR War Room dashboard with the latest coverage data for **active** healthcare contract disputes. The dashboard is a React app deployed on Vercel.

## Your Task

1. **Identify active disputes** — only update configs where `active: true`:
   - Read each file in `src/configs/` and check the `active` field
   - Skip any config where `active: false`

2. **For each active dispute, research today's coverage**:
   - Search for new news articles, TV coverage, social media posts, stakeholder actions, and employer reactions published since the last entry date in the config
   - Use web search to find coverage from the past 24-48 hours
   - Check: Google News, Becker's Hospital Review, local TV station sites, Reddit, X/Twitter, state regulator sites

3. **Add new entries** to the `ENTRIES` array in each active config file:
   - Follow the exact entry format below
   - Assign sequential IDs continuing from the last entry
   - Include URLs where available
   - Code each entry accurately for frameAdoption, sentiment, blameDirection, patientStory, reachEstimate

4. **Update other sections if warranted**:
   - `searchTrends` — add new weekly data points if a new week has passed
   - `timeline` — add new events (extensions, regulatory actions, resolution)
   - `executiveSummary` — update if the narrative has shifted meaningfully
   - `arguments` — add new phases if either side has introduced new arguments
   - `channelTakeaways` — update if channel dynamics have changed

5. **If a dispute resolves**:
   - Change `active: true` to `active: false`
   - Update the `subtitle` to reflect resolution date
   - Add the resolution event to `timeline`
   - Update `executiveSummary` with final analysis

6. **Commit and push** all changes in a single commit

## Entry Format

```js
{
  id: 85,                                    // Sequential, continuing from last entry
  date: "2026-03-27",                        // YYYY-MM-DD format
  source: "Detroit Free Press",              // Exact outlet name
  url: "https://...",                        // Full URL (optional but preferred)
  sourceType: "news",                        // news, tv, radio, owned, social, opinion
  channel: "media",                          // media, social, stakeholder, employer
  headline: "Descriptive headline...",       // What the coverage says
  frameAdoption: "mm",                       // providerKey, payorKey, or "balanced"
  sentiment: "negative_bcbs",               // negative_{key}, positive_{key}, or "neutral"
  patientStory: false,                       // true if entry features a patient narrative
  blameDirection: "bcbs",                    // providerKey, payorKey, or "both"
  reachEstimate: "medium",                   // high, medium, low
  notes: "Analyst notes on significance...", // Brief context
}
```

## Channel Definitions

| Channel | What belongs here |
|---------|------------------|
| **media** | News articles, TV segments, radio, opinion columns, trade press |
| **social** | Reddit posts, tweets/X posts, TikTok, Facebook, patient forums |
| **stakeholder** | Regulator actions, political statements, union actions, advocacy groups |
| **employer** | Benefits broker communications, employer HR notices, benefits consultant analysis |

## Source Type Definitions

| sourceType | Examples |
|-----------|----------|
| **news** | Newspapers, wire services, digital news (NYT, AP, Becker's, local papers) |
| **tv** | TV stations and their websites (CBS, NBC, ABC, Fox affiliates) |
| **radio** | Radio stations, NPR affiliates |
| **owned** | Hospital press releases, insurer FAQs, party social media accounts |
| **social** | Reddit, X/Twitter, TikTok, Facebook groups, patient forums |
| **opinion** | Op-eds, editorials, columns, blog posts |

## Coding Rules

- **frameAdoption**: Whose narrative does the coverage echo? Use the config's `providerKey` if the coverage adopts the provider's framing, `payorKey` if it adopts the insurer's framing, `"balanced"` if both sides are presented equally.
- **sentiment**: What emotional tone does the coverage carry? `negative_{payorKey}` if the coverage is critical of the insurer, `negative_{providerKey}` if critical of the provider, `"neutral"` if matter-of-fact.
- **blameDirection**: Who is positioned as the obstacle to resolution? Use the config's `providerKey`, `payorKey`, or `"both"`.
- **patientStory**: `true` only if the entry features a named patient or specific patient narrative (not generic "patients may be affected" language).
- **reachEstimate**: `"high"` for national outlets or viral content, `"medium"` for regional/local outlets, `"low"` for niche or low-traffic sources.

## Important Rules

- Do NOT fabricate entries. Every entry must correspond to real, verifiable coverage.
- Do NOT extend research beyond the current date.
- Do NOT modify resolved disputes (active: false).
- Do NOT change the scoring logic, component code, or UI.
- Always include the source URL when available.
- Use the exact `providerKey` and `payorKey` values from each config for coding fields.
- Keep notes brief and analytical — what makes this entry significant?

## After Updates

```bash
# Build to verify no syntax errors
npx vite build

# Commit all changes
git add src/configs/*.js
git commit -m "Daily update: [date] — [N] new entries across [M] active disputes"

# Push to trigger Vercel deploy
git push
```
