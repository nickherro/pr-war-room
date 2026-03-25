import { useState } from "react";
import BCBSMDashboard from "./BCBSMDashboard.jsx";
import MtSinaiDashboard from "./MtSinaiDashboard.jsx";

const DASHBOARDS = [
  { id: "bcbsm", label: "BCBSM vs Michigan Medicine", short: "BCBSM v. MM" },
  { id: "mtsinai", label: "Mt Sinai vs Anthem BCBS", short: "Mt Sinai v. Anthem" },
];

export default function App({ onLogout }) {
  const [active, setActive] = useState("bcbsm");

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
          }}
        >
          WAR ROOM
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
        {DASHBOARDS.map((d) => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            style={{
              padding: "6px 16px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              borderRadius: 4,
              border: active === d.id ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
              cursor: "pointer",
              background: active === d.id ? "rgba(0,0,0,0.07)" : "transparent",
              color: active === d.id ? "#1A1A2E" : "rgba(0,0,0,0.4)",
              transition: "all 0.15s ease",
            }}
          >
            {d.short}
          </button>
        ))}
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "6px 14px",
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
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Dashboard content */}
      {active === "bcbsm" ? <BCBSMDashboard /> : <MtSinaiDashboard />}
    </div>
  );
}
