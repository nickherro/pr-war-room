import { useState } from "react";
import WarRoomDashboard from "./WarRoomDashboard.jsx";
import ScoringSettings from "./ScoringSettings.jsx";

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

const STORAGE_KEY = "_scoring_overrides";

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveOverrides(overrides) {
  if (overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export default function App({ onLogout }) {
  const [active, setActive] = useState(DASHBOARDS[0]?.id || "bcbsm");
  const [showSettings, setShowSettings] = useState(false);
  const [weightOverrides, setWeightOverrides] = useState(loadOverrides);

  const activeConfig = DASHBOARDS.find((d) => d.id === active)?.config;

  const handleSaveOverrides = (overrides) => {
    setWeightOverrides(overrides);
    saveOverrides(overrides);
    setShowSettings(false);
  };

  const navBtnStyle = {
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
  };

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
          onChange={(e) => { setActive(e.target.value); setShowSettings(false); }}
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
          onClick={() => setShowSettings(!showSettings)}
          style={{
            ...navBtnStyle,
            background: showSettings ? "rgba(0,0,0,0.08)" : "transparent",
            color: weightOverrides ? "#3B82F6" : "rgba(0,0,0,0.4)",
          }}
          title={weightOverrides ? "Custom scoring weights active" : "Scoring settings"}
        >
          CONFIG
        </button>
        <button onClick={onLogout} style={navBtnStyle}>
          LOGOUT
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && activeConfig && (
        <div style={{ padding: "20px 20px 0" }}>
          <ScoringSettings
            config={activeConfig}
            overrides={weightOverrides}
            onSave={handleSaveOverrides}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {/* Dashboard content */}
      {activeConfig ? (
        <WarRoomDashboard key={active} config={activeConfig} weightOverrides={weightOverrides} />
      ) : (
        <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>Dashboard not found</div>
      )}
    </div>
  );
}
