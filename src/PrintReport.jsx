import { useMemo } from "react";
import { computeScores, computeTrend, DEFAULT_DIMENSION_WEIGHTS, DEFAULT_SOURCE_TYPE_WEIGHTS } from "./WarRoomDashboard.jsx";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Source Serif 4', Georgia, serif";

function getWeight(entry, sourceWeights, sourceTypeWeights) {
  return sourceWeights[entry.source] ?? sourceTypeWeights[entry.sourceType] ?? 1.0;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ScoreBar({ value, label, config }) {
  const clamped = Math.max(-100, Math.min(100, value));
  const pct = ((clamped + 100) / 200) * 100;
  const color = clamped > 15 ? config.colors.providerColor : clamped < -15 ? config.colors.payorColor : "#2593d0";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: MONO, marginBottom: 2 }}>
        <span style={{ color: "#053b57", fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{clamped > 0 ? "+" : ""}{clamped.toFixed(0)}</span>
      </div>
      <div style={{ height: 6, background: "#D7E8F7", borderRadius: 3, position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#93c4e3" }} />
        <div style={{
          position: "absolute",
          left: clamped >= 0 ? "50%" : `${pct}%`,
          width: `${Math.abs(clamped) / 2}%`,
          top: 0, bottom: 0,
          background: color,
          borderRadius: 3,
        }} />
      </div>
    </div>
  );
}

function DistRow({ label, segments, config }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, fontFamily: MONO, color: "#5D7380", marginBottom: 2, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: "flex", height: 14, borderRadius: 3, overflow: "hidden", gap: 1 }}>
        {segments.map((seg, i) => seg.value > 0 ? (
          <div key={i} style={{
            width: `${(seg.value / total) * 100}%`,
            background: seg.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, color: "#fff", fontWeight: 700, fontFamily: MONO,
            minWidth: seg.value > 0 ? 20 : 0,
          }}>
            {seg.value} {seg.label}
          </div>
        ) : null)}
      </div>
    </div>
  );
}

export default function PrintReport({ config, weightOverrides, onClose }) {
  const { providerName, payorName, providerShort, payorShort, colors, entries: allEntries, labels } = config;
  const stw = weightOverrides?.sourceTypeWeights || DEFAULT_SOURCE_TYPE_WEIGHTS;
  const mergedSW = weightOverrides?.sourceWeights ? { ...config.sourceWeights, ...weightOverrides.sourceWeights } : config.sourceWeights;
  const gw = (e) => getWeight(e, mergedSW, stw);

  const scores = useMemo(() => {
    const base = computeScores(allEntries, config, weightOverrides);
    const trend = computeTrend(allEntries, config, weightOverrides, "decay");
    if (trend.length === 0) return base;
    const last = trend[trend.length - 1];
    return { ...base, composite: last.composite, reachScore: last.reach, sophScore: last.soph, ctaScore: last.cta, indepScore: last.indep, stakeScore: last.stake };
  }, [allEntries, config, weightOverrides]);

  const momentum = useMemo(() => {
    const sorted = [...allEntries].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    if (mid < 3) return null;
    const early = computeScores(sorted.slice(0, mid), config, weightOverrides);
    const late = computeScores(sorted.slice(mid), config, weightOverrides);
    return { early: early.composite, late: late.composite, shift: late.composite - early.composite };
  }, [allEntries, config, weightOverrides]);

  const channelScores = useMemo(() => {
    const ch = {};
    ["media", "social", "stakeholder", "employer"].forEach((c) => {
      const ce = allEntries.filter((e) => e.channel === c);
      ch[c] = ce.length >= 2 ? computeScores(ce, config, weightOverrides) : null;
    });
    return ch;
  }, [allEntries, config, weightOverrides]);

  const topSources = useMemo(() => {
    const map = {};
    allEntries.forEach((e) => {
      if (!map[e.source]) map[e.source] = { count: 0, weight: 0, type: e.sourceType };
      map[e.source].count++;
      map[e.source].weight += gw(e);
    });
    return Object.entries(map).sort((a, b) => b[1].weight - a[1].weight).slice(0, 10);
  }, [allEntries, config]);

  const topEntries = useMemo(() => {
    return [...allEntries].sort((a, b) => gw(b) - gw(a)).slice(0, 8);
  }, [allEntries, config]);

  const compositeColor = scores.composite > 15 ? colors.providerColor : scores.composite < -15 ? colors.payorColor : "#2593d0";
  const fmtScore = (v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}`;
  const distColors = config.distColors || [colors.providerColor, "#5D7380", colors.payorColor];
  const now = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print controls — hidden in print */}
      <div className="no-print" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #c8dce8", padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onClose} style={{
          padding: "6px 14px", fontSize: 10, fontFamily: MONO, fontWeight: 700,
          letterSpacing: 1, borderRadius: 4, border: "1px solid #c8dce8",
          cursor: "pointer", background: "#fff", color: "#5D7380",
        }}>
          BACK TO DASHBOARD
        </button>
        <button onClick={handlePrint} style={{
          padding: "6px 14px", fontSize: 10, fontFamily: MONO, fontWeight: 700,
          letterSpacing: 1, borderRadius: 4, border: "1px solid #053b57",
          cursor: "pointer", background: "#053b57", color: "#fff",
        }}>
          EXPORT PDF
        </button>
        <span style={{ fontSize: 11, color: "#5D7380", fontFamily: MONO }}>
          Use "Save as PDF" in the print dialog
        </span>
      </div>

      {/* Report content */}
      <div id="print-report" style={{
        maxWidth: 800, margin: "0 auto", padding: "40px 32px",
        fontFamily: SERIF, color: "#053b57", lineHeight: 1.6,
      }}>
        {/* Cover header */}
        <div style={{ borderBottom: "3px solid #053b57", paddingBottom: 20, marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 6 }}>
            MARKET SENTIMENT TRACKER — CONFIDENTIAL
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#053b57", lineHeight: 1.2 }}>
            {config.title}
          </div>
          <div style={{ fontSize: 13, color: "#5D7380", marginTop: 4 }}>
            {config.subtitle}
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 11, fontFamily: MONO, color: "#5D7380" }}>
            <span>Report generated: {now}</span>
            <span>{allEntries.length} entries analyzed</span>
            <span>Monitoring: {config.monitorStart} — {config.monitorEnd || "Present"}</span>
          </div>
        </div>

        {/* Composite score card */}
        <div style={{
          border: "2px solid #053b57", borderRadius: 8, padding: "20px 24px", marginBottom: 24,
          background: "#f7fafc",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#5D7380", fontFamily: MONO, fontWeight: 700, marginBottom: 4 }}>
                COMPOSITE NARRATIVE ADVANTAGE
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: compositeColor, fontFamily: MONO, lineHeight: 1 }}>
                {scores.composite > 0 ? "+" : ""}{scores.composite.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: compositeColor, marginTop: 4 }}>
                {scores.composite > 15 ? `${providerName} holds narrative advantage` : scores.composite < -15 ? `${payorName} holds narrative advantage` : "Contested — no clear advantage"}
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 10, fontFamily: MONO, color: "#5D7380", lineHeight: 1.9 }}>
              <div>Reach (25%): <strong style={{ color: "#053b57" }}>{fmtScore(scores.reachScore)}</strong></div>
              <div>Sophistication (20%): <strong style={{ color: "#053b57" }}>{fmtScore(scores.sophScore)}</strong></div>
              <div>Call to Action (20%): <strong style={{ color: "#053b57" }}>{fmtScore(scores.ctaScore)}</strong></div>
              <div>Independence (15%): <strong style={{ color: "#053b57" }}>{fmtScore(scores.indepScore)}</strong></div>
              <div>Stakeholder (20%): <strong style={{ color: "#053b57" }}>{fmtScore(scores.stakeScore)}</strong></div>
            </div>
          </div>
        </div>

        {/* Executive narrative */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 8 }}>
            EXECUTIVE SUMMARY
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            <strong>{providerName}</strong> {scores.composite > 10 ? "holds" : scores.composite < -10 ? "trails in" : "is contesting"} the public narrative
            with a credibility-weighted composite of <strong>{fmtScore(scores.composite)}</strong>.
            {momentum && momentum.shift > 5 && <> Momentum is building for {providerShort} — recent coverage scores {fmtScore(momentum.late)} vs {fmtScore(momentum.early)} in earlier coverage, a shift of <strong>{fmtScore(momentum.shift)}</strong> points.</>}
            {momentum && momentum.shift < -5 && <> Momentum is shifting toward {payorShort} — recent coverage scores {fmtScore(momentum.late)} vs {fmtScore(momentum.early)} earlier, a shift of <strong>{fmtScore(momentum.shift)}</strong> points.</>}
            {momentum && Math.abs(momentum.shift) <= 5 && <> Momentum is holding steady with no significant shift between early and recent coverage.</>}
          </div>
          {config.executiveSummary?.statement && (
            <div style={{ fontSize: 13, color: "#5D7380", marginTop: 8, lineHeight: 1.6 }}>
              {config.executiveSummary.statement}
            </div>
          )}
        </div>

        {/* Channel breakdown */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
            CHANNEL BREAKDOWN
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: MONO }}>
            <thead>
              <tr>
                {["CHANNEL", "ENTRIES", "COMPOSITE", "VS. OVERALL"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "2px solid #c8dce8", color: "#5D7380", fontSize: 9, fontWeight: 700, letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["media", "social", "stakeholder", "employer"].map((ch) => {
                const cs = channelScores[ch];
                const count = allEntries.filter((e) => e.channel === ch).length;
                const label = ch.charAt(0).toUpperCase() + ch.slice(1);
                const diff = cs ? cs.composite - scores.composite : 0;
                return (
                  <tr key={ch}>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7E8F7", fontWeight: 600 }}>{label}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7E8F7" }}>{count}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7E8F7", fontWeight: 700, color: cs ? (cs.composite > 10 ? colors.providerColor : cs.composite < -10 ? colors.payorColor : "#2593d0") : "#93c4e3" }}>
                      {cs ? fmtScore(cs.composite) : "n/a"}
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #D7E8F7", color: Math.abs(diff) > 8 ? (diff > 0 ? colors.providerColor : colors.payorColor) : "#5D7380" }}>
                      {cs ? `${diff > 0 ? "+" : ""}${diff.toFixed(0)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dimension scores */}
        <div style={{ marginBottom: 24, pageBreakBefore: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
            DIMENSION SCORES
          </div>
          <ScoreBar value={scores.reachScore} label="Reach / Amplification (25%)" config={config} />
          <ScoreBar value={scores.sophScore} label="Narrative Sophistication (20%)" config={config} />
          <ScoreBar value={scores.ctaScore} label="Call to Action (20%)" config={config} />
          <ScoreBar value={scores.indepScore} label="Source Independence (15%)" config={config} />
          <ScoreBar value={scores.stakeScore} label="Stakeholder Mobilization (20%)" config={config} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: MONO, color: "#93c4e3", marginTop: 4 }}>
            <span>{payorShort} Winning ←</span>
            <span>→ {providerShort} Winning</span>
          </div>
        </div>

        {/* Distributions */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
            ENTRY DISTRIBUTIONS
          </div>
          <DistRow label="REACH / AMPLIFICATION" segments={[
            { value: allEntries.filter((e) => e.reachEstimate === "high").length, color: distColors[0], label: "High" },
            { value: allEntries.filter((e) => e.reachEstimate === "medium").length, color: "#5D7380", label: "Med" },
            { value: allEntries.filter((e) => e.reachEstimate === "low").length, color: distColors[2], label: "Low" },
          ]} config={config} />
          <DistRow label="FRAME ADOPTION" segments={[
            { value: scores.frameProvider, color: colors.providerColor, label: providerShort },
            { value: scores.frameBalanced, color: "#5D7380", label: "Bal" },
            { value: scores.framePayor, color: colors.payorColor, label: payorShort },
          ]} config={config} />
          <DistRow label="SENTIMENT" segments={[
            { value: scores.sentNegPayor, color: colors.providerColor, label: `Anti-${payorShort}` },
            { value: scores.sentNeutral, color: "#5D7380", label: "Neutral" },
            { value: scores.sentNegProvider, color: colors.payorColor, label: `Anti-${providerShort}` },
          ]} config={config} />
          <DistRow label="BLAME DIRECTION" segments={[
            { value: scores.blamePayor, color: colors.providerColor, label: payorShort },
            { value: scores.blameBoth, color: "#5D7380", label: "Both" },
            { value: scores.blameProvider, color: colors.payorColor, label: providerShort },
          ]} config={config} />
        </div>

        {/* Dispute Timeline */}
        {config.timeline && config.timeline.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
              DISPUTE TIMELINE
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <tbody>
                {[...config.timeline].sort((a, b) => a.date.localeCompare(b.date)).map((evt, i) => {
                  const typeColor = { newsBreak: "#f5841f", termination: "#DC2626", extension: "#2593d0", agreement: "#45bb89" }[evt.type] || "#5D7380";
                  return (
                    <tr key={i}>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #D7E8F7", fontFamily: MONO, fontSize: 10, color: "#5D7380", width: 90 }}>{formatDate(evt.date)}</td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #D7E8F7" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: typeColor, marginRight: 8, verticalAlign: "middle" }} />
                        <span style={{ fontSize: 12, color: "#053b57" }}>{evt.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Top sources */}
        <div style={{ marginBottom: 24, pageBreakBefore: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
            TOP SOURCES BY WEIGHTED INFLUENCE
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                {["SOURCE", "TYPE", "ENTRIES", "CUMUL. WEIGHT"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "2px solid #c8dce8", color: "#5D7380", fontSize: 9, fontFamily: MONO, fontWeight: 700, letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topSources.map(([source, info]) => (
                <tr key={source}>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #D7E8F7", fontWeight: 600 }}>{source}</td>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #D7E8F7", fontFamily: MONO, fontSize: 10, color: "#5D7380" }}>{info.type}</td>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #D7E8F7", fontFamily: MONO }}>{info.count}</td>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #D7E8F7", fontFamily: MONO, fontWeight: 600 }}>{info.weight.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highest-impact entries */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
            HIGHEST-IMPACT ENTRIES
          </div>
          {topEntries.map((e, i) => (
            <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #D7E8F7", fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600 }}>{e.headline.length > 90 ? e.headline.slice(0, 90) + "..." : e.headline}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#5D7380", flexShrink: 0, marginLeft: 8 }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 10, color: "#5D7380", fontFamily: MONO, marginTop: 2 }}>
                {e.source} · {labels.sourceType[e.sourceType]} · Weight: {gw(e).toFixed(1)} · Frame: {labels.frameAdoption[e.frameAdoption]} · {labels.reachEstimate[e.reachEstimate]} reach
                {e.patientStory && " · Patient story"}
              </div>
            </div>
          ))}
        </div>

        {/* Key messages from config */}
        {config.executiveSummary?.keyMessages && config.executiveSummary.keyMessages.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
              KEY MESSAGES RESONATING
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.8 }}>
              {config.executiveSummary.keyMessages.map((m, i) => (
                <li key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: m }} />
              ))}
            </ul>
          </div>
        )}

        {/* MarComm considerations */}
        {config.executiveSummary?.marcomm && config.executiveSummary.marcomm.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
              MARCOMM CONSIDERATIONS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.8 }}>
              {config.executiveSummary.marcomm.map((m, i) => (
                <li key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: m }} />
              ))}
            </ul>
          </div>
        )}

        {/* Arguments */}
        {config.arguments && (
          <div style={{ marginBottom: 24, pageBreakBefore: "auto" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
              ARGUMENTS BY PHASE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: colors.payorColor, marginBottom: 8, letterSpacing: 1 }}>{payorShort}</div>
                {config.arguments.payor.map((phase, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: colors.payorColor, fontWeight: 700, marginBottom: 2 }}>{phase.phase}</div>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, lineHeight: 1.6 }}>
                      {phase.points.map((pt, j) => <li key={j} style={{ marginBottom: 1 }} dangerouslySetInnerHTML={{ __html: pt }} />)}
                    </ul>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: colors.providerColor, marginBottom: 8, letterSpacing: 1 }}>{providerShort}</div>
                {config.arguments.provider.map((phase, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: colors.providerColor, fontWeight: 700, marginBottom: 2 }}>{phase.phase}</div>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, lineHeight: 1.6 }}>
                      {phase.points.map((pt, j) => <li key={j} style={{ marginBottom: 1 }} dangerouslySetInnerHTML={{ __html: pt }} />)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "2px solid #053b57", paddingTop: 12, marginTop: 32, display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: MONO, color: "#93c4e3" }}>
          <span>Market Sentiment Tracker · Confidential</span>
          <span>{config.title} · Generated {now}</span>
        </div>
      </div>
    </div>
  );
}
