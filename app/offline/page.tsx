"use client";

import Link from "next/link";
import { WifiOff, PenTool, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, #14532d 0%, #0b3d2e 45%, #07251c 100%)",
      }}
    >
      <div
        className="glass board-shadow fade-in"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "28px",
          padding: "3.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "#fde68a",
          }}
        >
          <WifiOff size={40} />
        </div>

        <h1
          className="chalk-text"
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            marginBottom: "1rem",
          }}
        >
          You are Offline
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          No internet connection detected. You can still use the blackboard
          offline to draw, erase, brainstorm, and save your work locally.
          AI solving and online features will resume once reconnected.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/board"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 2rem",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#0b3d2e",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "transform 0.2s ease",
            }}
          >
            <PenTool size={18} />
            Open Blackboard
          </Link>

          <button
            onClick={() => window.location.reload()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            <RefreshCw size={18} />
            Retry Connection
          </button>
        </div>
      </div>
    </main>
  );
}
