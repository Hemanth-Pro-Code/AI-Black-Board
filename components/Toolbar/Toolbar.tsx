"use client";
import React from "react";
import {
  Brain,
  Eraser,
  Mic,
  PenTool,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import { useBoardStore } from "@/store/boardStore";

const chalkColors = [
  "#ffffff",
  "#fde68a",
  "#86efac",
  "#93c5fd",
  "#f9a8d4",
];

export default function Toolbar() {
  const {
    tool,
    color,
    brushSize,
    setTool,
    setColor,
    setBrushSize,
    undo,
    redo,
    clearBoard,
  } = useBoardStore();

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 12,
    border: active
      ? "2px solid #22c55e"
      : "1px solid rgba(255,255,255,0.12)",
    background: active
      ? "rgba(34,197,94,0.22)"
      : "rgba(255,255,255,0.08)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.15s ease",
  });

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 22,
        backdropFilter: "blur(20px)",
        background: "rgba(0,0,0,0.42)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        maxWidth: "calc(100vw - 28px)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <button
        style={buttonStyle(tool === "pen")}
        onClick={() => setTool("pen")}
        title="Pen"
        aria-label="Pen"
      >
        <PenTool size={18} />
      </button>

      <button
        style={buttonStyle(tool === "eraser")}
        onClick={() => setTool("eraser")}
        title="Eraser"
        aria-label="Eraser"
      >
        <Eraser size={18} />
      </button>

      <button
        style={buttonStyle(false)}
        onClick={undo}
        title="Undo"
        aria-label="Undo"
      >
        <Undo2 size={18} />
      </button>

      <button
        style={buttonStyle(false)}
        onClick={redo}
        title="Redo"
        aria-label="Redo"
      >
        <Redo2 size={18} />
      </button>

      <button
        style={buttonStyle(false)}
        onClick={clearBoard}
        title="Clear"
        aria-label="Clear Board"
      >
        <Trash2 size={18} />
      </button>

      <div
        style={{
          width: 1,
          height: 28,
          background: "rgba(255,255,255,0.18)",
          flexShrink: 0,
        }}
      />

      {chalkColors.map((c) => (
        <button
          key={c}
          onClick={() => setColor(c)}
          title={`Color ${c}`}
          aria-label={`Chalk color ${c}`}
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            borderRadius: "50%",
            border:
              color === c
                ? "2px solid #22c55e"
                : "2px solid rgba(255,255,255,0.35)",
            background: c,
            cursor: "pointer",
            flexShrink: 0,
            transform: color === c ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.15s ease",
          }}
        />
      ))}

      <input
        type="range"
        min={2}
        max={12}
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        title="Brush size"
        aria-label="Brush size"
        style={{
          width: 70,
          minWidth: 60,
          accentColor: "#22c55e",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />

      <div
        style={{
          width: 1,
          height: 28,
          background: "rgba(255,255,255,0.18)",
          flexShrink: 0,
        }}
      />

      <button
        style={buttonStyle(false)}
        title="Voice (coming soon)"
        aria-label="Voice"
      >
        <Mic size={18} />
      </button>

      <button
        style={buttonStyle(false)}
        title="AI Solve (coming soon)"
        aria-label="AI Solve"
      >
        <Brain size={18} />
      </button>
    </div>
  );
}
