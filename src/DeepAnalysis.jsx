import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Source Serif 4', Georgia, serif";

// === NARRATIVE VELOCITY ===

function NarrativeVelocity({ entries, config }) {
  const { colors, providerShort, payorShort } = config;

  const data = useMemo(() => {
    if (entries.length === 0) return [];
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
      weeks.push({ start: weekStart, end: weekEnd, label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}` });
      cur.setDate(cur.getDate() + 7);
    }

    return weeks.map((w) => {
      const weekEntries = sorted.filter((e) => {
        const d = new Date(e.date);
        return d >= w.start && d <= w.end;
      });
      const provFav = weekEntries.filter((e) =>
        e.frameAdoption === config.providerKey || e.sentiment === `negative_${config.payorKey}` || e.blameDirection === config.payorKey
      ).length;
      const payFav = weekEntries.filter((e) =>
        e.frameAdoption === config.payorKey || e.sentiment === `negative_${config.providerKey}` || e.blameDirection === config.providerKey
      ).length;
      const neutral = weekEntries.length - provFav - payFav;
      return { label: w.label, provFav, payFav, neutral: Math.max(0, neutral) };
    });
  }, [entries, config]);

  if (data.length < 2) return null;

  const maxCount = Math.max(...data.map((d) => d.provFav + d.payFav + d.neutral), 1);

  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid);
  const secondHalf = data.slice(mid);
  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, d) => s + d.provFav + d.payFav + d.neutral, 0) / firstHalf.length : 0;
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, d) => s + d.provFav + d.payFav + d.neutral, 0) / secondHalf.length : 0;
  const velocityRatio = firstAvg > 0 ? secondAvg / firstAvg : secondAvg > 0 ? 2 : 1;
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
            Weekly coverage volume — is the dispute gaining or losing attention?
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: velocityColor, fontFamily: MONO }}>{velocityLabel}</div>
          <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: MONO }}>
            Recent: {secondAvg.toFixed(1)}/wk vs Prior: {firstAvg.toFixed(1)}/wk
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: MONO }} axisLine={{ stroke: colors.border }} tickLine={false} />
          <YAxis domain={[0, maxCount + 2]} tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              const total = d.provFav + d.payFav + d.neutral;
              return (
                <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <div style={{ fontWeight: 700 }}>{total} entries</div>
                  <div style={{ color: colors.providerColor }}>{d.provFav} {providerShort}-favorable</div>
                  <div style={{ color: colors.payorColor }}>{d.payFav} {payorShort}-favorable</div>
                  {d.neutral > 0 && <div style={{ color: colors.textMuted }}>{d.neutral} neutral</div>}
                </div>
              );
            }}
          />
          <Bar dataKey="provFav" stackId="vol" fill={colors.providerColor} opacity={0.8} radius={[0, 0, 0, 0]} />
          <Bar dataKey="neutral" stackId="vol" fill={colors.accent} opacity={0.3} radius={[0, 0, 0, 0]} />
          <Bar dataKey="payFav" stackId="vol" fill={colors.payorColor} opacity={0.8} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6, fontSize: 10, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.providerColor, opacity: 0.8, borderRadius: 2, display: "inline-block" }} />
          {providerShort}-favorable
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.accent, opacity: 0.3, borderRadius: 2, display: "inline-block" }} />
          Neutral
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.payorColor, opacity: 0.8, borderRadius: 2, display: "inline-block" }} />
          {payorShort}-favorable
        </span>
      </div>
    </div>
  );
}

// === MESSAGE DISCIPLINE ===
// Shows distinct messaging strategies and consistency on each

function MessageDiscipline({ entries, config }) {
  const { colors, providerKey, payorKey, providerShort, payorShort, providerName, payorName } = config;

  const analysis = useMemo(() => {
    if (entries.length < 5) return null;

    const analyzeSide = (sideKey, oppositeKey) => {
      const sideEntries = entries.filter((e) =>
        e.frameAdoption === sideKey || e.blameDirection === oppositeKey
      );
      if (sideEntries.length === 0) return null;

      // Identify distinct messaging strategies from the data
      const strategies = [];

      // 1. Patient story messaging
      const patientEntries = sideEntries.filter((e) => e.patientStory);
      if (patientEntries.length > 0) {
        strategies.push({
          name: "Patient stories",
          count: patientEntries.length,
          pct: Math.round((patientEntries.length / sideEntries.length) * 100),
          desc: `${patientEntries.length} entries use patient/consumer narratives`,
        });
      }

      // 2. Earned media (independent coverage)
      const earnedEntries = sideEntries.filter((e) => ["news", "tv", "radio"].includes(e.sourceType));
      if (earnedEntries.length > 0) {
        strategies.push({
          name: "Earned media coverage",
          count: earnedEntries.length,
          pct: Math.round((earnedEntries.length / sideEntries.length) * 100),
          desc: `${earnedEntries.length} entries via independent news/TV/radio`,
        });
      }

      // 3. Owned media (press releases, statements)
      const ownedEntries = sideEntries.filter((e) => e.sourceType === "owned");
      if (ownedEntries.length > 0) {
        strategies.push({
          name: "Owned media / statements",
          count: ownedEntries.length,
          pct: Math.round((ownedEntries.length / sideEntries.length) * 100),
          desc: `${ownedEntries.length} direct press releases or statements`,
        });
      }

      // 4. Social amplification
      const socialEntries = sideEntries.filter((e) => e.sourceType === "social" || e.channel === "social");
      if (socialEntries.length > 0) {
        strategies.push({
          name: "Social amplification",
          count: socialEntries.length,
          pct: Math.round((socialEntries.length / sideEntries.length) * 100),
          desc: `${socialEntries.length} entries via social channels`,
        });
      }

      // 5. Stakeholder / institutional voices
      const stakeEntries = sideEntries.filter((e) => e.channel === "stakeholder" || e.channel === "employer");
      if (stakeEntries.length > 0) {
        strategies.push({
          name: "Institutional / stakeholder voices",
          count: stakeEntries.length,
          pct: Math.round((stakeEntries.length / sideEntries.length) * 100),
          desc: `${stakeEntries.length} third-party or employer entries`,
        });
      }

      // 6. High-reach placements
      const highReach = sideEntries.filter((e) => e.reachEstimate === "high");
      if (highReach.length > 0) {
        strategies.push({
          name: "High-reach placements",
          count: highReach.length,
          pct: Math.round((highReach.length / sideEntries.length) * 100),
          desc: `${highReach.length} entries in high-visibility outlets`,
        });
      }

      // Sort by count descending
      strategies.sort((a, b) => b.count - a.count);

      // Discipline = how much of coverage is in the top 2 strategies
      const top2 = strategies.slice(0, 2).reduce((s, st) => s + st.count, 0);
      const score = Math.round((top2 / sideEntries.length) * 100);

      return { strategies, score, total: sideEntries.length };
    };

    return {
      provider: analyzeSide(providerKey, payorKey),
      payor: analyzeSide(payorKey, providerKey),
    };
  }, [entries, config]);

  if (!analysis) return null;

  const DisciplineCard = ({ data, color, name }) => {
    if (!data) return null;
    return (
      <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: MONO }}>{data.score}%</div>
        </div>
        <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
          {data.score >= 70 ? "Highly focused" : data.score >= 50 ? "Moderately focused" : "Scattered"} across {data.total} entries
        </div>
        <div style={{ height: 6, background: colors.bg, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ height: "100%", width: `${data.score}%`, background: color, borderRadius: 3 }} />
        </div>
        {data.strategies.map((st, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{st.name}</span>
              <span style={{ fontSize: 11, fontFamily: MONO, fontWeight: 600, color }}>{st.pct}%</span>
            </div>
            <div style={{ height: 4, background: colors.bg, borderRadius: 2, overflow: "hidden", marginBottom: 2 }}>
              <div style={{ height: "100%", width: `${st.pct}%`, background: color, opacity: 0.6, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted }}>{st.desc}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          MESSAGE DISCIPLINE
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
          What messaging strategies does each side use, and how consistently? Higher = more concentrated on top tactics.
        </div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <DisciplineCard data={analysis.provider} color={colors.providerColor} name={providerShort} />
        <DisciplineCard data={analysis.payor} color={colors.payorColor} name={payorShort} />
      </div>
    </div>
  );
}

// === COUNTER-NARRATIVE EFFECTIVENESS ===

function CounterNarrative({ entries, config, overrides }) {
  const { colors, providerKey, payorKey, providerShort, payorShort } = config;

  const events = useMemo(() => {
    if (entries.length < 10) return [];
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

    const moves = sorted.filter((e) =>
      e.sourceType === "owned" ||
      (e.reachEstimate === "high" && e.frameAdoption !== "balanced") ||
      (e.channel === "stakeholder" && e.blameDirection !== "both")
    );

    const getCompositeAt = (cutoffDate, windowDays) => {
      const cutoff = new Date(cutoffDate).getTime();
      const start = cutoff - windowDays * 86400000;
      const windowEntries = sorted.filter((e) => {
        const t = new Date(e.date).getTime();
        return t > start && t <= cutoff;
      });
      if (windowEntries.length < 2) return null;
      let favSum = 0;
      windowEntries.forEach((e) => {
        if (e.frameAdoption === providerKey || e.sentiment === `negative_${payorKey}` || e.blameDirection === payorKey) favSum += 1;
        else if (e.frameAdoption === payorKey || e.sentiment === `negative_${providerKey}` || e.blameDirection === providerKey) favSum -= 1;
      });
      return (favSum / windowEntries.length) * 100;
    };

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

  const shiftDescription = (e) => {
    const abs = Math.abs(e.shift);
    const toward = e.shift > 0 ? providerShort : payorShort;
    if (abs < 3) return { text: "No meaningful shift", color: colors.textMuted };
    if (abs < 10) return { text: `Slight shift toward ${toward}`, color: e.effective ? "#16A34A" : "#D97706" };
    if (abs < 25) return { text: `Moderate shift toward ${toward}`, color: e.effective ? "#16A34A" : "#DC2626" };
    return { text: `Strong shift toward ${toward}`, color: e.effective ? "#16A34A" : "#DC2626" };
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          COUNTER-NARRATIVE EFFECTIVENESS
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
          When each side makes a PR move, does the narrative actually shift in their favor over the next 7 days?
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO }}>{providerShort} MOVES</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.providerColor, fontFamily: MONO }}>{effectiveProv}/{totalProv}</div>
          <div style={{ fontSize: 10, color: colors.textMuted }}>shifted narrative in their favor</div>
        </div>
        <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO }}>{payorShort} MOVES</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.payorColor, fontFamily: MONO }}>{effectivePay}/{totalPay}</div>
          <div style={{ fontSize: 10, color: colors.textMuted }}>shifted narrative in their favor</div>
        </div>
      </div>

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 180px 36px", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${colors.border}`, fontSize: 9, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          <div>DATE</div><div>PR MOVE</div><div>7-DAY RESULT</div><div></div>
        </div>
        {events.map((e, i) => {
          const desc = shiftDescription(e);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 180px 36px", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${colors.border}`, fontSize: 11, alignItems: "center" }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: colors.textMuted }}>{e.date.slice(5)}</div>
              <div>
                <span style={{ color: e.sideColor, fontWeight: 600, fontSize: 10, fontFamily: MONO }}>{e.sideName}</span>{" "}
                <span style={{ color: colors.text, fontSize: 11 }}>{e.headline.length > 55 ? e.headline.slice(0, 55) + "…" : e.headline}</span>
              </div>
              <div style={{ fontSize: 11, color: desc.color, fontWeight: 600 }}>{desc.text}</div>
              <div style={{ fontSize: 14, textAlign: "center" }}>{e.effective ? "✓" : "✗"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === MEDIA FATIGUE DETECTOR ===

function MediaFatigue({ entries, config }) {
  const { colors } = config;

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

    const seenSources = new Set();
    const weekData = weeks.map((w) => {
      const weekEntries = sorted.filter((e) => {
        const d = new Date(e.date);
        return d >= w.start && d <= w.end;
      });
      const uniqueSources = new Set(weekEntries.map((e) => e.source));
      const highTierSources = new Set(weekEntries.filter((e) => ["news", "tv", "radio"].includes(e.sourceType)).map((e) => e.source));

      let newCount = 0;
      uniqueSources.forEach((s) => {
        if (!seenSources.has(s)) { newCount++; seenSources.add(s); }
      });

      // For stacked bar: other = unique - highTier - new (avoid double counting)
      const highTier = highTierSources.size;
      const newSources = newCount;
      const returning = Math.max(0, uniqueSources.size - newSources);

      return {
        label: `${w.start.getMonth() + 1}/${w.start.getDate()}`,
        date: `${w.start.getFullYear()}-${String(w.start.getMonth() + 1).padStart(2, "0")}-${String(w.start.getDate()).padStart(2, "0")}`,
        total: weekEntries.length,
        uniqueSources: uniqueSources.size,
        highTier,
        newSources,
        returning,
      };
    });

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

  const maxVal = Math.max(...data.weeks.map((w) => w.returning + w.newSources), 1);

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
        <BarChart data={data.weeks} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
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
          <Bar dataKey="returning" stackId="sources" fill={colors.accent} opacity={0.5} radius={[0, 0, 0, 0]} />
          <Bar dataKey="newSources" stackId="sources" fill="#16A34A" opacity={0.8} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6, fontSize: 10, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.accent, opacity: 0.5, borderRadius: 2, display: "inline-block" }} />
          Returning sources
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: "#16A34A", opacity: 0.8, borderRadius: 2, display: "inline-block" }} />
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
