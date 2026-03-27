import { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { computeScores, computeTrend } from "./WarRoomDashboard.jsx";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Source Serif 4', Georgia, serif";

function MiniTrend({ config, weightOverrides }) {
  const data = useMemo(() => {
    const entries = config.entries || [];
    if (entries.length < 3) return [];
    return computeTrend(entries, config, weightOverrides, "decay");
  }, [config, weightOverrides]);

  if (data.length < 2) return <div style={{ width: 200, height: 48 }} />;

  const vals = data.map((d) => d.composite);
  const maxAbs = Math.max(Math.abs(Math.min(...vals)), Math.abs(Math.max(...vals)), 20);
  const lastVal = vals[vals.length - 1];
  const lineColor = lastVal > 10 ? config.colors.providerColor : lastVal < -10 ? config.colors.payorColor : (config.colors.accent || "#6366F1");

  return (
    <ResponsiveContainer width={200} height={48}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <YAxis domain={[-maxAbs, maxAbs]} hide />
        <Line
          type="monotone"
          dataKey="composite"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ScoreBadge({ value, config }) {
  const color = value > 10 ? config.colors.providerColor : value < -10 ? config.colors.payorColor : (config.colors.accent || "#6366F1");
  const bg = value > 10 ? `${config.colors.providerColor}18` : value < -10 ? `${config.colors.payorColor}18` : "rgba(99,102,241,0.08)";
  return (
    <div style={{
      fontFamily: MONO,
      fontSize: 18,
      fontWeight: 700,
      color,
      background: bg,
      borderRadius: 6,
      padding: "4px 12px",
      minWidth: 64,
      textAlign: "center",
    }}>
      {value > 0 ? "+" : ""}{value.toFixed(1)}
    </div>
  );
}

export default function Homepage({ dashboards, weightOverrides, onNavigate }) {
  const scored = useMemo(() => {
    return dashboards.map((d) => {
      const entries = d.config.entries || [];
      if (entries.length < 2) return { ...d, composite: 0, entryCount: entries.length };
      const trend = computeTrend(entries, d.config, weightOverrides, "decay");
      const last = trend.length > 0 ? trend[trend.length - 1].composite : 0;
      return { ...d, composite: last, entryCount: entries.length };
    }).sort((a, b) => Math.abs(b.composite) - Math.abs(a.composite));
  }, [dashboards, weightOverrides]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#94A3B8", fontFamily: MONO, fontWeight: 700, marginBottom: 6 }}>
          MARKET SENTIMENT TRACKER
        </div>
        <div style={{ fontSize: 22, fontFamily: SERIF, fontWeight: 600, color: "#1A1A2E" }}>
          Active Dispute Inventory
        </div>
        <div style={{ fontSize: 13, color: "#64748B", fontFamily: SERIF, marginTop: 4 }}>
          {scored.length} disputes tracked · sorted by narrative intensity
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 200px",
          gap: 16,
          padding: "8px 16px",
          alignItems: "center",
          fontSize: 9,
          letterSpacing: 1.2,
          color: "#94A3B8",
          fontFamily: MONO,
          fontWeight: 700,
        }}>
          <span>DISPUTE</span>
          <span style={{ textAlign: "center" }}>SCORE</span>
          <span style={{ textAlign: "center" }}>MOMENTUM</span>
        </div>

        {scored.map((d) => (
          <div
            key={d.id}
            onClick={() => onNavigate(d.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 200px",
              gap: 16,
              padding: "14px 16px",
              alignItems: "center",
              background: "#FAFBFC",
              border: "1px solid #EAEDF2",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FAFBFC"; e.currentTarget.style.borderColor = "#EAEDF2"; }}
          >
            <div>
              <div style={{ fontSize: 14, fontFamily: SERIF, fontWeight: 600, color: "#1A1A2E", marginBottom: 2 }}>
                {d.config.providerShort} vs. {d.config.payorShort}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: MONO }}>
                {d.entryCount} entries
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ScoreBadge value={d.composite} config={d.config} />
            </div>
            <MiniTrend config={d.config} weightOverrides={weightOverrides} />
          </div>
        ))}
      </div>
    </div>
  );
}
