import { useState, useMemo } from "react";
import { DEFAULT_SOURCE_TYPE_WEIGHTS, DEFAULT_DIMENSION_WEIGHTS } from "./WarRoomDashboard.jsx";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Source Serif 4', Georgia, serif";

const DIMENSION_LABELS = {
  frame: "Frame Adoption",
  sentiment: "Sentiment",
  blame: "Blame Direction",
  patientStory: "Patient Story Saturation",
};

const SOURCE_TYPE_LABELS = {
  tv: "TV",
  radio: "Radio",
  news: "News",
  social: "Social",
  owned: "Owned/Party Media",
  opinion: "Opinion",
  other: "Other",
};

const S = {
  panel: {
    background: "#FAFBFC",
    border: "1px solid #D8DDE6",
    borderRadius: 8,
    padding: "20px 24px",
    maxWidth: 720,
    margin: "0 auto",
    fontFamily: SERIF,
  },
  header: {
    fontSize: 13,
    letterSpacing: 1.5,
    color: "#64748B",
    fontFamily: MONO,
    fontWeight: 700,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: "#64748B",
    fontFamily: MONO,
    fontWeight: 600,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #EAEDF2",
  },
  label: {
    fontSize: 13,
    color: "#1A1A2E",
    fontFamily: SERIF,
  },
  input: {
    width: 64,
    padding: "4px 6px",
    fontSize: 12,
    fontFamily: MONO,
    fontWeight: 600,
    textAlign: "center",
    border: "1px solid #D8DDE6",
    borderRadius: 4,
    background: "#fff",
    color: "#1A1A2E",
  },
  dimTotal: {
    fontSize: 11,
    fontFamily: MONO,
    fontWeight: 600,
    padding: "4px 8px",
    borderRadius: 4,
  },
  btnRow: {
    display: "flex",
    gap: 8,
    marginTop: 16,
  },
  btn: {
    padding: "6px 14px",
    fontSize: 10,
    fontFamily: MONO,
    fontWeight: 700,
    letterSpacing: 1,
    borderRadius: 4,
    border: "1px solid #D8DDE6",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
};

export default function ScoringSettings({ config, overrides, onSave, onClose }) {
  const { sourceWeights } = config;

  const [dimWeights, setDimWeights] = useState(() => ({
    ...DEFAULT_DIMENSION_WEIGHTS,
    ...(overrides?.dimensionWeights || {}),
  }));

  const [stWeights, setStWeights] = useState(() => ({
    ...DEFAULT_SOURCE_TYPE_WEIGHTS,
    ...(overrides?.sourceTypeWeights || {}),
  }));

  const [srcOverrides, setSrcOverrides] = useState(() => ({
    ...(overrides?.sourceWeights || {}),
  }));

  const [showSources, setShowSources] = useState(false);

  const allSources = useMemo(() => {
    const sources = {};
    (config.entries || []).forEach((e) => {
      if (!sources[e.source]) {
        sources[e.source] = {
          configWeight: sourceWeights[e.source],
          sourceType: e.sourceType,
        };
      }
    });
    return Object.entries(sources).sort((a, b) => a[0].localeCompare(b[0]));
  }, [config.entries, sourceWeights]);

  const dimTotal = Object.values(dimWeights).reduce((s, v) => s + v, 0);
  const dimValid = Math.abs(dimTotal - 1.0) < 0.01;

  const handleDim = (key, val) => {
    const num = parseFloat(val);
    if (!isNaN(num)) setDimWeights((prev) => ({ ...prev, [key]: num }));
  };

  const handleSt = (key, val) => {
    const num = parseFloat(val);
    if (!isNaN(num)) setStWeights((prev) => ({ ...prev, [key]: num }));
  };

  const handleSrc = (source, val) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setSrcOverrides((prev) => ({ ...prev, [source]: num }));
    }
  };

  const handleSave = () => {
    const result = {};
    const dimChanged = Object.keys(dimWeights).some(
      (k) => dimWeights[k] !== DEFAULT_DIMENSION_WEIGHTS[k]
    );
    if (dimChanged) result.dimensionWeights = { ...dimWeights };

    const stChanged = Object.keys(stWeights).some(
      (k) => stWeights[k] !== DEFAULT_SOURCE_TYPE_WEIGHTS[k]
    );
    if (stChanged) result.sourceTypeWeights = { ...stWeights };

    if (Object.keys(srcOverrides).length > 0) {
      const filtered = {};
      Object.entries(srcOverrides).forEach(([k, v]) => {
        if (v !== sourceWeights[k]) filtered[k] = v;
      });
      if (Object.keys(filtered).length > 0) result.sourceWeights = filtered;
    }

    onSave(Object.keys(result).length > 0 ? result : null);
  };

  const handleReset = () => {
    setDimWeights({ ...DEFAULT_DIMENSION_WEIGHTS });
    setStWeights({ ...DEFAULT_SOURCE_TYPE_WEIGHTS });
    setSrcOverrides({});
  };

  return (
    <div style={S.panel}>
      <div style={S.header}>SCORING CONFIGURATION</div>

      {/* Dimension Weights */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Dimension Weights</div>
        {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
          <div key={key} style={S.row}>
            <span style={S.label}>{label}</span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={dimWeights[key]}
              onChange={(e) => handleDim(key, e.target.value)}
              style={S.input}
            />
          </div>
        ))}
        <div style={{ ...S.row, borderBottom: "none", justifyContent: "flex-end", gap: 8 }}>
          <span style={{ ...S.label, fontSize: 11, color: "#64748B" }}>Total:</span>
          <span
            style={{
              ...S.dimTotal,
              color: dimValid ? "#16A34A" : "#DC2626",
              background: dimValid ? "#F0FDF4" : "#FEF2F2",
            }}
          >
            {dimTotal.toFixed(2)}
          </span>
        </div>
        {!dimValid && (
          <div style={{ fontSize: 11, color: "#DC2626", fontFamily: MONO, textAlign: "right" }}>
            Weights must sum to 1.00
          </div>
        )}
      </div>

      {/* Source Type Weights */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Source Type Weights</div>
        {Object.entries(SOURCE_TYPE_LABELS).map(([key, label]) => (
          <div key={key} style={S.row}>
            <span style={S.label}>{label}</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="3"
              value={stWeights[key]}
              onChange={(e) => handleSt(key, e.target.value)}
              style={S.input}
            />
          </div>
        ))}
      </div>

      {/* Per-Source Overrides */}
      <div style={S.section}>
        <div
          style={{ ...S.sectionTitle, cursor: "pointer", userSelect: "none" }}
          onClick={() => setShowSources(!showSources)}
        >
          {showSources ? "▾" : "▸"} Per-Source Weight Overrides ({allSources.length} sources)
        </div>
        {showSources && (
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {allSources.map(([source, info]) => {
              const currentWeight =
                srcOverrides[source] !== undefined
                  ? srcOverrides[source]
                  : info.configWeight !== undefined
                  ? info.configWeight
                  : stWeights[info.sourceType] ?? 1.0;
              const isOverridden = srcOverrides[source] !== undefined;
              return (
                <div key={source} style={S.row}>
                  <div>
                    <span style={{ ...S.label, fontWeight: isOverridden ? 600 : 400 }}>
                      {source}
                    </span>
                    <span style={{ fontSize: 10, color: "#94A3B8", fontFamily: MONO, marginLeft: 6 }}>
                      {info.sourceType}
                      {info.configWeight !== undefined && ` · cfg: ${info.configWeight}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="3"
                      value={currentWeight}
                      onChange={(e) => handleSrc(source, e.target.value)}
                      style={{
                        ...S.input,
                        borderColor: isOverridden ? "#3B82F6" : "#D8DDE6",
                        background: isOverridden ? "#EFF6FF" : "#fff",
                      }}
                    />
                    {isOverridden && (
                      <button
                        onClick={() => {
                          setSrcOverrides((prev) => {
                            const next = { ...prev };
                            delete next[source];
                            return next;
                          });
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          color: "#94A3B8",
                          padding: "0 2px",
                        }}
                        title="Reset to default"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={S.btnRow}>
        <button
          onClick={handleSave}
          disabled={!dimValid}
          style={{
            ...S.btn,
            background: dimValid ? "#1A1A2E" : "#D8DDE6",
            color: dimValid ? "#fff" : "#94A3B8",
            cursor: dimValid ? "pointer" : "not-allowed",
          }}
        >
          APPLY
        </button>
        <button onClick={handleReset} style={{ ...S.btn, background: "#fff", color: "#64748B" }}>
          RESET DEFAULTS
        </button>
        <button onClick={onClose} style={{ ...S.btn, background: "#fff", color: "#64748B" }}>
          CLOSE
        </button>
      </div>
    </div>
  );
}
