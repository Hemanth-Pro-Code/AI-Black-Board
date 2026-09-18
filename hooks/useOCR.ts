"use client";

import { recognizeBoard } from "@/lib/ocr";

export async function useOCR() {
  const canvas = document.getElementById(
    "blackboard-canvas"
  ) as HTMLCanvasElement | null;

  if (!canvas) {
    throw new Error("Canvas not found");
  }

  const image = canvas.toDataURL("image/png");

  const text = await recognizeBoard(image);

  return text;
}