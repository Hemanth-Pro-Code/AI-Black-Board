
"use client";

import { useRef } from "react";
import { useBoardStore } from "@/store/boardStore";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const {
    tool,
    color,
    brushSize,
    strokes,
    addStroke,
  } = useBoardStore();

  const currentStroke = useRef<{
    id: string;
    tool: "pen" | "eraser";
    color: string;
    size: number;
    points: { x: number; y: number }[];
  } | null>(null);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    isDrawing.current = true;

    const point = getCoordinates(e);

    currentStroke.current = {
      id: crypto.randomUUID(),
      tool,
      color,
      size: brushSize,
      points: [point],
    };
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current || !currentStroke.current) return;

    const point = getCoordinates(e);
    currentStroke.current.points.push(point);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = currentStroke.current.points;

    if (points.length < 2) return;

    const previous = points[points.length - 2];

    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(point.x, point.y);

    ctx.lineWidth = currentStroke.current.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.strokeStyle = "#0b3d2e";
    } else {
      ctx.strokeStyle = currentStroke.current.color;
    }

    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;

    isDrawing.current = false;

    if (
      currentStroke.current &&
      currentStroke.current.points.length > 0
    ) {
      addStroke(currentStroke.current);
    }

    currentStroke.current = null;
  };

  return {
    canvasRef,
    strokes,
    tool,
    color,
    brushSize,
    startDrawing,
    draw,
    stopDrawing,
  };
}

