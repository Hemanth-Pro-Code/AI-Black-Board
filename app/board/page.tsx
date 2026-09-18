"use client";

import BlackboardCanvas from "@/components/Blackboard/BlackboardCanvas";
import HandwritingRenderer from "@/components/Blackboard/HandwritingRenderer";
import SolveButton from "@/components/AI/SolveButton";
import Toolbar from "@/components/Toolbar/Toolbar";
import SaveImage from "@/components/Export/SaveImage";

import { useBoardStore } from "@/store/boardStore";
import { recognizeBoard } from "@/lib/ocr";
import { useState } from "react";
import { usePWA } from "@/components/PWA/PWAProvider";

export default function BoardPage() {
  const { setAiText } = useBoardStore();
  const { isOffline } = usePWA();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSolve = async () => {
    // Check if network is offline before attempting API/OCR operations
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      alert(
        "AI solving requires an active internet connection.\n\nYour drawings are safely saved locally on this device. Please connect to the internet to solve."
      );
      return;
    }

    try {
      setLoading(true);
      const canvas = document.getElementById(
        "blackboard-canvas"
      ) as HTMLCanvasElement | null;

      if (!canvas) {
        alert("Canvas not found");
        return;
      }

      // Capture board as image
      const image = canvas.toDataURL("image/png");

      // OCR
      const extractedText = await recognizeBoard(image);
      console.log("OCR detected:", extractedText);

      if (!extractedText || !extractedText.trim()) {
        alert("No handwriting detected on blackboard. Please draw or write first.");
        return;
      }

      // Send OCR text to AI
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: extractedText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { strokes, setAiPosition } = useBoardStore.getState();

        let maxY = 200;

        strokes.forEach((stroke) => {
          stroke.points.forEach((point) => {
            if (point.y > maxY) {
              maxY = point.y;
            }
          });
        });

        setAiPosition(120, maxY + 100);
        setAiText("");

        setTimeout(() => {
          setAiText(data.answer);

          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      } else {
        if (data.offline) {
          alert("AI solving requires an internet connection. Please reconnect and try again.");
        } else {
          alert(data.error || "AI failed to solve.");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        alert(
          "AI solving requires an active internet connection. Please check your connection and try again."
        );
      } else {
        alert("Something went wrong while solving. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        position: "relative",
        background:
          "radial-gradient(circle at top, #14532d 0%, #0b3d2e 45%, #07251c 100%)",
      }}
    >
      {/* Blackboard Header */}
      <header
        style={{
          position: "fixed",
          top: "calc(16px + env(safe-area-inset-top, 0px))",
          left: "calc(16px + env(safe-area-inset-left, 0px))",
          right: "calc(16px + env(safe-area-inset-right, 0px))",
          zIndex: 999,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "12px 20px",
          borderRadius: 18,
          background: "rgba(0,0,0,0.38)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2
            style={{
              color: "white",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            🖍️ Blackboard AI
          </h2>

          <div
            style={{
              color: "#ddd",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>
              Page {currentPage} / {totalPages}
            </span>
            {isOffline && (
              <span
                style={{
                  background: "rgba(253, 230, 138, 0.2)",
                  color: "#fde68a",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                Offline Mode
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: "0.85rem",
            }}
          >
            ◀ Prev
          </button>

          <button
            onClick={() => {
              setTotalPages((p) => p + 1);
              setCurrentPage((p) => p + 1);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "10px",
              background: "rgba(34,197,94,0.18)",
              border: "1px solid rgba(34,197,94,0.35)",
              color: "#86efac",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ➕ New Page
          </button>

          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: "0.85rem",
            }}
          >
            Next ▶
          </button>
        </div>
      </header>

      <BlackboardCanvas />
      <HandwritingRenderer />
      <Toolbar />
      <SaveImage />

      {loading && (
        <div
          role="status"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "1.8rem",
            fontWeight: 700,
            zIndex: 9999,
            backdropFilter: "blur(8px)",
          }}
        >
          🤖 Solving...
        </div>
      )}

      {/* Floating AI Solve Button */}
      <SolveButton onSolve={handleSolve} />
    </main>
  );
}