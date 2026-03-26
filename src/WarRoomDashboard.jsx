import { useState, useMemo, useCallback } from "react";
import { ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

// === SHARED COMPUTATION LOGIC ===

const SOURCE_TYPE_WEIGHTS = { tv: 1.2, radio: 1.2, news: 1.0, social: 0.7, owned: 0.3, opinion: 0.8, other: 1.0 };

function getWeight(entry, sourceWeights) {
  return sourceWeights[entry.source] ?? SOURCE_TYPE_WEIGHTS[entry.sourceType] ?? 1.0;
}

function computeScores(entries, config) {
  const { providerKey, payorKey, sourceWeights } = config;
  const gw = (e) => getWeight(e, sourceWeights);
  const totalW = entries.reduce((s, e) => s + gw(e), 0) || 1;
  const mediaEntries = entries.filter((e) => e.channel === "media");
  const socialEntries = entries.filter((e) => e.channel === "social");
  const stakeholderEntries = entries.filter((e) => e.channel === "stakeholder");
  const employerEntries = entries.filter((e) => e.channel === "employer");

  const frameProvider = entries.filter((e) => e.frameAdoption === providerKey).reduce((s, e) => s + gw(e), 0);
  const framePayor = entries.filter((e) => e.frameAdoption === payorKey).reduce((s, e) => s + gw(e), 0);
  const frameScore = ((frameProvider - framePayor) / totalW) * 100;

  const sentNegPayor = entries.filter((e) => e.sentiment === `negative_${payorKey}` || e.sentiment === `positive_${providerKey}`).reduce((s, e) => s + gw(e), 0);
  const sentNegProvider = entries.filter((e) => e.sentiment === `negative_${providerKey}` || e.sentiment === `positive_${payorKey}`).reduce((s, e) => s + gw(e), 0);
  const sentScore = ((sentNegPayor - sentNegProvider) / totalW) * 100;

  const blamePayor = entries.filter((e) => e.blameDirection === payorKey).reduce((s, e) => s + gw(e), 0);
  const blameProvider = entries.filter((e) => e.blameDirection === providerKey).reduce((s, e) => s + gw(e), 0);
  const blameScore = ((blamePayor - blameProvider) / totalW) * 100;

  const patientW = entries.filter((e) => e.patientStory).reduce((s, e) => s + gw(e), 0);
  const patientScore = (patientW / totalW) * 100;

  const composite = frameScore * 0.3 + sentScore * 0.3 + blameScore * 0.25 + patientScore * 0.15;

  return {
    total: entries.length,
    totalWeighted: totalW,
    mediaCount: mediaEntries.length,
    socialCount: socialEntries.length,
    stakeholderCount: stakeholderEntries.length,
    employerCount: employerEntries.length,
    frameScore, sentScore, blameScore, patientScore, composite,
    frameProvider: entries.filter((e) => e.frameAdoption === providerKey).length,
    framePayor: entries.filter((e) => e.frameAdoption === payorKey).length,
    frameBalanced: entries.filter((e) => e.frameAdoption === "balanced").length,
    sentNegPayor: entries.filter((e) => e.sentiment === `negative_${payorKey}` || e.sentiment === `positive_${providerKey}`).length,
    sentNegProvider: entries.filter((e) => e.sentiment === `negative_${providerKey}` || e.sentiment === `positive_${payorKey}`).length,
    sentNeutral: entries.filter((e) => e.sentiment === "neutral").length,
    blamePayor: entries.filter((e) => e.blameDirection === payorKey).length,
    blameProvider: entries.filter((e) => e.blameDirection === providerKey).length,
    blameBoth: entries.filter((e) => e.blameDirection === "both").length,
    patientStories: entries.filter((e) => e.patientStory).length,
  };
}

function computeTrend(entries, config) {
  if (entries.length === 0) return [];
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const dateMap = {};
  sorted.forEach((e) => {
    if (!dateMap[e.date]) dateMap[e.date] = [];
    dateMap[e.date].push(e);
  });
  const dates = Object.keys(dateMap).sort();
  const points = [];
  const cumulative = [];
  dates.forEach((d) => {
    cumulative.push(...dateMap[d]);
    const s = computeScores(cumulative, config);
    points.push({ date: d, composite: s.composite, count: cumulative.length, dateCount: dateMap[d].length, frame: s.frameScore, sent: s.sentScore, blame: s.blameScore });
  });
  return points;
}

// === CHART COMPONENTS ===

function SearchTrendsChart({ entries, config }) {
  const { disputePublicDate, searchTrends, colors, searchLabel, gradientId } = config;

  const data = useMemo(() => {
    const trend = computeTrend(entries, config);
    const dates = trend.map((t) => t.date);
    if (dates.length > 0 && disputePublicDate < dates[0]) {
      dates.unshift(disputePublicDate);
    }
    return dates.map((d) => {
      const dTime = new Date(d).getTime();
      let closest = searchTrends[0];
      let minDiff = Infinity;
      searchTrends.forEach((s) => {
        const diff = Math.abs(new Date(s.week).getTime() - dTime);
        if (diff < minDiff) { minDiff = diff; closest = s; }
      });
      const parts = d.split("-");
      return { date: d, label: `${parseInt(parts[1])}/${parseInt(parts[2])}`, interest: closest.interest };
    });
  }, [entries, config]);

  const hasDisputePoint = data.some((d) => d.date === disputePublicDate);
  const firstPostDate = data.find((d) => d.date >= disputePublicDate)?.date;
  const refDate = hasDisputePoint ? disputePublicDate : firstPostDate;

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          PUBLIC INTEREST — GOOGLE SEARCH VOLUME (RELATIVE)
        </div>
        <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          {searchLabel}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id={gradientId + "_search"} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: colors.border }}
            tickLine={false}
            tickFormatter={(v) => { const p = v.split("-"); return `${parseInt(p[1])}/${parseInt(p[2])}`; }}
            interval={data.length > 15 ? Math.floor(data.length / 8) : 0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tick={{ fill: colors.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            width={config.yAxisWidth || 78}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "6px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <div style={{ color: colors.textMuted }}>{d.date}</div>
                  <div style={{ color: "#7C3AED", fontWeight: 700 }}>Interest: {d.interest}/100</div>
                </div>
              );
            }}
          />
          {refDate && (
            <ReferenceLine x={refDate} stroke={colors.payorColor} strokeWidth={1} strokeDasharray="4 3" opacity={0.6}>
              <Label value="DISPUTE PUBLIC" position="insideTopRight" fill={colors.payorColor} fontSize={9} fontFamily="'JetBrains Mono', monospace" fontWeight={600} />
            </ReferenceLine>
          )}
          <Area type="monotone" dataKey="interest" stroke="none" fill={`url(#${gradientId}_search)`} isAnimationActive={false} />
          <Line type="monotone" dataKey="interest" stroke="#7C3AED" strokeWidth={2} dot={false} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendChart({ entries, filterChannel, config }) {
  const { disputePublicDate, colors, gradientId } = config;
  const providerFavLabel = config.providerShort + " FAV";
  const payorFavLabel = config.payorShort + " FAV";

  const allTrend = useMemo(() => computeTrend(entries, config), [entries, config]);
  const channelTrend = useMemo(() => {
    if (filterChannel === "all") return null;
    const channelEntries = entries.filter((e) => e.channel === filterChannel);
    if (channelEntries.length < 2) return null;
    return computeTrend(channelEntries, config);
  }, [entries, filterChannel, config]);

  const chartData = useMemo(() => {
    const source = filterChannel !== "all" ? entries.filter((e) => e.channel === filterChannel) : entries;
    const volMap = {};
    source.forEach((e) => { volMap[e.date] = (volMap[e.date] || 0) + 1; });
    const chMap = {};
    if (channelTrend) channelTrend.forEach((ct) => { chMap[ct.date] = ct.composite; });

    let data = allTrend.map((t) => {
      const parts = t.date.split("-");
      const label = `${parseInt(parts[1])}/${parseInt(parts[2])}`;
      const phase = t.date < disputePublicDate ? "pre" : "post";
      return {
        date: t.date, label, phase,
        composite: t.composite, count: t.count,
        volume: volMap[t.date] || 0,
        channel: chMap[t.date] ?? null,
      };
    });

    // Insert synthetic dispute point if dispute date is before all data
    if (data.length > 0 && disputePublicDate < data[0].date) {
      data.unshift({
        date: disputePublicDate,
        label: (() => { const p = disputePublicDate.split("-"); return `${parseInt(p[1])}/${parseInt(p[2])}`; })(),
        phase: "post",
        composite: null,
        count: 0,
        volume: 0,
        channel: null,
      });
    }

    return data;
  }, [allTrend, channelTrend, entries, filterChannel, disputePublicDate]);

  if (chartData.length < 2) return null;

  const chColorMap = { media: colors.payorColor || "#2F65A7", social: "#059669", stakeholder: "#D86018", employer: "#8B6914" };
  const chColor = chColorMap[filterChannel] || colors.accent;
  const chLabelMap = { media: "MEDIA", social: "SOCIAL", stakeholder: "STAKEHOLDER", employer: "EMPLOYER" };
  const isOverlay = filterChannel !== "all" && channelTrend;

  const allVals = chartData.filter((d) => d.composite !== null).map((d) => d.composite);
  const chVals = chartData.filter((d) => d.channel !== null).map((d) => d.channel);
  const combined = [...allVals, ...chVals];
  const maxAbs = Math.max(Math.abs(Math.min(...combined)), Math.abs(Math.max(...combined)), 30);

  const lastPreDate = chartData.filter((d) => d.phase === "pre").slice(-1)[0]?.date;
  const firstPostDate = chartData.find((d) => d.phase === "post")?.date;
  const preCount = chartData.filter((d) => d.phase === "pre").length;

  const ScoreDot = ({ cx, cy, payload, dataKey, color: dotColor2 }) => {
    if (cx == null || cy == null) return null;
    const val = payload[dataKey];
    if (val == null) return null;
    const dotColor = dataKey === "channel" ? dotColor2 : (val > 10 ? colors.providerColor : val < -10 ? colors.payorColor : colors.accent);
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={colors.bg} stroke={dotColor} strokeWidth={2} />
        <text x={cx} y={cy - 10} textAnchor="middle" fill={dotColor} fontSize="13" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
          {val > 0 ? "+" : ""}{val.toFixed(0)}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    if (d.composite === null) return null;
    return (
      <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div style={{ color: colors.textMuted, marginBottom: 4 }}>{d.date} · n={d.count} {d.phase === "pre" ? "· PRE-PUBLIC" : ""}</div>
        <div style={{ color: d.composite > 10 ? colors.providerColor : d.composite < -10 ? colors.payorColor : colors.accent, fontWeight: 700 }}>
          Composite: {d.composite > 0 ? "+" : ""}{d.composite.toFixed(1)}
        </div>
        {d.channel !== null && (
          <div style={{ color: chColor, fontWeight: 700, marginTop: 2 }}>
            {chLabelMap[filterChannel]}: {d.channel > 0 ? "+" : ""}{d.channel.toFixed(1)}
          </div>
        )}
        {d.volume > 0 && <div style={{ color: colors.textMuted, marginTop: 2 }}>Volume: {d.volume} entries</div>}
      </div>
    );
  };

  const CustomTick = ({ x, y, payload }) => {
    const d = chartData.find((p) => p.date === payload.value);
    const isPre = d && d.phase === "pre";
    return (
      <text x={x} y={y + 12} textAnchor="middle" fill={isPre ? "rgba(0,0,0,0.2)" : colors.textMuted} fontSize={13} fontFamily="'JetBrains Mono', monospace" fontStyle={isPre ? "italic" : "normal"}>
        {d ? d.label : ""}
      </text>
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          NARRATIVE MOMENTUM — CUMULATIVE COMPOSITE OVER TIME
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          {preCount > 0 && (
            <span style={{ color: "rgba(0,0,0,0.3)", fontStyle: "italic" }}>
              {preCount} pre-public
            </span>
          )}
          {isOverlay && (
            <>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 16, height: 2, background: colors.accent, display: "inline-block", borderRadius: 1 }} />
                <span style={{ color: colors.textMuted }}>ALL</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 16, height: 3, background: chColor, display: "inline-block", borderRadius: 1 }} />
                <span style={{ color: chColor, fontWeight: 700 }}>{chLabelMap[filterChannel]}</span>
              </span>
            </>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 12, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id={gradientId + "_area"} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.providerColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colors.providerColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />
          <XAxis
            dataKey="date"
            tick={<CustomTick />}
            axisLine={{ stroke: colors.border }}
            tickLine={false}
            interval={chartData.length > 15 ? Math.floor(chartData.length / 8) : 0}
          />
          <YAxis
            domain={[-maxAbs, maxAbs]}
            ticks={[maxAbs, 0, -maxAbs]}
            tick={{ fill: colors.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v > 0 ? providerFavLabel : v < 0 ? payorFavLabel : "NEUTRAL"}
            width={config.yAxisWidth || 78}
          />
          <YAxis yAxisId="vol" hide domain={[0, "auto"]} orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke={colors.textMuted} strokeWidth={1} opacity={0.5} />
          {firstPostDate && (
            <ReferenceLine x={firstPostDate} stroke="#D86018" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.8}>
              <Label value="DISPUTE PUBLIC" position="insideTopLeft" fill="#D86018" fontSize={12} fontFamily="'JetBrains Mono', monospace" fontWeight={700} offset={6} />
            </ReferenceLine>
          )}
          <Bar dataKey="volume" fill="rgba(0,0,0,0.06)" radius={[2, 2, 0, 0]} barSize={10} yAxisId="vol" />
          <Area
            type="monotone"
            dataKey="composite"
            stroke="none"
            fill={`url(#${gradientId}_area)`}
            baseValue={0}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="composite"
            stroke={colors.accent}
            strokeWidth={isOverlay ? 1.5 : 2.5}
            dot={isOverlay ? { r: 2, fill: colors.bg, stroke: colors.accent, strokeWidth: 2 } : (props) => <ScoreDot {...props} dataKey="composite" />}
            opacity={isOverlay ? 0.4 : 1}
            isAnimationActive={false}
            connectNulls={false}
          />
          {isOverlay && (
            <Line
              type="monotone"
              dataKey="channel"
              stroke={chColor}
              strokeWidth={2.5}
              dot={(props) => <ScoreDot {...props} dataKey="channel" color={chColor} />}
              connectNulls
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// === EXECUTIVE SUMMARY ===

function ExecutiveSummary({ entries, filterChannel, scores, config }) {
  const [expanded, setExpanded] = useState(false);
  const { providerKey, payorKey, providerName, payorName, providerShort, payorShort, colors, sourceWeights } = config;
  const gw = (e) => getWeight(e, sourceWeights);

  const channelScores = useMemo(() => {
    const ch = {};
    ["media", "social", "stakeholder", "employer"].forEach((c) => {
      const ce = entries.filter((e) => e.channel === c);
      ch[c] = ce.length >= 2 ? computeScores(ce, config) : null;
    });
    return ch;
  }, [entries, config]);

  const momentum = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    if (mid < 3) return null;
    const early = computeScores(sorted.slice(0, mid), config);
    const late = computeScores(sorted.slice(mid), config);
    return { early: early.composite, late: late.composite, shift: late.composite - early.composite };
  }, [entries, config]);

  const topPatientStories = useMemo(() => {
    return entries
      .filter((e) => e.patientStory && gw(e) >= 1.0)
      .sort((a, b) => gw(b) - gw(a))
      .slice(0, 3);
  }, [entries, sourceWeights]);

  const trendDrivers = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    if (mid < 3) return null;
    const early = sorted.slice(0, mid);
    const late = sorted.slice(mid);
    const earlyScores = computeScores(early, config);
    const lateScores = computeScores(late, config);

    const dims = [
      { name: "Frame Adoption", key: "frameScore", weight: "30%", early: earlyScores.frameScore, late: lateScores.frameScore },
      { name: "Sentiment", key: "sentScore", weight: "30%", early: earlyScores.sentScore, late: lateScores.sentScore },
      { name: "Blame Direction", key: "blameScore", weight: "25%", early: earlyScores.blameScore, late: lateScores.blameScore },
      { name: "Patient Stories", key: "patientScore", weight: "15%", early: earlyScores.patientScore, late: lateScores.patientScore },
    ];
    const dimShifts = dims
      .map((d) => ({ ...d, shift: d.late - d.early }))
      .filter((d) => Math.abs(d.shift) > 3)
      .sort((a, b) => Math.abs(b.shift) - Math.abs(a.shift));

    const channelMomentum = [];
    ["media", "social", "stakeholder", "employer"].forEach((ch) => {
      const chEarly = early.filter((e) => e.channel === ch);
      const chLate = late.filter((e) => e.channel === ch);
      if (chEarly.length < 2 || chLate.length < 2) return;
      const eScores = computeScores(chEarly, config);
      const lScores = computeScores(chLate, config);
      const shift = lScores.composite - eScores.composite;
      if (Math.abs(shift) > 5) {
        const label = ch.charAt(0).toUpperCase() + ch.slice(1);
        const drivers = [];
        const frameDiff = lScores.frameScore - eScores.frameScore;
        const sentDiff = lScores.sentScore - eScores.sentScore;
        const blameDiff = lScores.blameScore - eScores.blameScore;
        const patDiff = lScores.patientScore - eScores.patientScore;
        if (Math.abs(frameDiff) > 5) drivers.push(`frame adoption ${frameDiff > 0 ? `shifting toward ${providerShort}` : `shifting toward ${payorShort}`} (${frameDiff > 0 ? "+" : ""}${frameDiff.toFixed(0)})`);
        if (Math.abs(sentDiff) > 5) drivers.push(`sentiment ${sentDiff > 0 ? `turning more anti-${payorShort}` : `turning more anti-${providerShort}`} (${sentDiff > 0 ? "+" : ""}${sentDiff.toFixed(0)})`);
        if (Math.abs(blameDiff) > 5) drivers.push(`blame direction ${blameDiff > 0 ? `increasingly on ${payorShort}` : `increasingly on ${providerShort}`} (${blameDiff > 0 ? "+" : ""}${blameDiff.toFixed(0)})`);
        if (Math.abs(patDiff) > 5) drivers.push(`patient story saturation ${patDiff > 0 ? "increasing" : "decreasing"} (${patDiff > 0 ? "+" : ""}${patDiff.toFixed(0)})`);

        const earlySourceSet = new Set(chEarly.map((e) => e.source));
        const newSources = [...new Set(chLate.filter((e) => !earlySourceSet.has(e.source) && gw(e) >= 1.0).map((e) => e.source))];

        channelMomentum.push({ channel: label, shift, early: eScores.composite, late: lScores.composite, drivers, newSources, earlyCount: chEarly.length, lateCount: chLate.length });
      }
    });

    const topLateEntries = late
      .sort((a, b) => gw(b) - gw(a))
      .slice(0, 5)
      .map((e) => ({ source: e.source, headline: e.headline, weight: gw(e), frame: e.frameAdoption, blame: e.blameDirection }));

    return { dimShifts, channelMomentum, topLateEntries, earlyRange: `${early[0].date} – ${early[early.length - 1].date}`, lateRange: `${late[0].date} – ${late[late.length - 1].date}` };
  }, [entries, config]);

  const divergences = useMemo(() => {
    const results = [];
    ["media", "social", "stakeholder", "employer"].forEach((c) => {
      const cs = channelScores[c];
      if (!cs) return;
      const diff = cs.composite - scores.composite;
      if (Math.abs(diff) > 8) {
        const label = c.charAt(0).toUpperCase() + c.slice(1);
        const dir = diff > 0 ? `more favorable to ${providerName}` : `more favorable to ${payorName}`;
        results.push({ channel: label, diff, dir, score: cs.composite });
      }
    });
    return results;
  }, [channelScores, scores, providerName, payorName]);

  const keyMessages = useMemo(() => {
    const msgs = [];
    const provFrame = entries.filter((e) => e.frameAdoption === providerKey);
    const payFrame = entries.filter((e) => e.frameAdoption === payorKey);
    const provW = provFrame.reduce((s, e) => s + gw(e), 0);
    const payW = payFrame.reduce((s, e) => s + gw(e), 0);
    if (provW > payW * 1.3) msgs.push(`${providerName}'s narrative frame leads across credible sources`);
    const patientEntries = entries.filter((e) => e.patientStory);
    const patientProv = patientEntries.filter((e) => e.blameDirection === payorKey).length;
    const patientPay = patientEntries.filter((e) => e.blameDirection === providerKey).length;
    if (patientProv > patientPay) msgs.push(`Patient stories skew pro-${providerShort} (${patientProv} blame ${payorShort} vs ${patientPay} blame ${providerShort})`);
    return msgs;
  }, [entries, providerKey, payorKey, providerName, providerShort, payorShort, sourceWeights]);

  const fmtScore = (v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}`;
  const S = { section: { marginBottom: 12 }, label: { fontSize: 9, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, fontWeight: 700 }, body: { fontSize: 13, color: colors.text, lineHeight: 1.7 }, bullet: { fontSize: 12, color: colors.text, lineHeight: 1.8, margin: 0, paddingLeft: 16 }, accent: { color: colors.accent, fontWeight: 600 }, warn: { color: colors.payorColor, fontWeight: 600 }, muted: { color: colors.textMuted, fontSize: 11 } };

  // Channel-specific takeaways
  if (filterChannel !== "all") {
    const cs = channelScores[filterChannel];
    if (!cs) return null;
    const label = filterChannel.charAt(0).toUpperCase() + filterChannel.slice(1);
    const allScores = computeScores(entries, config);
    const diff = cs.composite - allScores.composite;
    const diffDir = diff > 5 ? `stronger for ${providerName}` : diff < -5 ? `stronger for ${payorName}` : "roughly aligned with";

    const channelEntries = entries.filter((e) => e.channel === filterChannel);
    const topSources = {};
    channelEntries.forEach((e) => { topSources[e.source] = (topSources[e.source] || 0) + gw(e); });
    const sortedSources = Object.entries(topSources).sort((a, b) => b[1] - a[1]).slice(0, 3);

    const takeaways = config.channelTakeaways?.[filterChannel] || [];

    return (
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
        <div style={S.label}>EXECUTIVE BRIEF — {label.toUpperCase()} CHANNEL</div>
        <div style={S.body}>
          <span style={S.accent}>{label} composite: {fmtScore(cs.composite)}</span> — {diffDir} the overall score ({fmtScore(allScores.composite)}).
          {channelEntries.length} entries tracked in this channel.
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
            color: colors.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
            padding: "8px 0 4px", letterSpacing: 1,
          }}
        >
          <span style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", display: "inline-block" }}>▶</span>
          {expanded ? "COLLAPSE" : "EXPAND DETAILS"}
        </button>
        {expanded && (
          <>
            <div style={{ ...S.label, marginTop: 10 }}>TOP SOURCES BY WEIGHTED INFLUENCE</div>
            <ul style={{ ...S.bullet, listStyle: "none" }}>
              {sortedSources.map(([src, w]) => <li key={src}>▸ {src} <span style={S.muted}>(cumulative weight: {w.toFixed(1)})</span></li>)}
            </ul>
            {takeaways.length > 0 && (
              <>
                <div style={{ ...S.label, marginTop: 14 }}>KEY TAKEAWAYS</div>
                <ul style={{ ...S.bullet, listStyle: "none" }}>
                  {takeaways.map((t, i) => <li key={i} style={{ marginBottom: 4 }}>▸ {t}</li>)}
                </ul>
              </>
            )}
            {trendDrivers && trendDrivers.channelMomentum.filter((cm) => cm.channel.toLowerCase() === filterChannel).length > 0 && (
              <>
                <div style={{ ...S.label, marginTop: 14 }}>TREND DRIVERS</div>
                {trendDrivers.channelMomentum.filter((cm) => cm.channel.toLowerCase() === filterChannel).map((cm) => (
                  <div key={cm.channel}>
                    <div style={{ ...S.body, marginBottom: 6 }}>
                      This channel moved <span style={cm.shift > 0 ? S.accent : S.warn}>{cm.shift > 0 ? "+" : ""}{cm.shift.toFixed(0)} pts</span> from early ({fmtScore(cm.early)}) to recent ({fmtScore(cm.late)}) coverage.
                    </div>
                    {cm.drivers.length > 0 && (
                      <ul style={{ ...S.bullet, listStyle: "none" }}>
                        {cm.drivers.map((d, i) => <li key={i} style={{ marginBottom: 3 }}>▸ {d}</li>)}
                      </ul>
                    )}
                    {cm.newSources.length > 0 && (
                      <div style={{ ...S.body, marginTop: 4 }}>
                        New high-credibility sources: <span style={S.muted}>{cm.newSources.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // Overall executive summary
  const summaryText = config.executiveSummary || {};

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
      <div style={S.label}>EXECUTIVE SUMMARY</div>
      <div style={{ ...S.body, marginBottom: 0 }}>
        <span style={S.accent}>{providerName} holds a narrative advantage</span> with a credibility-weighted composite of <strong>{fmtScore(scores.composite)}</strong>.
        {momentum && momentum.shift > 5 && <> Momentum is <span style={S.accent}>building for {providerShort}</span> — recent coverage scores {fmtScore(momentum.late)} vs {fmtScore(momentum.early)} in earlier coverage.</>}
        {momentum && momentum.shift < -5 && <> Momentum is <span style={S.warn}>shifting toward {payorShort}</span> — recent coverage scores {fmtScore(momentum.late)} vs {fmtScore(momentum.early)} earlier.</>}
        {momentum && Math.abs(momentum.shift) <= 5 && <> Momentum is <strong>holding steady</strong> — no significant shift between early and recent coverage.</>}
        {summaryText.statement && <> {summaryText.statement}</>}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
          color: colors.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
          padding: "8px 0 4px", letterSpacing: 1,
        }}
      >
        <span style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", display: "inline-block" }}>▶</span>
        {expanded ? "COLLAPSE" : "EXPAND DETAILS"}
      </button>

      {expanded && trendDrivers && (trendDrivers.dimShifts.length > 0 || trendDrivers.channelMomentum.length > 0) && (
        <div style={S.section}>
          <div style={S.label}>TREND DRIVERS — WHAT'S CAUSING THE SHIFT</div>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8 }}>
            Comparing early period ({trendDrivers.earlyRange}) vs recent period ({trendDrivers.lateRange})
          </div>
          {trendDrivers.dimShifts.length > 0 && (
            <>
              <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, marginTop: 8 }}>DIMENSION SHIFTS</div>
              <ul style={{ ...S.bullet, listStyle: "none" }}>
                {trendDrivers.dimShifts.map((d) => (
                  <li key={d.name} style={{ marginBottom: 4 }}>
                    ▸ <strong>{d.name}</strong> ({d.weight}): moved <span style={d.shift > 0 ? S.accent : S.warn}>{d.shift > 0 ? "+" : ""}{d.shift.toFixed(0)} pts</span> — from {fmtScore(d.early)} to {fmtScore(d.late)}.
                    {d.key === "frameScore" && d.shift > 0 && ` More recent coverage is adopting ${providerName}'s framing.`}
                    {d.key === "frameScore" && d.shift < 0 && ` ${payorName}'s framing is gaining traction in recent coverage.`}
                    {d.key === "sentScore" && d.shift > 0 && ` Recent tone has turned more critical of ${payorShort}.`}
                    {d.key === "sentScore" && d.shift < 0 && ` Recent tone has softened toward ${payorShort} or hardened toward ${providerShort}.`}
                    {d.key === "blameScore" && d.shift > 0 && ` Sources are increasingly holding ${payorShort} responsible.`}
                    {d.key === "blameScore" && d.shift < 0 && ` Blame is shifting toward ${providerName} in recent coverage.`}
                    {d.key === "patientScore" && d.shift > 0 && " Patient stories are appearing more frequently, reinforcing the human cost narrative."}
                    {d.key === "patientScore" && d.shift < 0 && " Fewer patient stories in recent coverage — the human angle is fading."}
                  </li>
                ))}
              </ul>
            </>
          )}
          {trendDrivers.channelMomentum.length > 0 && (
            <>
              <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, marginTop: 12 }}>CHANNEL MOMENTUM</div>
              <ul style={{ ...S.bullet, listStyle: "none" }}>
                {trendDrivers.channelMomentum.map((cm) => (
                  <li key={cm.channel} style={{ marginBottom: 6 }}>
                    ▸ <strong>{cm.channel}</strong>: <span style={cm.shift > 0 ? S.accent : S.warn}>{cm.shift > 0 ? "+" : ""}{cm.shift.toFixed(0)} pts</span> ({fmtScore(cm.early)} → {fmtScore(cm.late)}, {cm.earlyCount} → {cm.lateCount} entries).
                    {cm.drivers.length > 0 && <> Driven by: {cm.drivers.join("; ")}.</>}
                    {cm.newSources.length > 0 && <> New high-credibility sources entering: <span style={S.muted}>{cm.newSources.join(", ")}</span>.</>}
                  </li>
                ))}
              </ul>
            </>
          )}
          {trendDrivers.topLateEntries.length > 0 && (
            <>
              <div style={{ fontSize: 10, letterSpacing: 1, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, marginTop: 12 }}>HIGHEST-IMPACT RECENT ENTRIES</div>
              <ul style={{ ...S.bullet, listStyle: "none" }}>
                {trendDrivers.topLateEntries.map((e, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>
                    ▸ <span style={S.muted}>{e.weight.toFixed(1)}x</span> {e.source} — <em>{e.headline.length > 80 ? e.headline.slice(0, 80) + "…" : e.headline}</em>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {expanded && divergences.length > 0 && (
        <div style={S.section}>
          <div style={S.label}>CHANNEL DIVERGENCES</div>
          <ul style={{ ...S.bullet, listStyle: "none" }}>
            {divergences.map((d) => (
              <li key={d.channel} style={{ marginBottom: 2 }}>
                ▸ <strong>{d.channel}</strong> ({fmtScore(d.score)}) is {d.dir} than the overall composite — {
                  d.diff > 0 ? `amplifying ${providerShort}'s advantage` : "partially offsetting it"
                }.
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && (
        <div style={S.section}>
          <div style={S.label}>KEY MESSAGES RESONATING</div>
          <ul style={{ ...S.bullet, listStyle: "none" }}>
            {keyMessages.map((m, i) => <li key={i} style={{ marginBottom: 2 }}>▸ {m}</li>)}
            {(summaryText.keyMessages || []).map((m, i) => <li key={`km${i}`} style={{ marginBottom: 2 }}>▸ {m}</li>)}
            {topPatientStories.length > 0 && (
              <li style={{ marginBottom: 2 }}>▸ Top patient stories: {topPatientStories.map((e) => e.headline.split("—")[0].trim()).join("; ")}.</li>
            )}
          </ul>
        </div>
      )}

      {expanded && summaryText.marcomm && (
        <div style={S.section}>
          <div style={S.label}>MARCOMM CONSIDERATIONS</div>
          <ul style={{ ...S.bullet, listStyle: "none" }}>
            {summaryText.marcomm.map((m, i) => <li key={i} style={{ marginBottom: 2 }}>▸ {m}</li>)}
            {channelScores.social && channelScores.media && Math.abs(channelScores.social.composite - channelScores.media.composite) > 15 && (
              <li style={{ marginBottom: 2 }}>▸ <strong>Social-media gap:</strong> Social ({fmtScore(channelScores.social.composite)}) diverges from media ({fmtScore(channelScores.media.composite)}) — {
                channelScores.social.composite > channelScores.media.composite
                  ? "grassroots anger is running hotter than press coverage reflects."
                  : "media coverage is more favorable than organic conversation."
              }</li>
            )}
          </ul>
        </div>
      )}

      {expanded && config.complaintData && (
        <div style={S.section}>
          <div style={S.label}>REGULATORY & COMPLAINT SIGNAL</div>
          <ul style={{ ...S.bullet, listStyle: "none" }}>
            <li style={{ marginBottom: 4 }}>▸ <strong>NAIC Complaint Index:</strong> {payorName}'s complaint index is <span style={S.warn}>{config.complaintData.insurerIndex}x</span> the national median ({config.complaintData.nationalMedian}x).</li>
            <li style={{ marginBottom: 4 }}>▸ <strong>Network adequacy complaints:</strong> {config.complaintData.networkComplaints} YTD vs {config.complaintData.priorYearComplaints} same period prior year — a <span style={S.warn}>{((config.complaintData.networkComplaints / config.complaintData.priorYearComplaints - 1) * 100).toFixed(0)}% increase</span> since the dispute became public.</li>
            <li style={{ marginBottom: 4 }}>▸ <strong>Regulatory status:</strong> {config.complaintData.regulatorAction}</li>
            {config.complaintData.signalRead && <li style={{ marginBottom: 4 }}>▸ <strong>Signal read:</strong> {config.complaintData.signalRead}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

// === DISPLAY COMPONENTS ===

function ScoreGauge({ value, label, subtext, config }) {
  const { colors, providerShort, payorShort } = config;
  const clamped = Math.max(-100, Math.min(100, value));
  const pct = ((clamped + 100) / 200) * 100;
  const color = clamped > 15 ? colors.providerColor : clamped < -15 ? colors.payorColor : colors.accent;
  const winner = clamped > 10 ? `→ ${providerShort} Advantage` : clamped < -10 ? `→ ${payorShort} Advantage` : "→ Contested";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        <span style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {clamped > 0 ? "+" : ""}
          {clamped.toFixed(0)} {winner}
        </span>
      </div>
      <div style={{ height: 8, background: colors.border, borderRadius: 4, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: colors.textMuted, opacity: 0.4, zIndex: 2 }} />
        <div
          style={{
            position: "absolute",
            left: clamped >= 0 ? "50%" : `${pct}%`,
            width: `${Math.abs(clamped) / 2}%`,
            top: 0, bottom: 0,
            background: color,
            borderRadius: 4,
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: colors.textMuted }}>{payorShort} Winning</span>
        <span style={{ fontSize: 10, color: colors.textMuted }}>{subtext}</span>
        <span style={{ fontSize: 10, color: colors.textMuted }}>{providerShort} Winning</span>
      </div>
    </div>
  );
}

function DisputeTimeline({ config }) {
  const { timeline, colors } = config;
  if (!timeline || timeline.length === 0) return null;

  const sorted = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date));

  const typeStyles = {
    newsBreak: { color: "#E87722", label: "News Breaks" },
    termination: { color: "#DC2626", label: "Termination Date" },
    extension: { color: "#7C3AED", label: "Extension" },
    agreement: { color: "#16A34A", label: "Agreement Reached" },
    other: { color: colors.textMuted, label: "Other" },
  };

  const fmt = (d) => {
    const dt = new Date(d + "T12:00:00");
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Group events that share the same date
  const groups = [];
  sorted.forEach((evt) => {
    const last = groups[groups.length - 1];
    if (last && last[0].date === evt.date) {
      last.push(evt);
    } else {
      groups.push([evt]);
    }
  });

  const count = groups.length;

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "16px 24px", marginBottom: 20 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
        DISPUTE TIMELINE
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {groups.map((group, gi) => {
          const isMulti = group.length > 1;
          return (
            <div key={gi} style={{ display: "flex", alignItems: "center", flex: gi < count - 1 ? 1 : "none" }}>
              {/* Node */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0, flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: colors.textMuted, marginBottom: 4, whiteSpace: "nowrap" }}>
                  {fmt(group[0].date)}
                </div>
                {isMulti ? (
                  <div style={{ position: "relative", width: 18, height: 18 }}>
                    {group.map((evt, ei) => {
                      const s = typeStyles[evt.type] || typeStyles.other;
                      return (
                        <div key={ei} style={{
                          position: "absolute",
                          width: 14, height: 14, borderRadius: "50%", background: s.color,
                          border: `2px solid ${colors.bg}`, boxShadow: `0 0 0 1px ${s.color}40`,
                          top: 2, left: ei * 6,
                          zIndex: group.length - ei,
                        }} />
                      );
                    })}
                  </div>
                ) : (
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: (typeStyles[group[0].type] || typeStyles.other).color,
                    border: `2px solid ${colors.bg}`,
                    boxShadow: `0 0 0 1px ${(typeStyles[group[0].type] || typeStyles.other).color}40`,
                  }} />
                )}
                <div style={{ marginTop: 4, textAlign: "center", maxWidth: 110 }}>
                  {group.map((evt, ei) => {
                    const s = typeStyles[evt.type] || typeStyles.other;
                    return (
                      <div key={ei} style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 600, lineHeight: 1.3 }}>
                        {evt.label}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Connector line */}
              {gi < count - 1 && (
                <div style={{ flex: 1, height: 2, background: colors.border, minWidth: 12, alignSelf: "center", marginTop: -14 }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        {Object.entries(typeStyles).filter(([k]) => sorted.some(e => e.type === k)).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: colors.textMuted }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />
            {v.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArgumentsSection({ config }) {
  const { colors, providerShort, payorShort, arguments: args } = config;
  if (!args) return null;

  const renderPhases = (phases, accentColor) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {phases.map((phase, i) => (
        <div key={i} style={{ position: "relative", paddingLeft: 16 }}>
          <div style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: "50%", background: accentColor }} />
          {phases.length > 1 && i < phases.length - 1 && (
            <div style={{ position: "absolute", left: 2.5, top: 14, width: 1, bottom: -10, background: `${accentColor}30` }} />
          )}
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: accentColor, fontWeight: 700, marginBottom: 2 }}>
            {phase.phase}
          </div>
          <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, lineHeight: 1.6, color: colors.text }}>
            {phase.points.map((pt, j) => (
              <li key={j} style={{ marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: pt }} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          {payorShort} ARGUMENTS
        </div>
        {renderPhases(args.payor, colors.payorColor)}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          {providerShort} ARGUMENTS
        </div>
        {renderPhases(args.provider, colors.providerColor)}
      </div>
    </div>
  );
}

function DistBar({ label, values, barColors, labels: segLabels, config }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: config.colors.textMuted, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
      <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 1 }}>
        {values.map((v, i) =>
          v > 0 ? (
            <div
              key={i}
              style={{
                width: `${(v / total) * 100}%`,
                background: barColors[i],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: v > 0 ? 28 : 0,
              }}
            >
              {v} {segLabels[i]}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

function EntryRow({ entry, onDelete, config }) {
  const { colors, providerKey, payorKey, labels } = config;
  const sentColor =
    entry.sentiment === `negative_${payorKey}` || entry.sentiment === `positive_${providerKey}`
      ? colors.providerColor
      : entry.sentiment === `negative_${providerKey}` || entry.sentiment === `positive_${payorKey}`
      ? colors.payorColor
      : colors.textMuted;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 100px 90px 90px 36px",
        gap: 8,
        padding: "10px 12px",
        borderBottom: `1px solid ${colors.border}`,
        alignItems: "center",
        fontSize: 12,
        color: colors.text,
      }}
    >
      <span style={{ color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{entry.date}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{entry.headline || entry.source}</div>
        <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, textDecoration: "none", borderBottom: `1px solid ${colors.accent}40` }}>
              {entry.source}
            </a>
          ) : entry.source} · {labels.sourceType[entry.sourceType]} {entry.patientStory ? " · 👤 Patient story" : ""}
        </div>
        {entry.notes && <div style={{ color: colors.textMuted, fontSize: 10, marginTop: 3, fontStyle: "italic", lineHeight: 1.4 }}>{entry.notes}</div>}
      </div>
      <span
        style={{
          fontSize: 10,
          padding: "3px 8px",
          borderRadius: 3,
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          background: "transparent",
          border: `1px solid ${entry.frameAdoption === providerKey ? colors.accent : entry.frameAdoption === payorKey ? colors.payorColor : colors.border}`,
          color: entry.frameAdoption === providerKey ? colors.accent : entry.frameAdoption === payorKey ? colors.payorColor : colors.textMuted,
          textAlign: "center",
        }}
      >
        {labels.frameAdoption[entry.frameAdoption]}
      </span>
      <span style={{ color: sentColor, fontWeight: 600, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
        {labels.sentiment[entry.sentiment]}
      </span>
      <span style={{ fontSize: 10, color: colors.textMuted }}>{labels.reachEstimate[entry.reachEstimate]} reach</span>
      <button
        onClick={() => onDelete(entry.id)}
        style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: 14, padding: 2 }}
        title="Remove entry"
      >
        ✕
      </button>
    </div>
  );
}

// === MAIN DASHBOARD ===

function EntryLogs({ entries, filterChannel, onDelete, config }) {
  const { colors } = config;
  const [expanded, setExpanded] = useState({});
  const channels = filterChannel === "all" ? ["media", "social", "stakeholder", "employer"] : [filterChannel];
  const isAll = filterChannel === "all";

  return channels.map((ch) => {
    const chEntries = entries.filter((e) => e.channel === ch).sort((a, b) => b.date.localeCompare(a.date));
    if (chEntries.length === 0) return null;
    const chLabel = ch === "media" ? "MEDIA" : ch === "social" ? "SOCIAL / FORUM" : ch === "stakeholder" ? "STAKEHOLDER" : "EMPLOYER";
    const chColor = ch === "media" ? (colors.payorColor || "#2F65A7") : ch === "social" ? "#059669" : ch === "stakeholder" ? "#D86018" : "#8B6914";
    const isOpen = isAll ? !!expanded[ch] : true;

    return (
      <div key={ch} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        <div
          onClick={isAll ? () => setExpanded((prev) => ({ ...prev, [ch]: !prev[ch] })) : undefined}
          style={{
            padding: "12px 16px",
            borderBottom: isOpen ? `1px solid ${colors.border}` : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: isAll ? "pointer" : "default",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isAll && (
              <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", transition: "transform 0.15s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                &#9654;
              </span>
            )}
            <span style={{ width: 8, height: 8, borderRadius: 2, background: chColor, display: "inline-block" }} />
            <span style={{ fontSize: 11, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{chLabel} LOG</span>
          </div>
          <span style={{ fontSize: 11, color: colors.textMuted }}>{chEntries.length} entries</span>
        </div>
        {isOpen && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr 100px 90px 90px 36px",
                gap: 8,
                padding: "8px 12px",
                borderBottom: `1px solid ${colors.border}`,
                fontSize: 10,
                color: colors.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: 0.5,
              }}
            >
              <span>DATE</span>
              <span>SOURCE / HEADLINE</span>
              <span>FRAME</span>
              <span>SENTIMENT</span>
              <span>REACH</span>
              <span></span>
            </div>
            {chEntries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} onDelete={onDelete} config={config} />
            ))}
          </>
        )}
      </div>
    );
  });
}

export default function WarRoomDashboard({ config }) {
  const { providerName, payorName, providerShort, payorShort, colors, labels, entries: initialEntries } = config;
  const [entries, setEntries] = useState(initialEntries);
  const [filterChannel, setFilterChannel] = useState("all");

  const filtered = useMemo(
    () => (filterChannel === "all" ? entries : entries.filter((e) => e.channel === filterChannel)),
    [entries, filterChannel]
  );
  const scores = useMemo(() => computeScores(filtered, config), [filtered, config]);

  const deleteEntry = useCallback((id) => setEntries((prev) => prev.filter((e) => e.id !== id)), []);

  const compositeColor = scores.composite > 15 ? colors.providerColor : scores.composite < -15 ? colors.payorColor : colors.accent;
  const compositeLabel = scores.composite > 15 ? providerName.toUpperCase() : scores.composite < -15 ? payorName.toUpperCase() : "CONTESTED";

  const distColors = config.distColors || [colors.providerColor, "#465E85", colors.payorColor];

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        minHeight: "100vh",
        fontFamily: "'Source Serif 4', Georgia, serif",
        padding: "24px 20px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: colors.accent, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            NARRATIVE INTELLIGENCE
          </span>
          <span style={{ height: 1, flex: 1, background: colors.border }} />
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 }}>
          PR War Room <span style={{ color: colors.textMuted, fontWeight: 400 }}>— {config.title}</span>
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          {config.subtitle} · {filtered.length} entries tracked
        </p>
      </div>

      {/* Composite Score */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.surface}, ${colors.bg})`,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: compositeColor }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
              COMPOSITE NARRATIVE ADVANTAGE
            </div>
            <div style={{ fontSize: 9, color: "rgba(0,0,0,0.25)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              Monitoring period: {config.monitorStart} — {config.monitorEnd || "Present"}
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: compositeColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {scores.composite > 0 ? "+" : ""}
              {scores.composite.toFixed(1)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: compositeColor, marginTop: 4 }}>{compositeLabel}</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: colors.textMuted, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>Frame Adoption (30%): <span style={{ color: colors.text }}>{scores.frameScore > 0 ? "+" : ""}{scores.frameScore.toFixed(0)}</span></div>
            <div>Sentiment (30%): <span style={{ color: colors.text }}>{scores.sentScore > 0 ? "+" : ""}{scores.sentScore.toFixed(0)}</span></div>
            <div>Blame Direction (25%): <span style={{ color: colors.text }}>{scores.blameScore > 0 ? "+" : ""}{scores.blameScore.toFixed(0)}</span></div>
            <div>Patient Story Saturation (15%): <span style={{ color: colors.text }}>{scores.patientScore.toFixed(0)}%</span></div>
          </div>
        </div>
        <TrendChart entries={entries} filterChannel={filterChannel} config={config} />
        {config.searchTrends && config.searchTrends.length > 0 && <SearchTrendsChart entries={entries} config={config} />}
      </div>

      {/* Dispute Timeline */}
      <DisputeTimeline config={config} />

      {/* Arguments */}
      <ArgumentsSection config={config} />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[
          ["all", `All (${entries.length})`],
          ["media", `Media (${entries.filter((e) => e.channel === "media").length})`],
          ["social", `Social (${entries.filter((e) => e.channel === "social").length})`],
          ["stakeholder", `Stakeholder (${entries.filter((e) => e.channel === "stakeholder").length})`],
          ["employer", `Employer (${entries.filter((e) => e.channel === "employer").length})`],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilterChannel(k)}
            style={{
              padding: "6px 14px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: filterChannel === k ? colors.accent : colors.surface,
              color: filterChannel === k ? colors.bg : colors.textMuted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <ExecutiveSummary entries={entries} filterChannel={filterChannel} scores={scores} config={config} />

      {/* Gauges + Distributions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            DIMENSION SCORES
          </div>
          <ScoreGauge value={scores.frameScore} label="Frame Adoption" subtext="Whose numbers get cited?" config={config} />
          <ScoreGauge value={scores.sentScore} label="Sentiment" subtext="Tone of coverage" config={config} />
          <ScoreGauge value={scores.blameScore} label="Blame Direction" subtext="Who's the villain?" config={config} />
          <div style={{ marginTop: 8, padding: "8px 10px", background: colors.bg, borderRadius: 4, fontSize: 11, color: colors.textMuted }}>
            <strong style={{ color: colors.accent }}>Patient Story Saturation:</strong>{" "}
            {scores.patientStories}/{scores.total} entries ({scores.patientScore.toFixed(0)}%) — favors {providerShort} as provider
          </div>
        </div>

        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            DISTRIBUTIONS
          </div>
          <DistBar
            label="FRAME ADOPTION"
            values={[scores.frameProvider, scores.frameBalanced, scores.framePayor]}
            barColors={distColors}
            labels={[providerShort, "BAL", payorShort]}
            config={config}
          />
          <DistBar
            label="SENTIMENT"
            values={[scores.sentNegPayor, scores.sentNeutral, scores.sentNegProvider]}
            barColors={distColors}
            labels={[`Anti-${payorShort}`, "Neutral", `Anti-${providerShort}`]}
            config={config}
          />
          <DistBar
            label="BLAME DIRECTION"
            values={[scores.blamePayor, scores.blameBoth, scores.blameProvider]}
            barColors={distColors}
            labels={[payorShort, "Both", providerShort]}
            config={config}
          />
          <div style={{ marginTop: 16, padding: 12, background: colors.bg, borderRadius: 6, fontSize: 11, lineHeight: 1.7, color: colors.textMuted }}>
            <strong style={{ color: colors.accent }}>SCORING METHODOLOGY</strong>
            <br />
            Each dimension: (pro-{providerShort} count − pro-{payorShort} count) / total × 100
            <br />
            Positive = {providerShort} winning · Negative = {payorShort} winning
            <br />
            Composite = Frame(30%) + Sentiment(30%) + Blame(25%) + PatientStory(15%)
          </div>
        </div>
      </div>

      {/* Per-channel Entry Logs */}
      <EntryLogs entries={entries} filterChannel={filterChannel} onDelete={deleteEntry} config={config} />
    </div>
  );
}
