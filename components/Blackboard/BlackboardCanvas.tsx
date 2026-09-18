
"use client";

import { useEffect } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { useBoardStore } from "@/store/boardStore";

export default function BlackboardCanvas() {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
  } = useCanvas();

  const { strokes } = useBoardStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
canvas.height = 5000;

      // Blackboard background
      ctx.fillStyle = "#0b3d2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Redraw all saved strokes
      strokes.forEach((stroke) => {
        if (stroke.points.length < 2) return;

        ctx.beginPath();
        ctx.lineWidth = stroke.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle =
          stroke.tool === "eraser" ? "#0b3d2e" : stroke.color;

        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }

        ctx.stroke();
      });
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef, strokes]);

  return (
    <canvas
      id="blackboard-canvas"
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{
        width: "100%",
        height: "5000px",
        display: "block",
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
}

