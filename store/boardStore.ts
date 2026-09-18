import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Tool = "pen" | "eraser";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  tool: Tool;
  color: string;
  size: number;
  points: Point[];
}

interface BoardState {
  tool: Tool;
  color: string;
  brushSize: number;

  strokes: Stroke[];
  undoneStrokes: Stroke[];

  // AI state
  aiText: string;
  aiPosition: {
    x: number;
    y: number;
  };

  // Setters
  setAiText: (text: string) => void;
  setAiPosition: (x: number, y: number) => void;

  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;

  addStroke: (stroke: Stroke) => void;
  undo: () => void;
  redo: () => void;
  clearBoard: () => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tool: "pen",
      color: "#ffffff",
      brushSize: 8,

      strokes: [],
      undoneStrokes: [],

      // AI defaults
      aiText: "",
      aiPosition: {
        x: 120,
        y: 700,
      },

      setAiText: (text) => set({ aiText: text }),

      setAiPosition: (x, y) =>
        set({
          aiPosition: { x, y },
        }),

      setTool: (tool) => set({ tool }),

      setColor: (color) => set({ color }),

      setBrushSize: (brushSize) => set({ brushSize }),

      addStroke: (stroke) =>
        set((state) => ({
          strokes: [...state.strokes, stroke],
          undoneStrokes: [],
        })),

      undo: () =>
        set((state) => {
          if (state.strokes.length === 0) return state;

          const updated = [...state.strokes];
          const last = updated.pop();

          return {
            strokes: updated,
            undoneStrokes: last
              ? [...state.undoneStrokes, last]
              : state.undoneStrokes,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.undoneStrokes.length === 0) return state;

          const restored = [...state.undoneStrokes];
          const stroke = restored.pop();

          return {
            strokes: stroke
              ? [...state.strokes, stroke]
              : state.strokes,
            undoneStrokes: restored,
          };
        }),

      clearBoard: () =>
        set({
          strokes: [],
          undoneStrokes: [],
          aiText: "",
        }),
    }),
    {
      name: "blackboard-state-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        tool: state.tool,
        color: state.color,
        brushSize: state.brushSize,
        strokes: state.strokes,
        undoneStrokes: state.undoneStrokes,
        aiText: state.aiText,
        aiPosition: state.aiPosition,
      }),
    }
  )
);