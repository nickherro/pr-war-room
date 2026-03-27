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
    <div>
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
// Measures how consistently each side hammers their core talking points

function MessageDiscipline({ entries, config }) {
  const { colors, providerKey, payorKey, providerShort, payorShort } = config;
  const talkingPoints = config.talkingPoints;

  const analysis = useMemo(() => {
    if (!talkingPoints || entries.length < 5) return null;

    const matchEntries = (points, sideEntries) => {
      const total = sideEntries.length;
      if (total === 0) return { points: [], coveredPct: 0, total: 0 };

      const results = points.map((tp) => {
        const regexes = tp.keywords.map((k) => new RegExp(k, "i"));
        const matched = sideEntries.filter((e) =>
          regexes.some((r) => r.test(e.headline))
        );
        return {
          name: tp.name,
          count: matched.length,
          pct: Math.round((matched.length / total) * 100),
        };
      });

      // How many entries hit at least one talking point
      const coveredEntries = new Set();
      points.forEach((tp) => {
        const regexes = tp.keywords.map((k) => new RegExp(k, "i"));
        sideEntries.forEach((e, idx) => {
          if (regexes.some((r) => r.test(e.headline))) coveredEntries.add(idx);
        });
      });

      return {
        points: results.sort((a, b) => b.count - a.count),
        coveredPct: Math.round((coveredEntries.size / total) * 100),
        total,
      };
    };

    const provEntries = entries.filter((e) =>
      e.frameAdoption === providerKey || e.blameDirection === payorKey
    );
    const payEntries = entries.filter((e) =>
      e.frameAdoption === payorKey || e.blameDirection === providerKey
    );

    return {
      provider: matchEntries(talkingPoints.provider || [], provEntries),
      payor: matchEntries(talkingPoints.payor || [], payEntries),
    };
  }, [entries, config, talkingPoints]);

  if (!analysis) return null;

  const DisciplineCard = ({ data, color, name }) => {
    if (!data || data.total === 0) return null;
    const maxCount = Math.max(...data.points.map((p) => p.count), 1);
    return (
      <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>{name}</div>
          <div>
            <span style={{ fontSize: 24, fontWeight: 700, color, fontFamily: MONO }}>{data.coveredPct}%</span>
            <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: MONO, marginLeft: 4 }}>on-message</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 12 }}>
          {data.coveredPct >= 70 ? "Highly disciplined" : data.coveredPct >= 45 ? "Moderately disciplined" : "Scattered messaging"} — {data.total} entries analyzed
        </div>
        {data.points.map((tp, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: colors.text, fontWeight: tp.count > 0 ? 600 : 400 }}>{tp.name}</span>
              <span style={{ fontSize: 10, fontFamily: MONO, fontWeight: 600, color: tp.count > 0 ? color : colors.textMuted }}>
                {tp.count > 0 ? `${tp.count} hits (${tp.pct}%)` : "—"}
              </span>
            </div>
            <div style={{ height: 4, background: colors.bg, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(tp.count / maxCount) * 100}%`, background: color, opacity: tp.count > 0 ? 0.7 : 0.1, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>
          MESSAGE DISCIPLINE
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
          How consistently does each side stay on their core talking points? Matches entry headlines against known messaging themes.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DisciplineCard data={analysis.provider} color={colors.providerColor} name={providerShort} />
        <DisciplineCard data={analysis.payor} color={colors.payorColor} name={payorShort} />
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

      const highTier = highTierSources.size;
      const otherTier = Math.max(0, uniqueSources.size - highTier);

      return {
        label: `${w.start.getMonth() + 1}/${w.start.getDate()}`,
        date: `${w.start.getFullYear()}-${String(w.start.getMonth() + 1).padStart(2, "0")}-${String(w.start.getDate()).padStart(2, "0")}`,
        total: weekEntries.length,
        uniqueSources: uniqueSources.size,
        highTier,
        otherTier,
        newSources: newCount,
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

  const maxVal = Math.max(...data.weeks.map((w) => w.highTier + w.otherTier), 1);

  return (
    <div>
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
          <Bar dataKey="highTier" stackId="sources" fill={colors.providerColor} opacity={0.8} radius={[0, 0, 0, 0]} />
          <Bar dataKey="otherTier" stackId="sources" fill={colors.accent} opacity={0.35} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6, fontSize: 10, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.providerColor, opacity: 0.8, borderRadius: 2, display: "inline-block" }} />
          High-tier (news/TV/radio)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: colors.accent, opacity: 0.35, borderRadius: 2, display: "inline-block" }} />
          Other sources
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
    <div style={{ padding: "20px 16px", background: colors.bg, minHeight: "60vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "start" }}>
        <NarrativeVelocity entries={entries} config={config} />
        <MessageDiscipline entries={entries} config={config} />
        <MediaFatigue entries={entries} config={config} />
      </div>
    </div>
  );
}
