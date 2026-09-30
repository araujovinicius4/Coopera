import React from "react";

/** A imagem oficial é preservada integralmente, sem recorte ou reconstrução. */
export default function Logo({ compact = false, className = "", decorative = false }) {
  return (
    <span className={`logo${compact ? " logo-compact" : ""} ${className}`.trim()}>
      <img
        className="logo-official"
        src="/coopera-logo.png"
        alt={decorative ? "" : "Coopera — Ideias, Pessoas, Soluções"}
        aria-hidden={decorative || undefined}
        width="2180"
        height="721"
      />
    </span>
  );
}
