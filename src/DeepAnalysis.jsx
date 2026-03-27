import { useMemo } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Source Serif 4', Georgia, serif";

// === NARRATIVE VELOCITY ===
// Measures coverage acceleration/deceleration over time using weekly entry counts

function NarrativeVelocity({ entries, config }) {
  const { colors, providerShort, payorShort, disputePublicDate } = config;

  const data = useMemo(() => {
    if (entries.length === 0) return [];
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);

    // Build weekly buckets
    const weeks = [];
    const cur = new Date(firstDate);
    cur.setDate(cur.getDate() - cur.getDay()); // align to Sunday
    while (cur <= lastDate) {
      const weekStart = new Date(cur);
      const weekEnd = new Date(cur);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({ start: weekStart, end: weekEnd, label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}` });
      cur.setDate(cur.getDate() + 7);
    }

    let prevCount = 0;
    return weeks.map((w) => {
      const weekEntries = sorted.filter((e) => {
        const d = new Date(e.date);
        return d >= w.start && d <= w.end;
      });
      const count = weekEntries.length;
      const provFav = weekEntries.filter((e) =>
        e.frameAdoption === config.providerKey || e.sentiment === `negative_${config.payorKey}` || e.blameDirection === config.payorKey
      ).length;
      const payFav = weekEntries.filter((e) =>
        e.frameAdoption === config.payorKey || e.sentiment === `negative_${config.providerKey}` || e.blameDirection === config.providerKey
      ).length;
      const acceleration = count - prevCount;
      prevCount = count;
      const dateStr = `${w.start.getFullYear()}-${String(w.start.getMonth() + 1).padStart(2, "0")}-${String(w.start.getDate()).padStart(2, "0")}`;
      return { date: dateStr, label: w.label, count, provFav, payFav, acceleration };
    });
  }, [entries, config]);

  if (data.length < 2) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const maxAccel = Math.max(...data.map((d) => Math.abs(d.acceleration)), 1);

  // Compute velocity status using second-half vs first-half average
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid);
  const secondHalf = data.slice(mid);
  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, d) => s + d.count, 0) / firstHalf.length : 0;
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, d) => s + d.count, 0) / secondHalf.length : 0;
  const recentAvg = secondAvg;
  const earlierAvg = firstAvg;
  const velocityRatio = earlierAvg > 0 ? recentAvg / earlierAvg : recentAvg > 0 ? 2 : 1;
  const velocityLabel = velocityRatio > 1.3 ? "ACCELERATING" : velocityRatio < 0.7 ? "DECELERATING" : "STEADY";
  const velocityColor = velocityRatio > 1.3 ? "#DC2626" : velocityRatio < 0.7 ? "#16A34A" : colors.accent;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
            NARRATIVE VELOCITY
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            Weekly coverage volume and acceleration — is the dispute gaining or losing attention?
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: velocityColor, fontFamily: MONO }}>{velocityLabel}</div>
          <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: MONO }}>
            Recent: {recentAvg.toFixed(1)}/wk vs Prior: {earlierAvg.toFixed(1)}/wk
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: MONO }} axisLine={{ stroke: colors.border }} tickLine={false} />
          <YAxis yAxisId="count" domain={[0, maxCount + 2]} tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} width={40} />
          <YAxis yAxisId="accel" orientation="right" domain={[-maxAccel - 1, maxAccel + 1]} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <div style={{ color: colors.textMuted }}>Week of {d.date}</div>
                  <div style={{ fontWeight: 700 }}>{d.count} entries ({d.provFav} {providerShort}-fav, {d.payFav} {payorShort}-fav)</div>
                  <div style={{ color: d.acceleration > 0 ? "#DC2626" : d.acceleration < 0 ? "#16A34A" : colors.textMuted }}>
                    Δ {d.acceleration > 0 ? "+" : ""}{d.acceleration} vs prior week
                  </div>
                </div>
              );
            }}
          />
          <ReferenceLine yAxisId="count" y={0} stroke={colors.textMuted} opacity={0.3} />
          <Bar yAxisId="count" dataKey="provFav" stackId="vol" fill={colors.providerColor} opacity={0.7} radius={[0, 0, 0, 0]} />
          <Bar yAxisId="count" dataKey="payFav" stackId="vol" fill={colors.payorColor} opacity={0.7} radius={[2, 2, 0, 0]} />
          <Line yAxisId="accel" type="monotone" dataKey="acceleration" stroke={colors.accent} strokeWidth={2} dot={{ r: 3, fill: colors.bg, stroke: colors.accent, strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6, fontSize: 10, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.providerColor, opacity: 0.7, borderRadius: 2, display: "inline-block" }} />
          {providerShort}-favorable
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.payorColor, opacity: 0.7, borderRadius: 2, display: "inline-block" }} />
          {payorShort}-favorable
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 16, height: 2, background: colors.accent, borderRadius: 1, display: "inline-block" }} />
          Weekly acceleration
        </span>
      </div>
    </div>
  );
}

// === MESSAGE DISCIPLINE SCORE ===
// Measures how consistently each side sticks to their core talking points

function MessageDiscipline({ entries, config }) {
  const { colors, providerKey, payorKey, providerShort, payorShort, providerName, payorName } = config;

  const analysis = useMemo(() => {
    if (entries.length < 5) return null;

    // Extract messaging themes from frame + blame + sentiment combinations
    const provEntries = entries.filter((e) => e.frameAdoption === providerKey || e.blameDirection === payorKey);
    const payEntries = entries.filter((e) => e.frameAdoption === payorKey || e.blameDirection === providerKey);

    const extractThemes = (ents, side) => {
      const themes = {};
      ents.forEach((e) => {
        // Build theme key from the combination of frame + blame + channel + patientStory
        const parts = [];
        if (e.frameAdoption === side) parts.push("frame");
        if (e.patientStory) parts.push("patient");
        if (e.channel === "stakeholder" || e.channel === "employer") parts.push("institutional");
        if (e.sourceType === "owned") parts.push("owned");
        else if (e.sourceType === "social") parts.push("social");
        else parts.push("earned");
        const key = parts.sort().join("+");
        themes[key] = (themes[key] || 0) + 1;
      });
      return themes;
    };

    const provThemes = extractThemes(provEntries, providerKey);
    const payThemes = extractThemes(payEntries, payorKey);

    // Discipline = concentration. High discipline = few themes dominate
    const calcDiscipline = (themes, total) => {
      if (total === 0) return { score: 0, topThemes: [], entropy: 0 };
      const sorted = Object.entries(themes).sort((a, b) => b[1] - a[1]);
      const topN = sorted.slice(0, 3);
      const topCount = topN.reduce((s, [, v]) => s + v, 0);
      const concentration = topCount / total; // 0-1, higher = more disciplined

      // Shannon entropy (lower = more disciplined)
      const probs = Object.values(themes).map((v) => v / total);
      const entropy = -probs.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0);
      const maxEntropy = Math.log2(Object.keys(themes).length || 1);
      const normalizedEntropy = maxEntropy > 0 ? entropy / maxEntropy : 0;

      return {
        score: Math.round(concentration * 100),
        topThemes: topN.map(([k, v]) => ({ theme: k, count: v, pct: Math.round((v / total) * 100) })),
        entropy: normalizedEntropy,
        uniqueThemes: Object.keys(themes).length,
        total,
      };
    };

    return {
      provider: calcDiscipline(provThemes, provEntries.length),
      payor: calcDiscipline(payThemes, payEntries.length),
    };
  }, [entries, config]);

  if (!analysis) return null;

  const themeLabel = (t) => t.replace(/\+/g, " + ").replace(/frame/, "narrative frame").replace(/patient/, "patient story").replace(/institutional/, "institutional voice").replace(/owned/, "owned media").replace(/social/, "social channel").replace(/earned/, "earned media");

  const DisciplineCard = ({ side, data, color, name }) => (
    <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: MONO }}>{data.score}%</div>
      </div>
      <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8 }}>
        {data.uniqueThemes} distinct messaging patterns across {data.total} entries
      </div>
      <div style={{ height: 8, background: colors.bg, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ height: "100%", width: `${data.score}%`, background: color, borderRadius: 4, transition: "width 0.3s ease" }} />
      </div>
      <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO, marginBottom: 6 }}>TOP MESSAGING PATTERNS</div>
      {data.topThemes.map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${colors.border}`, fontSize: 12 }}>
          <span style={{ color: colors.text }}>{themeLabel(t.theme)}</span>
          <span style={{ fontFamily: MONO, fontWeight: 600, color }}>{t.pct}% ({t.count})</span>
        </div>
      ))}
      <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 8, lineHeight: 1.6 }}>
        {data.score >= 70 ? "High discipline — concentrated, consistent messaging." :
         data.score >= 50 ? "Moderate discipline — somewhat scattered messaging." :
         "Low discipline — fragmented across many themes."}
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          MESSAGE DISCIPLINE
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
          How consistently does each side stick to their core messaging patterns? Higher = more focused.
        </div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <DisciplineCard side={providerKey} data={analysis.provider} color={colors.providerColor} name={providerShort} />
        <DisciplineCard side={payorKey} data={analysis.payor} color={colors.payorColor} name={payorShort} />
      </div>
    </div>
  );
}

// === COUNTER-NARRATIVE EFFECTIVENESS ===
// Maps key PR moves to the composite trend and measures response impact

function CounterNarrative({ entries, config, overrides }) {
  const { colors, providerKey, payorKey, providerShort, payorShort } = config;

  const events = useMemo(() => {
    if (entries.length < 10) return [];
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

    // Identify "PR moves" — owned media entries or high-reach entries with strong framing
    const moves = sorted.filter((e) =>
      e.sourceType === "owned" ||
      (e.reachEstimate === "high" && e.frameAdoption !== "balanced") ||
      (e.channel === "stakeholder" && e.blameDirection !== "both")
    );

    // For each move, compute composite before and after (5-day window)
    const getCompositeAt = (cutoffDate, windowDays) => {
      const cutoff = new Date(cutoffDate).getTime();
      const start = cutoff - windowDays * 86400000;
      const windowEntries = sorted.filter((e) => {
        const t = new Date(e.date).getTime();
        return t > start && t <= cutoff;
      });
      if (windowEntries.length < 2) return null;
      // Simple favorability average
      let favSum = 0;
      windowEntries.forEach((e) => {
        if (e.frameAdoption === providerKey || e.sentiment === `negative_${payorKey}` || e.blameDirection === payorKey) favSum += 1;
        else if (e.frameAdoption === payorKey || e.sentiment === `negative_${providerKey}` || e.blameDirection === providerKey) favSum -= 1;
      });
      return (favSum / windowEntries.length) * 100;
    };

    // Deduplicate by date + side
    const seen = new Set();
    const results = [];
    moves.forEach((e) => {
      const side = e.frameAdoption === providerKey || e.blameDirection === payorKey ? "provider" : "payor";
      const key = `${e.date}-${side}`;
      if (seen.has(key)) return;
      seen.add(key);

      const before = getCompositeAt(e.date, 7);
      const afterDate = new Date(e.date);
      afterDate.setDate(afterDate.getDate() + 7);
      const after = getCompositeAt(afterDate.toISOString().slice(0, 10), 7);

      if (before === null || after === null) return;
      const shift = after - before;
      const effective = side === "provider" ? shift > 5 : shift < -5;

      results.push({
        date: e.date,
        source: e.source,
        headline: e.headline,
        side,
        sideName: side === "provider" ? providerShort : payorShort,
        sideColor: side === "provider" ? colors.providerColor : colors.payorColor,
        before,
        after,
        shift,
        effective,
      });
    });

    return results.sort((a, b) => Math.abs(b.shift) - Math.abs(a.shift)).slice(0, 12);
  }, [entries, config]);

  if (events.length === 0) return null;

  const effectiveProv = events.filter((e) => e.side === "provider" && e.effective).length;
  const totalProv = events.filter((e) => e.side === "provider").length;
  const effectivePay = events.filter((e) => e.side === "payor" && e.effective).length;
  const totalPay = events.filter((e) => e.side === "payor").length;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          COUNTER-NARRATIVE EFFECTIVENESS
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
          When each side makes a PR move, does it actually shift the narrative? Measures 7-day pre/post favorability change.
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO }}>{providerShort} MOVES</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.providerColor, fontFamily: MONO }}>{effectiveProv}/{totalProv}</div>
          <div style={{ fontSize: 10, color: colors.textMuted }}>shifted narrative favorably</div>
        </div>
        <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO }}>{payorShort} MOVES</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.payorColor, fontFamily: MONO }}>{effectivePay}/{totalPay}</div>
          <div style={{ fontSize: 10, color: colors.textMuted }}>shifted narrative favorably</div>
        </div>
      </div>

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 60px 70px", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${colors.border}`, fontSize: 9, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          <div>DATE</div><div>PR MOVE</div><div>BEFORE</div><div>AFTER</div><div>IMPACT</div>
        </div>
        {events.map((e, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 60px 70px", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${colors.border}`, fontSize: 11, alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: colors.textMuted }}>{e.date.slice(5)}</div>
            <div>
              <span style={{ color: e.sideColor, fontWeight: 600, fontSize: 10, fontFamily: MONO }}>{e.sideName}</span>{" "}
              <span style={{ color: colors.text, fontSize: 11 }}>{e.headline.length > 60 ? e.headline.slice(0, 60) + "…" : e.headline}</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: colors.textMuted }}>{e.before > 0 ? "+" : ""}{e.before.toFixed(0)}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: colors.textMuted }}>{e.after > 0 ? "+" : ""}{e.after.toFixed(0)}</div>
            <div style={{
              fontFamily: MONO, fontSize: 11, fontWeight: 700,
              color: e.effective ? "#16A34A" : "#DC2626",
            }}>
              {e.shift > 0 ? "+" : ""}{e.shift.toFixed(0)} {e.effective ? "✓" : "✗"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === MEDIA FATIGUE DETECTOR ===
// Tracks unique source coverage per week — are outlets losing interest?

function MediaFatigue({ entries, config }) {
  const { colors, providerShort, payorShort } = config;

  const data = useMemo(() => {
    if (entries.length < 5) return { weeks: [], sources: [] };
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);

    const weeks = [];
    const cur = new Date(firstDate);
    cur.setDate(cur.getDate() - cur.getDay());
    while (cur <= lastDate) {
      const weekStart = new Date(cur);
      const weekEnd = new Date(cur);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({ start: weekStart, end: weekEnd });
      cur.setDate(cur.getDate() + 7);
    }

    // Track unique sources per week
    const weekData = weeks.map((w, i) => {
      const weekEntries = sorted.filter((e) => {
        const d = new Date(e.date);
        return d >= w.start && d <= w.end;
      });
      const uniqueSources = new Set(weekEntries.map((e) => e.source));
      const highTierSources = new Set(weekEntries.filter((e) => ["news", "tv", "radio"].includes(e.sourceType)).map((e) => e.source));
      return {
        label: `${w.start.getMonth() + 1}/${w.start.getDate()}`,
        date: `${w.start.getFullYear()}-${String(w.start.getMonth() + 1).padStart(2, "0")}-${String(w.start.getDate()).padStart(2, "0")}`,
        total: weekEntries.length,
        uniqueSources: uniqueSources.size,
        highTier: highTierSources.size,
        newSources: 0, // computed below
        sources: [...uniqueSources],
      };
    });

    // Compute new sources (first appearance)
    const seenSources = new Set();
    weekData.forEach((w) => {
      let newCount = 0;
      w.sources.forEach((s) => {
        if (!seenSources.has(s)) { newCount++; seenSources.add(s); }
      });
      w.newSources = newCount;
    });

    // Top sources by coverage frequency
    const sourceCount = {};
    const sourceFirstWeek = {};
    const sourceLastWeek = {};
    sorted.forEach((e) => {
      sourceCount[e.source] = (sourceCount[e.source] || 0) + 1;
      if (!sourceFirstWeek[e.source]) sourceFirstWeek[e.source] = e.date;
      sourceLastWeek[e.source] = e.date;
    });
    const topSources = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => ({
        source,
        count,
        firstDate: sourceFirstWeek[source],
        lastDate: sourceLastWeek[source],
        dropped: new Date(sourceLastWeek[source]) < new Date(sorted[sorted.length - 1].date.slice(0, 7) + "-01"),
      }));

    // Fatigue indicator
    const recentWeeks = weekData.slice(-3);
    const earlyWeeks = weekData.slice(0, 3);
    const recentUnique = recentWeeks.reduce((s, w) => s + w.uniqueSources, 0) / (recentWeeks.length || 1);
    const earlyUnique = earlyWeeks.reduce((s, w) => s + w.uniqueSources, 0) / (earlyWeeks.length || 1);

    return { weeks: weekData, topSources, recentUnique, earlyUnique };
  }, [entries, config]);

  if (data.weeks.length < 2) return null;

  const fatigueRatio = data.earlyUnique > 0 ? data.recentUnique / data.earlyUnique : 1;
  const fatigueLabel = fatigueRatio < 0.5 ? "HIGH FATIGUE" : fatigueRatio < 0.8 ? "MODERATE FATIGUE" : fatigueRatio > 1.2 ? "GROWING INTEREST" : "SUSTAINED";
  const fatigueColor = fatigueRatio < 0.5 ? "#DC2626" : fatigueRatio < 0.8 ? "#D97706" : fatigueRatio > 1.2 ? "#16A34A" : colors.accent;

  const maxVal = Math.max(...data.weeks.map((w) => Math.max(w.uniqueSources, w.highTier, w.newSources)), 1);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
            MEDIA FATIGUE DETECTOR
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            Are outlets still covering this dispute, or have they moved on?
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: fatigueColor, fontFamily: MONO }}>{fatigueLabel}</div>
          <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: MONO }}>
            Recent: {data.recentUnique.toFixed(1)} sources/wk vs Early: {data.earlyUnique.toFixed(1)} sources/wk
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data.weeks} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: MONO }} axisLine={{ stroke: colors.border }} tickLine={false} />
          <YAxis domain={[0, maxVal + 2]} tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <div style={{ color: colors.textMuted }}>Week of {d.date}</div>
                  <div style={{ fontWeight: 700 }}>{d.uniqueSources} unique sources</div>
                  <div style={{ color: colors.providerColor }}>{d.highTier} high-tier (news/TV/radio)</div>
                  <div style={{ color: "#16A34A" }}>{d.newSources} first-time sources</div>
                  <div style={{ color: colors.textMuted }}>{d.total} total entries</div>
                </div>
              );
            }}
          />
          <Bar dataKey="uniqueSources" fill={colors.accent} opacity={0.3} radius={[2, 2, 0, 0]} />
          <Line type="monotone" dataKey="highTier" stroke={colors.providerColor} strokeWidth={2} dot={{ r: 3, fill: colors.bg, stroke: colors.providerColor, strokeWidth: 2 }} />
          <Line type="monotone" dataKey="newSources" stroke="#16A34A" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: colors.bg, stroke: "#16A34A", strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6, fontSize: 10, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.accent, opacity: 0.3, borderRadius: 2, display: "inline-block" }} />
          Unique sources
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 16, height: 2, background: colors.providerColor, borderRadius: 1, display: "inline-block" }} />
          High-tier sources
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 16, height: 2, background: "#16A34A", borderRadius: 1, display: "inline-block", borderTop: "1px dashed #16A34A" }} />
          New sources
        </span>
      </div>

      {/* Top sources table */}
      <div style={{ marginTop: 16, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO, fontWeight: 700, padding: "8px 12px", borderBottom: `1px solid ${colors.border}` }}>
          TOP SOURCES BY COVERAGE FREQUENCY
        </div>
        {data.topSources.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", borderBottom: `1px solid ${colors.border}`, fontSize: 12 }}>
            <span style={{ color: colors.text }}>{s.source}</span>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: MONO }}>{s.firstDate.slice(5)} → {s.lastDate.slice(5)}</span>
              <span style={{ fontFamily: MONO, fontWeight: 600, color: s.dropped ? "#DC2626" : colors.accent, fontSize: 11 }}>
                {s.count}× {s.dropped ? "(dropped off)" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === MAIN EXPORT ===

export default function DeepAnalysis({ entries, config, weightOverrides }) {
  const { colors } = config;

  return (
    <div style={{ padding: "24px 20px", background: colors.bg, minHeight: "60vh" }}>
      <NarrativeVelocity entries={entries} config={config} />
      <MessageDiscipline entries={entries} config={config} />
      <CounterNarrative entries={entries} config={config} overrides={weightOverrides} />
      <MediaFatigue entries={entries} config={config} />
    </div>
  );
}
