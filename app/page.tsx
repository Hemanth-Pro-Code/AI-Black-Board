"use client";

import Link from "next/link";
import { usePWA } from "@/components/PWA/PWAProvider";
import { Download } from "lucide-react";

export default function HomePage() {
  const { isInstallable, promptInstall } = usePWA();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding:
          "calc(2rem + env(safe-area-inset-top, 0px)) calc(1.5rem + env(safe-area-inset-right, 0px)) calc(2rem + env(safe-area-inset-bottom, 0px)) calc(1.5rem + env(safe-area-inset-left, 0px))",
      }}
    >
      <div
        className="glass board-shadow fade-in"
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "32px",
          padding: "3.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <div className="float" style={{ fontSize: "4rem" }}>
          🖍️
        </div>

        <h1
          className="chalk-text"
          style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            marginTop: "1rem",
          }}
        >
          BlackBoard AI
        </h1>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.8)",
            maxWidth: "650px",
            marginInline: "auto",
          }}
        >
          Draw naturally, solve mathematical problems, brainstorm ideas, and
          let AI generate intelligent handwritten responses directly on your
          digital blackboard.
        </p>

        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/board"
            style={{
              padding: "0.9rem 2.4rem",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#0b3d2e",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            🚀 Start Writing
          </Link>

          {isInstallable && (
            <button
              type="button"
              onClick={promptInstall}
              style={{
                padding: "0.9rem 2.2rem",
                borderRadius: "999px",
                border: "1px solid rgba(34,197,94,0.45)",
                background: "rgba(34,197,94,0.18)",
                color: "#86efac",
                fontWeight: 700,
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Download size={18} /> Install App
            </button>
          )}

          <button
            type="button"
            style={{
              padding: "0.9rem 2rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            ✨ AI Powered
          </button>
        </div>

        <div
          style={{
            marginTop: "3.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div className="glass" style={{ padding: "1.2rem", borderRadius: "18px" }}>
            <h3>✍️ Handwriting</h3>
            <p style={{ opacity: 0.75, marginTop: "0.5rem" }}>
              Smooth freehand drawing experience with local persistence.
            </p>
          </div>

          <div className="glass" style={{ padding: "1.2rem", borderRadius: "18px" }}>
            <h3>🤖 AI Solver</h3>
            <p style={{ opacity: 0.75, marginTop: "0.5rem" }}>
              Get instant explanations and solutions powered by Groq.
            </p>
          </div>

          <div className="glass" style={{ padding: "1.2rem", borderRadius: "18px" }}>
            <h3>📱 Installable PWA</h3>
            <p style={{ opacity: 0.75, marginTop: "0.5rem" }}>
              Works standalone on Android, Windows, and modern devices.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
