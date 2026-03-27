const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Source Serif 4', Georgia, serif";

const S = {
  page: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "32px 20px 60px",
  },
  h1: {
    fontSize: 22,
    fontFamily: SERIF,
    fontWeight: 600,
    color: "#053b57",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: SERIF,
    color: "#5D7380",
    marginBottom: 32,
  },
  h2: {
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: MONO,
    fontWeight: 700,
    color: "#93c4e3",
    marginTop: 36,
    marginBottom: 12,
  },
  h3: {
    fontSize: 15,
    fontFamily: SERIF,
    fontWeight: 600,
    color: "#053b57",
    marginTop: 20,
    marginBottom: 6,
  },
  p: {
    fontSize: 14,
    fontFamily: SERIF,
    color: "#053b57",
    lineHeight: 1.65,
    marginBottom: 12,
  },
  muted: {
    fontSize: 13,
    fontFamily: SERIF,
    color: "#5D7380",
    lineHeight: 1.6,
    marginBottom: 12,
  },
  card: {
    background: "#f2f7fb",
    border: "1px solid #c8dce8",
    borderRadius: 8,
    padding: "16px 20px",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: SERIF,
    fontWeight: 700,
    color: "#053b57",
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 13,
    fontFamily: SERIF,
    color: "#5D7380",
    lineHeight: 1.6,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 16,
    fontSize: 12,
    fontFamily: MONO,
  },
  th: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "2px solid #c8dce8",
    color: "#5D7380",
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  td: {
    padding: "6px 10px",
    borderBottom: "1px solid #D7E8F7",
    color: "#053b57",
    fontSize: 12,
  },
  formula: {
    background: "#f2f7fb",
    border: "1px solid #c8dce8",
    borderRadius: 6,
    padding: "12px 16px",
    fontFamily: MONO,
    fontSize: 12,
    color: "#053b57",
    marginBottom: 16,
    overflowX: "auto",
    lineHeight: 1.8,
  },
  badge: (color) => ({
    display: "inline-block",
    fontFamily: MONO,
    fontSize: 10,
    fontWeight: 700,
    color,
    background: `${color}18`,
    borderRadius: 3,
    padding: "1px 6px",
    marginRight: 4,
  }),
};

export default function Methodologies() {
  return (
    <div style={S.page}>
      <div style={S.h1}>Methodology & Scoring Framework</div>
      <div style={S.subtitle}>
        How the Market Sentiment Tracker evaluates narrative advantage in healthcare contract disputes
      </div>

      {/* ── DATA AGGREGATION ── */}
      <div style={S.h2}>DATA AGGREGATION STRATEGY</div>

      <div style={S.p}>
        Each dispute is tracked through a structured media monitoring process that produces a coded dataset of 40–100 entries per dispute. Entries span the full lifecycle from the initial public disclosure through resolution or ongoing negotiation.
      </div>

      <div style={S.h3}>Source Universe</div>
      <div style={S.p}>
        Coverage is aggregated across four channels, each capturing a distinct vector of public influence:
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Media</div>
        <div style={S.cardBody}>
          National and regional news outlets, local TV affiliates, trade/healthcare publications, opinion columns. Sourced via broadcast monitoring, news aggregators, and direct outlet tracking. Includes TV (CBS, NBC, ABC, Fox affiliates), print/digital (CNN, Bloomberg, NYT, local papers), and trade press (Becker's, Healthcare Dive, Fierce Healthcare, KFF Health News).
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Social</div>
        <div style={S.cardBody}>
          Organic patient and community discourse on Reddit, X/Twitter, TikTok, Facebook groups, and news article comment sections. Captures grassroots sentiment that may diverge from editorial coverage. Each entry represents a distinct narrative thread or viral moment, not individual posts.
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Stakeholder</div>
        <div style={S.cardBody}>
          Actions and statements from institutional actors: elected officials, state regulators (DOI, DFS, DIFS), unions, medical societies, parallel health systems, and advocacy organizations. These entries carry outsized weight because they represent organized institutional pressure.
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Employer</div>
        <div style={S.cardBody}>
          Benefits brokers, employer HR communications, benefits consultant analyses, and employer-facing trade coverage. This channel captures the financial pressure vector — employers are the ultimate customers in most commercial insurance relationships.
        </div>
      </div>

      <div style={S.h3}>Entry Coding</div>
      <div style={S.p}>
        Every entry is coded along six dimensions by a human analyst:
      </div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>FIELD</th>
            <th style={S.th}>VALUES</th>
            <th style={S.th}>MEANING</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...S.td, fontWeight: 600 }}>frameAdoption</td>
            <td style={S.td}>provider / payor / balanced</td>
            <td style={{ ...S.td, fontFamily: SERIF }}>Whose narrative framing does the coverage adopt?</td>
          </tr>
          <tr>
            <td style={{ ...S.td, fontWeight: 600 }}>sentiment</td>
            <td style={S.td}>negative_[side] / positive_[side] / neutral</td>
            <td style={{ ...S.td, fontFamily: SERIF }}>Emotional tone — who does the piece cast negatively?</td>
          </tr>
          <tr>
            <td style={{ ...S.td, fontWeight: 600 }}>blameDirection</td>
            <td style={S.td}>provider / payor / both</td>
            <td style={{ ...S.td, fontFamily: SERIF }}>Who is positioned as the obstacle to resolution?</td>
          </tr>
          <tr>
            <td style={{ ...S.td, fontWeight: 600 }}>patientStory</td>
            <td style={S.td}>true / false</td>
            <td style={{ ...S.td, fontFamily: SERIF }}>Does the entry feature a named patient narrative?</td>
          </tr>
          <tr>
            <td style={{ ...S.td, fontWeight: 600 }}>reachEstimate</td>
            <td style={S.td}>high / medium / low</td>
            <td style={{ ...S.td, fontFamily: SERIF }}>Estimated audience reach of the source</td>
          </tr>
          <tr>
            <td style={{ ...S.td, fontWeight: 600 }}>sourceType</td>
            <td style={S.td}>tv / news / radio / social / owned / opinion</td>
            <td style={{ ...S.td, fontFamily: SERIF }}>Category of the source for credibility weighting</td>
          </tr>
        </tbody>
      </table>

      {/* ── ENTRY FAVORABILITY ── */}
      <div style={S.h2}>ENTRY FAVORABILITY</div>

      <div style={S.p}>
        Each coded entry is converted to a favorability score from <strong>-1.0</strong> (fully payor-favorable) to <strong>+1.0</strong> (fully provider-favorable) by averaging three coded signals:
      </div>

      <div style={S.formula}>
        favorability = (frame_signal + sentiment_signal + blame_signal) / 3
        <br /><br />
        frame_signal&nbsp;&nbsp; = +1 if provider frame, -1 if payor frame, 0 if balanced
        <br />
        sentiment_signal = +1 if negative toward payor or positive toward provider, -1 if reverse, 0 if neutral
        <br />
        blame_signal&nbsp; = +1 if blame on payor, -1 if blame on provider, 0 if both
      </div>

      <div style={S.muted}>
        An entry where the coverage adopts the provider's framing, expresses negative sentiment toward the payor, and positions the payor as the obstacle scores +1.0 — maximum provider advantage. Balanced or mixed coverage scores near zero.
      </div>

      {/* ── SOURCE CREDIBILITY ── */}
      <div style={S.h2}>SOURCE CREDIBILITY WEIGHTING</div>

      <div style={S.p}>
        Not all coverage carries equal influence. Each source is assigned a credibility weight that multiplies its impact on the composite score. Weights are configured per-dispute to reflect the specific media landscape.
      </div>

      <div style={S.h3}>Source Type Defaults</div>
      <div style={S.muted}>
        When a specific source isn't mapped in the dispute config, its sourceType determines the base weight:
      </div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>TYPE</th>
            <th style={S.th}>DEFAULT WEIGHT</th>
            <th style={S.th}>RATIONALE</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["tv", "1.2×", "Broadcast reaches broad audiences, high trust factor"],
            ["radio", "1.2×", "Similar reach dynamics to TV in local markets"],
            ["news", "1.0×", "Baseline — professional journalism, editorial standards"],
            ["opinion", "0.8×", "Discounted slightly — audience recognizes editorial stance"],
            ["social", "0.7×", "Organic but lower trust, harder to verify reach"],
            ["owned", "0.3×", "Party-produced content — high bias expected, low persuasive impact on third parties"],
            ["other", "1.0×", "Default baseline for uncategorized sources"],
          ].map(([type, w, r]) => (
            <tr key={type}>
              <td style={{ ...S.td, fontWeight: 600 }}>{type}</td>
              <td style={S.td}>{w}</td>
              <td style={{ ...S.td, fontFamily: SERIF }}>{r}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={S.h3}>Per-Source Credibility Tiers</div>
      <div style={S.p}>
        Within each dispute, individual sources are assigned to credibility tiers that override the source type default. This captures the difference between, for example, a CNN national wire story (1.5×) and a community newspaper (1.0×) — both are "news" but carry different weight.
      </div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>TIER</th>
            <th style={S.th}>WEIGHT</th>
            <th style={S.th}>CATEGORY</th>
            <th style={S.th}>EXAMPLES</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["1", "1.5×", "National record", "NBC News, CNN, Bloomberg, KFF Health News"],
            ["2", "1.2×", "Regional authority", "CBS/NBC/ABC local affiliates, Crain's, Detroit News"],
            ["3", "1.0×", "Trade / niche", "Becker's, Healthcare Dive, Fierce Healthcare, community papers"],
            ["4", "0.7×", "Organic social", "Reddit, TikTok, Facebook groups, patient communities"],
            ["5", "0.4×", "Comment sections", "News article comments, forum threads"],
            ["6", "0.3×", "Owned / party media", "Hospital websites, insurer FAQs, press releases, party social accounts"],
            ["7", "1.3×", "Stakeholder actions", "Union contracts, regulator filings, executive statements"],
            ["8", "1.5–1.8×", "Employer / benefits", "Benefits brokers, employer HR communications, consultant analyses"],
          ].map(([tier, w, cat, ex]) => (
            <tr key={tier}>
              <td style={{ ...S.td, fontWeight: 600, textAlign: "center" }}>{tier}</td>
              <td style={{ ...S.td, fontWeight: 600 }}>{w}</td>
              <td style={S.td}>{cat}</td>
              <td style={{ ...S.td, fontFamily: SERIF, fontSize: 11 }}>{ex}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={S.muted}>
        The weight hierarchy is: per-source override (from CONFIG panel) → dispute config sourceWeights → source type default. Users can adjust all three layers through the CONFIG panel.
      </div>

      {/* ── FIVE DIMENSIONS ── */}
      <div style={S.h2}>COMPOSITE SCORE: FIVE DIMENSIONS</div>

      <div style={S.p}>
        The composite narrative advantage score ranges from <strong>-100</strong> (payor winning decisively) to <strong>+100</strong> (provider winning decisively). It is the weighted sum of five dimension scores, each of which captures a distinct facet of narrative advantage.
      </div>

      <div style={S.formula}>
        composite = reach × 0.25 + sophistication × 0.20 + callToAction × 0.20 + independence × 0.15 + stakeholder × 0.20
      </div>

      <div style={S.muted}>
        Dimension weights are configurable via the CONFIG panel and must sum to 1.00.
      </div>

      {/* Dimension 1 */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={S.cardTitle}>1. Reach / Amplification</div>
          <span style={S.badge("#2593d0")}>25%</span>
        </div>
        <div style={S.cardBody}>
          <strong>Question:</strong> Which side's narrative is reaching more people through higher-credibility channels?
          <br /><br />
          Each entry's favorability is weighted by its source credibility weight <em>and</em> a reach multiplier based on <code>reachEstimate</code>: high = 3×, medium = 2×, low = 1×. The dimension score is the weighted average of all entry favorabilities.
          <br /><br />
          <strong>What drives this score:</strong> National broadcast coverage (NBC Nightly News, CNN wire) with clear provider or payor framing. A single high-reach, high-credibility entry can outweigh many low-reach entries.
        </div>
      </div>

      {/* Dimension 2 */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={S.cardTitle}>2. Narrative Sophistication</div>
          <span style={S.badge("#2593d0")}>20%</span>
        </div>
        <div style={S.cardBody}>
          <strong>Question:</strong> Which side benefits from more analytically rigorous, independent coverage?
          <br /><br />
          Weights each entry by source credibility × source independence score × a balance bonus. Independent sources (news, TV, radio = 1.0) are weighted more heavily than party-aligned sources (owned = 0.1, social = 0.4). Balanced framing receives a 1.5× bonus — the logic being that when independent analysts adopt balanced framing, the underlying direction of their coverage is more persuasive.
          <br /><br />
          <strong>Source independence scores:</strong> news/tv/radio = 1.0, opinion = 0.6, social = 0.4, owned = 0.1, other = 0.5
          <br /><br />
          <strong>What drives this score:</strong> Favorable coverage from trade press and serious journalists. Party media (press releases, owned social) is nearly eliminated from this dimension.
        </div>
      </div>

      {/* Dimension 3 */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={S.cardTitle}>3. Call to Action</div>
          <span style={S.badge("#2593d0")}>20%</span>
        </div>
        <div style={S.cardBody}>
          <strong>Question:</strong> Which side is generating actionable public pressure — patient stories, mobilization campaigns, stakeholder demands?
          <br /><br />
          Applies bonus multipliers to entries with mobilization characteristics:
          <br />
          • Patient story present: +1.5× bonus
          <br />
          • Owned/party media (active mobilization): +1.0× bonus
          <br />
          • Stakeholder or employer entry with clear blame direction: +0.5× bonus
          <br /><br />
          <strong>What drives this score:</strong> Named patient narratives are the single most powerful driver. A cancer patient mid-treatment who can't access their specialist is maximally persuasive content. Owned media campaigns (hospital microsites, insurer FAQ pages) also boost this score by showing active mobilization effort.
        </div>
      </div>

      {/* Dimension 4 */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={S.cardTitle}>4. Source Independence</div>
          <span style={S.badge("#2593d0")}>15%</span>
        </div>
        <div style={S.cardBody}>
          <strong>Question:</strong> When only independent, third-party sources are considered, which side is winning?
          <br /><br />
          Filters to entries with source independence ≥ 0.6 (news, TV, radio, opinion) and computes the credibility-weighted average favorability. Social media, owned content, and party-produced material are excluded entirely.
          <br /><br />
          <strong>What drives this score:</strong> The direction of independent journalism. If reporters and editors — without prompting from either side — are framing the dispute in one party's favor, that's a strong signal of genuine narrative advantage.
        </div>
      </div>

      {/* Dimension 5 */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={S.cardTitle}>5. Stakeholder Mobilization</div>
          <span style={S.badge("#2593d0")}>20%</span>
        </div>
        <div style={S.cardBody}>
          <strong>Question:</strong> Are institutional actors (regulators, politicians, employers, unions) aligning with one side?
          <br /><br />
          Considers only stakeholder and employer channel entries. Computes the credibility-weighted average favorability. Returns 0 if fewer than 2 stakeholder/employer entries exist (insufficient signal).
          <br /><br />
          <strong>What drives this score:</strong> Regulatory inquiries, state attorney general statements, union endorsements, employer benefits decisions. A state insurance commissioner opening an investigation into the insurer is a high-impact event. Employer groups threatening to switch carriers is the financial pressure point that often forces resolution.
        </div>
      </div>

      {/* ── TREND MODES ── */}
      <div style={S.h2}>NARRATIVE MOMENTUM: TREND MODES</div>

      <div style={S.p}>
        The trendline shows how the composite score evolves over the dispute lifecycle. Three computation modes are available, each answering a different analytical question:
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Exponential Decay (Default)</div>
        <div style={S.cardBody}>
          <strong>Question:</strong> What is the <em>current</em> narrative advantage, accounting for recency?
          <br /><br />
          At each date, all prior entries are included but weighted by an exponential decay function with a <strong>30-day half-life</strong>. An entry from 30 days ago carries half the weight of today's entry; 60 days ago, one quarter.
          <br /><br />
          <div style={{ ...S.formula, margin: "8px 0" }}>
            decay_weight = e^(-λ × age_in_days)&nbsp;&nbsp;&nbsp;where λ = ln(2) / 30
          </div>
          This mode is the default because it best reflects the reality of public narratives: recent coverage matters more than old coverage, but the past isn't irrelevant. A strong early campaign that isn't sustained will gradually fade.
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Cumulative</div>
        <div style={S.cardBody}>
          <strong>Question:</strong> What is the <em>overall</em> narrative advantage across the full dispute to date?
          <br /><br />
          At each date, all entries up to that point are scored with equal weight — no decay. This mode shows the running total picture and tends to be more stable, since early entries are never diminished. Useful for assessing the full body of coverage.
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Rolling Window</div>
        <div style={S.cardBody}>
          <strong>Question:</strong> What has the narrative looked like in the <em>recent window</em> only?
          <br /><br />
          At each date, only entries within the trailing window are scored. The window size is dynamically set to one quarter of the total dispute duration (minimum 7 days). Earlier entries are completely excluded — this mode is the most volatile but best at surfacing sudden shifts in narrative direction.
        </div>
      </div>

      {/* ── MESSAGE DISCIPLINE ── */}
      <div style={S.h2}>MESSAGE DISCIPLINE ANALYSIS</div>

      <div style={S.p}>
        The Coverage Analysis tab includes a message discipline assessment that measures how consistently each side stays on their core talking points.
      </div>
      <div style={S.p}>
        For each dispute, a set of talking points is defined per side — typically 4–8 named messaging themes with associated keyword patterns. The system scans all side-favorable entries against these patterns and reports:
      </div>
      <div style={{ ...S.card, padding: "12px 20px" }}>
        <div style={S.cardBody}>
          • <strong>Per-point hit rate:</strong> What percentage of that side's coverage echoes each specific talking point?
          <br />
          • <strong>On-message percentage:</strong> What share of the side's total coverage matches <em>any</em> defined talking point?
          <br />
          • <strong>Discipline rating:</strong> ≥70% = highly disciplined, ≥45% = moderately disciplined, {"<"}45% = scattered messaging
        </div>
      </div>

      {/* ── CONFIGURABLE ── */}
      <div style={S.h2}>USER-CONFIGURABLE PARAMETERS</div>

      <div style={S.p}>
        The CONFIG panel allows analysts to adjust scoring parameters without modifying source code:
      </div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>PARAMETER</th>
            <th style={S.th}>DEFAULT</th>
            <th style={S.th}>EFFECT</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Dimension weights", "Reach .25 / Soph .20 / CTA .20 / Indep .15 / Stake .20", "Changes the relative importance of each dimension in the composite"],
            ["Source type weights", "TV 1.2 / News 1.0 / Social 0.7 / Owned 0.3 / etc.", "Adjusts the baseline credibility for entire source categories"],
            ["Per-source overrides", "From dispute config", "Override the weight for any individual source (e.g., boost a specific local outlet)"],
          ].map(([param, def, effect], i) => (
            <tr key={i}>
              <td style={{ ...S.td, fontWeight: 600, fontFamily: SERIF }}>{param}</td>
              <td style={{ ...S.td, fontSize: 11 }}>{def}</td>
              <td style={{ ...S.td, fontFamily: SERIF }}>{effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={S.muted}>
        Overrides persist in localStorage and apply across all disputes. The CONFIG button turns orange when custom weights are active.
      </div>

      {/* ── LIMITATIONS ── */}
      <div style={S.h2}>LIMITATIONS & CAVEATS</div>

      <div style={S.card}>
        <div style={S.cardBody}>
          <strong>Human-coded inputs.</strong> All entry coding (frame adoption, sentiment, blame direction) is performed by a human analyst. The model is only as good as the coding consistency. Ambiguous entries are coded as balanced/neutral/both.
          <br /><br />
          <strong>Coverage ≠ influence.</strong> The tracker measures the <em>observable media landscape</em>, not actual influence on decision-makers. Behind-the-scenes lobbying, private negotiations, and regulatory conversations are not captured.
          <br /><br />
          <strong>Social media gaps.</strong> Social monitoring is not exhaustive. Organic patient sentiment on platforms like TikTok and Reddit is captured when it reaches enough visibility to be identified, but lower-engagement posts may be missed.
          <br /><br />
          <strong>Source weight subjectivity.</strong> Credibility tiers involve editorial judgment. A source's actual influence in a specific market may differ from its assigned tier.
          <br /><br />
          <strong>No causal claims.</strong> The composite score measures narrative positioning, not outcomes. A high score does not guarantee favorable contract terms — it indicates one side is winning the public argument.
        </div>
      </div>
    </div>
  );
}
