import React from "react";

export function Alert({ type = "info", children }) {
  const base = {
    padding: "10px 14px",
    borderRadius: "10px",
    marginBottom: "10px",
    fontSize: "0.95rem",
  };
  const styles = {
    info: { background: "#eef2ff", color: "#4338ca", ...base },
    success: { background: "#dcfce7", color: "#15803d", ...base },
    error: { background: "#fee2e2", color: "#b91c1c", ...base },
    warn: { background: "#fff7ed", color: "#b45309", ...base },
  };

  return <div style={styles[type] || styles.info}>{children}</div>;
}

export default function Alerts({ list = [] }) {
  if (!list.length) return null;
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 60, width: 320 }}>
      {list.map((a, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <Alert type={a.type}>{a.text}</Alert>
        </div>
      ))}
    </div>
  );
}
