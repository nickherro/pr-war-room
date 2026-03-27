import { useState, useEffect, useCallback } from "react";
import WarRoomDashboard from "./WarRoomDashboard.jsx";
import ScoringSettings from "./ScoringSettings.jsx";
import Homepage from "./Homepage.jsx";

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

const DASHBOARD_IDS = new Set(DASHBOARDS.map((d) => d.id));

function getRouteFromPath() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (path && DASHBOARD_IDS.has(path)) return path;
  return null; // homepage
}

const STORAGE_KEY = "_scoring_overrides";

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.dimensionWeights && ("frame" in parsed.dimensionWeights || "sentiment" in parsed.dimensionWeights)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
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
  const [active, setActive] = useState(getRouteFromPath);
  const [showSettings, setShowSettings] = useState(false);
  const [weightOverrides, setWeightOverrides] = useState(loadOverrides);

  // Sync browser back/forward
  useEffect(() => {
    const onPop = () => setActive(getRouteFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((id) => {
    const path = id ? `/${id}` : "/";
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    setActive(id);
    setShowSettings(false);
    window.scrollTo(0, 0);
  }, []);

  const activeConfig = active ? DASHBOARDS.find((d) => d.id === active)?.config : null;

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

  // Homepage view
  if (!active) {
    return (
      <div style={{ position: "relative" }}>
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
            borderBottom: "1px solid #c8dce8",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: 1.5,
              color: "rgba(0,0,0,0.35)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            TRACKER HOME
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={onLogout} style={navBtnStyle}>
            LOGOUT
          </button>
        </div>
        <Homepage dashboards={DASHBOARDS} weightOverrides={weightOverrides} onNavigate={navigate} />
      </div>
    );
  }

  // Dispute view
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
          gap: 4,
          padding: "8px 16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #c8dce8",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <span
          onClick={() => navigate(null)}
          style={{
            fontSize: 10,
            letterSpacing: 1.5,
            color: "rgba(0,0,0,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            marginRight: 12,
            flexShrink: 0,
            cursor: "pointer",
          }}
          title="Back to all disputes"
        >
          TRACKER HOME
        </span>
        <select
          value={active}
          onChange={(e) => navigate(e.target.value)}
          style={{
            padding: "5px 8px",
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.03)",
            color: "#053b57",
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
            color: weightOverrides ? "#f5841f" : "rgba(0,0,0,0.4)",
          }}
          title={weightOverrides ? "Custom scoring weights active" : "Scoring settings"}
        >
          CONFIG
        </button>
        <div style={{ flex: 1 }} />
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
        <div style={{ padding: 40, textAlign: "center", color: "#5D7380" }}>Dashboard not found</div>
      )}
    </div>
  );
}
