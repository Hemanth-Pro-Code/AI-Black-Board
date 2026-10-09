"use client";

import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import "@/styles/chalk.css";

export default function HandwritingRenderer() {
  const { aiText, aiPosition, currentPageIndex } = useBoardStore();
  const [displayText, setDisplayText] = useState("");
  const prevPageRef = useRef(currentPageIndex);

  useEffect(() => {
    if (!aiText) {
      setDisplayText("");
      return;
    }

    // When navigating between pages, display existing text immediately
    if (prevPageRef.current !== currentPageIndex) {
      prevPageRef.current = currentPageIndex;
      setDisplayText(aiText);
      return;
    }

    // On new solution, animate with typewriter effect
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(aiText.substring(0, index + 1));
      index++;

      if (index >= aiText.length) {
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [aiText, currentPageIndex]);

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