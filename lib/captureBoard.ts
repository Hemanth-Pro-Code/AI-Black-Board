export function captureBoardImage(): string | null {
  const canvas = document.getElementById(
    "blackboard-canvas"
  ) as HTMLCanvasElement | null;

  if (!canvas) {
    return null;
  }

  return canvas.toDataURL("image/png");
}