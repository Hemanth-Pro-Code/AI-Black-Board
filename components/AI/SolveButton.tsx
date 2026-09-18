"use client";

import { Sparkles } from "lucide-react";

export default function SolveButton({
  onSolve,
}: {
  onSolve: () => void;
}) {
  return (
    <button
      onClick={onSolve}
      title="Solve with AI"
      aria-label="Solve with AI"
      style={{
        position: "fixed",
        right: "calc(24px + env(safe-area-inset-right, 0px))",
        bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
        width: 66,
        height: 66,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <Sparkles size={28} />
    </button>
  );
}