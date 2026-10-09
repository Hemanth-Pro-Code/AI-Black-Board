"use client";

import { Download } from "lucide-react";
import { useBoardStore } from "@/store/boardStore";

export default function SaveImage() {
  const { currentPageIndex } = useBoardStore();

  const saveCanvas = () => {
    const canvas = document.querySelector("canvas");

    if (!(canvas instanceof HTMLCanvasElement)) {
      alert("No canvas found.");
      return;
    }

    const link = document.createElement("a");
    link.download = `blackboard-page-${currentPageIndex + 1}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <button
      onClick={saveCanvas}
      title="Save blackboard page as PNG image"
      aria-label="Save as PNG"
      style={{
        position: "fixed",
        top: "calc(82px + env(safe-area-inset-top, 0px))",
        right: "calc(20px + env(safe-area-inset-right, 0px))",
        padding: "8px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.85rem",
        background: "rgba(37, 99, 235, 0.9)",
        color: "#ffffff",
        backdropFilter: "blur(12px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        zIndex: 998,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Download size={14} />
      <span>Save PNG</span>
    </button>
  );
}
