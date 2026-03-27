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
  const lineColor = lastVal > 10 ? config.colors.providerColor : lastVal < -10 ? config.colors.payorColor : "#2593d0";

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
  const color = value > 10 ? config.colors.providerColor : value < -10 ? config.colors.payorColor : "#2593d0";
  const bg = value > 10 ? `${config.colors.providerColor}18` : value < -10 ? `${config.colors.payorColor}18` : "rgba(37,147,208,0.08)";
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

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export default function Homepage({ dashboards, weightOverrides, onNavigate }) {
  const scored = useMemo(() => {
    return dashboards.map((d) => {
      const entries = d.config.entries || [];
      if (entries.length < 2) return { ...d, composite: 0, entryCount: entries.length };
      const trend = computeTrend(entries, d.config, weightOverrides, "decay");
      const last = trend.length > 0 ? trend[trend.length - 1].composite : 0;
      return { ...d, composite: last, entryCount: entries.length };
    }).sort((a, b) => (b.config.disputePublicDate || "").localeCompare(a.config.disputePublicDate || ""));
  }, [dashboards, weightOverrides]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#93c4e3", fontFamily: MONO, fontWeight: 700, marginBottom: 6 }}>
          MARKET SENTIMENT TRACKER
        </div>
        <div style={{ fontSize: 22, fontFamily: SERIF, fontWeight: 600, color: "#053b57" }}>
          Active Dispute Inventory
        </div>
        <div style={{ fontSize: 13, color: "#5D7380", fontFamily: SERIF, marginTop: 4 }}>
          {scored.length} disputes tracked · sorted by recency
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 100px 80px 200px",
          gap: 16,
          padding: "8px 16px",
          alignItems: "center",
          fontSize: 9,
          letterSpacing: 1.2,
          color: "#93c4e3",
          fontFamily: MONO,
          fontWeight: 700,
        }}>
          <span>DISPUTE</span>
          <span style={{ textAlign: "center" }}>STATUS</span>
          <span style={{ textAlign: "center" }}>PUBLIC DATE</span>
          <span style={{ textAlign: "center" }}>SCORE</span>
          <span style={{ textAlign: "center" }}>MOMENTUM</span>
        </div>

        {scored.map((d) => (
          <div
            key={d.id}
            onClick={() => onNavigate(d.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 100px 80px 200px",
              gap: 16,
              padding: "14px 16px",
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #D7E8F7",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f2f7fb"; e.currentTarget.style.borderColor = "#93c4e3"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "#D7E8F7"; }}
          >
            <div>
              <div style={{ fontSize: 14, fontFamily: SERIF, fontWeight: 600, color: "#053b57", marginBottom: 2 }}>
                {d.config.providerShort} vs. {d.config.payorShort}
              </div>
              <div style={{ fontSize: 11, color: "#93c4e3", fontFamily: MONO }}>
                {d.entryCount} entries
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              {d.config.disputeStatus === "active" ? (
                <span style={{
                  fontSize: 9, fontFamily: MONO, fontWeight: 700, letterSpacing: 0.8,
                  color: "#f5841f", background: "#fff5ed", border: "1px solid #f5841f",
                  borderRadius: 3, padding: "2px 6px",
                }}>ACTIVE</span>
              ) : (
                <span style={{
                  fontSize: 9, fontFamily: MONO, fontWeight: 700, letterSpacing: 0.8,
                  color: "#5D7380", background: "#f2f7fb", border: "1px solid #c8dce8",
                  borderRadius: 3, padding: "2px 6px",
                }}>RESOLVED</span>
              )}
            </div>
            <div style={{ textAlign: "center", fontSize: 11, fontFamily: MONO, color: "#5D7380" }}>
              {formatDate(d.config.disputePublicDate)}
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
