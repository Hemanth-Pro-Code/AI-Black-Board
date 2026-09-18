"use client";

import React from "react";
import { Download, X } from "lucide-react";
import { usePWA } from "./PWAProvider";

export default function InstallPrompt() {
  const { showInstallBanner, promptInstall, dismissInstall } = usePWA();

  if (!showInstallBanner) {
    return null;
  }

  return (
    <div
      className="glass fade-in"
      style={{
        position: "fixed",
        top: "calc(20px + env(safe-area-inset-top, 0px))",
        right: "20px",
        zIndex: 10002,
        padding: "10px 14px",
        borderRadius: "16px",
        background: "rgba(7, 37, 28, 0.92)",
        border: "1px solid rgba(34, 197, 94, 0.35)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backdropFilter: "blur(16px)",
      }}
    >
      <button
        onClick={promptInstall}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "#ffffff",
          border: "none",
          borderRadius: "999px",
          padding: "8px 16px",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
        }}
      >
        <Download size={15} />
        Install App
      </button>

      <button
        onClick={dismissInstall}
        title="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "50%",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
