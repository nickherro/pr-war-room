import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONO = "'JetBrains Mono', monospace";

// === WEEKLY COVERAGE CHARTS ===
// Two stacked bar charts sharing the same weekly x-axis:
// 1. Favorability distribution (provider-fav / neutral / payor-fav)
// 2. Source type distribution (high-tier / other / new)

function WeeklyCoverage({ entries, config }) {
  const { colors, providerShort, payorShort, providerKey, payorKey } = config;

  const data = useMemo(() => {
    if (entries.length === 0) return { weeks: [], velocity: {}, fatigue: {}, topSources: [] };
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);

    const weekBuckets = [];
    const cur = new Date(firstDate);
    cur.setDate(cur.getDate() - cur.getDay());
    while (cur <= lastDate) {
      const weekStart = new Date(cur);
      const weekEnd = new Date(cur);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekBuckets.push({ start: weekStart, end: weekEnd, label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}` });
      cur.setDate(cur.getDate() + 7);
    }

    const weeks = weekBuckets.map((w) => {
      const weekEntries = sorted.filter((e) => {
        const d = new Date(e.date);
        return d >= w.start && d <= w.end;
      });

      // Favorability
      const provFav = weekEntries.filter((e) =>
        e.frameAdoption === providerKey || e.sentiment === `negative_${payorKey}` || e.blameDirection === payorKey
      ).length;
      const payFav = weekEntries.filter((e) =>
        e.frameAdoption === payorKey || e.sentiment === `negative_${providerKey}` || e.blameDirection === providerKey
      ).length;
      const neutral = Math.max(0, weekEntries.length - provFav - payFav);

      // Source types
      const uniqueSources = new Set(weekEntries.map((e) => e.source));

      return {
        label: w.label,
        provFav, payFav, neutral,
        uniqueSources: uniqueSources.size,
        total: weekEntries.length,
      };
    });

    // Top sources
    const sourceCount = {};
    const sourceFirst = {};
    const sourceLast = {};
    sorted.forEach((e) => {
      sourceCount[e.source] = (sourceCount[e.source] || 0) + 1;
      if (!sourceFirst[e.source]) sourceFirst[e.source] = e.date;
      sourceLast[e.source] = e.date;
    });
    const topSources = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({
        source, count,
        firstDate: sourceFirst[source],
        lastDate: sourceLast[source],
        dropped: new Date(sourceLast[source]) < new Date(sorted[sorted.length - 1].date.slice(0, 7) + "-01"),
      }));

    return { weeks, topSources };
  }, [entries, config]);

  if (data.weeks.length < 2) return null;

  const maxVol = Math.max(...data.weeks.map((d) => d.provFav + d.payFav + d.neutral), 1);
  const maxSrc = Math.max(...data.weeks.map((d) => d.uniqueSources), 1);

  const sharedXAxis = (hide) => (
    <XAxis
      dataKey="label"
      tick={hide ? false : { fill: colors.textMuted, fontSize: 9, fontFamily: MONO }}
      axisLine={{ stroke: colors.border }}
      tickLine={false}
      hide={hide}
    />
  );

  return (
    <div>
      {/* Chart 1: Favorability by volume */}
      <div style={{ fontSize: 11, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700, marginBottom: 8 }}>
        WEEKLY COVERAGE BY FAVORABILITY
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data.weeks} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          {sharedXAxis(true)}
          <YAxis domain={[0, maxVol + 2]} tick={{ fill: colors.textMuted, fontSize: 9, fontFamily: MONO }} axisLine={false} tickLine={false} width={24} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: MONO, fontSize: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{d.total} entries</div>
                  <div style={{ color: colors.providerColor }}>{d.provFav} {providerShort}-fav</div>
                  <div style={{ color: colors.payorColor }}>{d.payFav} {payorShort}-fav</div>
                  {d.neutral > 0 && <div style={{ color: colors.textMuted }}>{d.neutral} neutral</div>}
                </div>
              );
            }}
          />
          <Bar dataKey="provFav" stackId="fav" fill={colors.providerColor} opacity={0.8} />
          <Bar dataKey="neutral" stackId="fav" fill={colors.accent} opacity={0.25} />
          <Bar dataKey="payFav" stackId="fav" fill={colors.payorColor} opacity={0.8} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4, marginBottom: 16, fontSize: 9, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 8, height: 8, background: colors.providerColor, opacity: 0.8, borderRadius: 2, display: "inline-block" }} />
          {providerShort}-fav
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 8, height: 8, background: colors.accent, opacity: 0.25, borderRadius: 2, display: "inline-block" }} />
          Neutral
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 8, height: 8, background: colors.payorColor, opacity: 0.8, borderRadius: 2, display: "inline-block" }} />
          {payorShort}-fav
        </span>
      </div>

      {/* Chart 2: Source type by volume */}
      <div style={{ fontSize: 11, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700, marginBottom: 8 }}>
        UNIQUE SOURCES PER WEEK
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data.weeks} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          {sharedXAxis(false)}
          <YAxis domain={[0, maxSrc + 2]} tick={{ fill: colors.textMuted, fontSize: 9, fontFamily: MONO }} axisLine={false} tickLine={false} width={24} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: MONO, fontSize: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <div style={{ fontWeight: 700 }}>{d.uniqueSources} unique sources</div>
                  <div style={{ color: colors.textMuted }}>{d.total} total entries</div>
                </div>
              );
            }}
          />
          <Bar dataKey="uniqueSources" fill={colors.accent} opacity={0.6} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4, marginBottom: 16, fontSize: 9, fontFamily: MONO, color: colors.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 8, height: 8, background: colors.accent, opacity: 0.6, borderRadius: 2, display: "inline-block" }} />
          Unique sources
        </span>
      </div>

      {/* Top sources table */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ fontSize: 9, letterSpacing: 1, color: colors.textMuted, fontFamily: MONO, fontWeight: 700, padding: "6px 10px", borderBottom: `1px solid ${colors.border}` }}>
          TOP SOURCES
        </div>
        {data.topSources.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 10px", borderBottom: `1px solid ${colors.border}`, fontSize: 11 }}>
            <span style={{ color: colors.text }}>{s.source}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: colors.textMuted, fontFamily: MONO }}>{s.firstDate.slice(5)} → {s.lastDate.slice(5)}</span>
              <span style={{ fontFamily: MONO, fontWeight: 600, color: s.dropped ? "#DC2626" : colors.accent, fontSize: 10 }}>
                {s.count}×{s.dropped ? " dropped" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === MESSAGE DISCIPLINE ===

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
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700 }}>{name}</div>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: MONO }}>{data.coveredPct}%</span>
            <span style={{ fontSize: 9, color: colors.textMuted, fontFamily: MONO, marginLeft: 3 }}>on-message</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 10 }}>
          {data.coveredPct >= 70 ? "Highly disciplined" : data.coveredPct >= 45 ? "Moderately disciplined" : "Scattered messaging"} — {data.total} entries
        </div>
        {data.points.map((tp, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
              <span style={{ fontSize: 11, color: colors.text, fontWeight: tp.count > 0 ? 600 : 400 }}>{tp.name}</span>
              <span style={{ fontSize: 9, fontFamily: MONO, fontWeight: 600, color: tp.count > 0 ? color : colors.textMuted }}>
                {tp.count > 0 ? `${tp.count} (${tp.pct}%)` : "—"}
              </span>
            </div>
            <div style={{ height: 3, background: colors.bg, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(tp.count / maxCount) * 100}%`, background: color, opacity: tp.count > 0 ? 0.7 : 0.1, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 1.2, color: colors.textMuted, fontFamily: MONO, fontWeight: 700, marginBottom: 10 }}>
        MESSAGE DISCIPLINE
      </div>
      <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 12 }}>
        How consistently does each side stay on their core talking points?
      </div>
      <DisciplineCard data={analysis.provider} color={colors.providerColor} name={providerShort} />
      <DisciplineCard data={analysis.payor} color={colors.payorColor} name={payorShort} />
    </div>
  );
}

// === MAIN EXPORT ===

export default function DeepAnalysis({ entries, config, weightOverrides }) {
  const { colors } = config;

  return (
    <div style={{ padding: "20px 16px", background: colors.bg, minHeight: "60vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <WeeklyCoverage entries={entries} config={config} />
        <MessageDiscipline entries={entries} config={config} />
      </div>
    </div>
  );
}
