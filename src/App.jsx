import { useState } from "react";
import WarRoomDashboard from "./WarRoomDashboard.jsx";

// Import all configs dynamically
const configs = {};
const configModules = import.meta.glob("./configs/*.js", { eager: true });
Object.entries(configModules).forEach(([path, mod]) => {
  const key = path.replace("./configs/", "").replace(".js", "");
  configs[key] = mod.default;
});

// Build dashboard registry from configs
const DASHBOARDS = Object.entries(configs).map(([key, config]) => ({
  id: key,
  label: config.title,
  short: config.navShort || config.title,
  config,
}));

function DashboardRenderer({ id }) {
  const dash = DASHBOARDS.find((d) => d.id === id);
  if (dash?.config) return <WarRoomDashboard key={id} config={dash.config} />;
  return <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>Dashboard not found</div>;
}

export default function App({ onLogout }) {
  const [active, setActive] = useState(DASHBOARDS[0]?.id || "bcbsm");

  return (
    <div style={{ position: "relative" }}>
      {/* Toggle bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "8px 16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #D8DDE6",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 2,
            color: "rgba(0,0,0,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            marginRight: 12,
            flexShrink: 0,
          }}
        >
          WAR ROOM
        </span>
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          style={{
            flex: 1,
            padding: "5px 8px",
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.03)",
            color: "#1A1A2E",
            cursor: "pointer",
            appearance: "auto",
            maxWidth: 320,
          }}
        >
          {DASHBOARDS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        <button
          onClick={onLogout}
          style={{
            padding: "4px 10px",
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.15)",
            cursor: "pointer",
            background: "transparent",
            color: "rgba(0,0,0,0.4)",
            letterSpacing: 1,
            transition: "all 0.15s ease",
            flexShrink: 0,
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Dashboard content */}
      <DashboardRenderer id={active} />
    </div>
  );
}
