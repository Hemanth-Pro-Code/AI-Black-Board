"use client";

import { useEffect, useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import "@/styles/chalk.css";

export default function HandwritingRenderer() {
  const { aiText, aiPosition } = useBoardStore();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!aiText) {
      const resetTimer = setTimeout(() => setDisplayText(""), 0);
      return () => clearTimeout(resetTimer);
    }

    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(aiText.substring(0, index + 1));
      index++;

      if (index >= aiText.length) {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [aiText]);

  if (!displayText) return null;

  return (
    <div
      className="chalk-writing"
      style={{
        position: "absolute",
        left: aiPosition.x,
        top: aiPosition.y,
        maxWidth: "900px",
        pointerEvents: "none",
        zIndex: 500,
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          fontSize: "2rem",
          fontWeight: 700,
        }}
      >
        🤖 Solution
      </div>

      {displayText}
    </div>
  );
}