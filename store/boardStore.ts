import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Tool = "pen" | "eraser";

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  tool: Tool;
  color: string;
  size: number;
  points: Point[];
}

export interface BoardPageData {
  id: string;
  strokes: Stroke[];
  undoneStrokes: Stroke[];
  aiText: string;
  aiPosition: {
    x: number;
    y: number;
  };
}

export interface BoardState {
  tool: Tool;
  color: string;
  brushSize: number;

  // Active page data for direct, backward-compatible access
  strokes: Stroke[];
  undoneStrokes: Stroke[];
  aiText: string;
  aiPosition: {
    x: number;
    y: number;
  };

  // Multi-page state
  pages: BoardPageData[];
  currentPageIndex: number;

  // Page Navigation
  prevPage: () => void;
  nextPage: () => void;
  goToPage: (pageIndex: number) => void;
  addNewPage: () => void;
  deleteCurrentPage: () => void;

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

const defaultFirstPage: BoardPageData = {
  id: "page-1",
  strokes: [],
  undoneStrokes: [],
  aiText: "",
  aiPosition: {
    x: 120,
    y: 700,
  },
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tool: "pen",
      color: "#ffffff",
      brushSize: 8,

      // Initial active page data
      strokes: [],
      undoneStrokes: [],
      aiText: "",
      aiPosition: {
        x: 120,
        y: 700,
      },

      // Initial pages
      pages: [defaultFirstPage],
      currentPageIndex: 0,

      // Page Navigation
      prevPage: () =>
        set((state) => {
          if (state.currentPageIndex <= 0) return state;
          const targetIndex = state.currentPageIndex - 1;
          const targetPage = state.pages[targetIndex];
          if (!targetPage) return state;

          return {
            currentPageIndex: targetIndex,
            strokes: targetPage.strokes || [],
            undoneStrokes: targetPage.undoneStrokes || [],
            aiText: targetPage.aiText || "",
            aiPosition: targetPage.aiPosition || { x: 120, y: 700 },
          };
        }),

      nextPage: () =>
        set((state) => {
          if (state.currentPageIndex >= state.pages.length - 1) return state;
          const targetIndex = state.currentPageIndex + 1;
          const targetPage = state.pages[targetIndex];
          if (!targetPage) return state;

          return {
            currentPageIndex: targetIndex,
            strokes: targetPage.strokes || [],
            undoneStrokes: targetPage.undoneStrokes || [],
            aiText: targetPage.aiText || "",
            aiPosition: targetPage.aiPosition || { x: 120, y: 700 },
          };
        }),

      goToPage: (pageIndex: number) =>
        set((state) => {
          if (pageIndex < 0 || pageIndex >= state.pages.length) return state;
          const targetPage = state.pages[pageIndex];
          if (!targetPage) return state;

          return {
            currentPageIndex: pageIndex,
            strokes: targetPage.strokes || [],
            undoneStrokes: targetPage.undoneStrokes || [],
            aiText: targetPage.aiText || "",
            aiPosition: targetPage.aiPosition || { x: 120, y: 700 },
          };
        }),

      addNewPage: () =>
        set((state) => {
          const newPage: BoardPageData = {
            id:
              typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `page-${Date.now()}`,
            strokes: [],
            undoneStrokes: [],
            aiText: "",
            aiPosition: { x: 120, y: 700 },
          };

          const updatedPages = [...state.pages, newPage];
          const newIndex = updatedPages.length - 1;

          return {
            pages: updatedPages,
            currentPageIndex: newIndex,
            strokes: [],
            undoneStrokes: [],
            aiText: "",
            aiPosition: { x: 120, y: 700 },
          };
        }),

      deleteCurrentPage: () =>
        set((state) => {
          if (state.pages.length <= 1) {
            const resetPage: BoardPageData = {
              id: state.pages[0]?.id || "page-1",
              strokes: [],
              undoneStrokes: [],
              aiText: "",
              aiPosition: { x: 120, y: 700 },
            };
            return {
              pages: [resetPage],
              currentPageIndex: 0,
              strokes: [],
              undoneStrokes: [],
              aiText: "",
              aiPosition: { x: 120, y: 700 },
            };
          }

          const updatedPages = state.pages.filter(
            (_, idx) => idx !== state.currentPageIndex
          );
          const newIndex = Math.min(
            state.currentPageIndex,
            updatedPages.length - 1
          );
          const targetPage = updatedPages[newIndex];

          return {
            pages: updatedPages,
            currentPageIndex: newIndex,
            strokes: targetPage.strokes || [],
            undoneStrokes: targetPage.undoneStrokes || [],
            aiText: targetPage.aiText || "",
            aiPosition: targetPage.aiPosition || { x: 120, y: 700 },
          };
        }),

      // Setters
      setAiText: (text) =>
        set((state) => {
          const updatedPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex ? { ...p, aiText: text } : p
          );
          return {
            aiText: text,
            pages: updatedPages,
          };
        }),

      setAiPosition: (x, y) =>
        set((state) => {
          const pos = { x, y };
          const updatedPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex ? { ...p, aiPosition: pos } : p
          );
          return {
            aiPosition: pos,
            pages: updatedPages,
          };
        }),

      setTool: (tool) => set({ tool }),

      setColor: (color) => set({ color }),

      setBrushSize: (brushSize) => set({ brushSize }),

      addStroke: (stroke) =>
        set((state) => {
          const updatedStrokes = [...state.strokes, stroke];
          const updatedPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex
              ? { ...p, strokes: updatedStrokes, undoneStrokes: [] }
              : p
          );
          return {
            strokes: updatedStrokes,
            undoneStrokes: [],
            pages: updatedPages,
          };
        }),

      undo: () =>
        set((state) => {
          if (state.strokes.length === 0) return state;

          const updated = [...state.strokes];
          const last = updated.pop();
          const newUndone = last
            ? [...state.undoneStrokes, last]
            : state.undoneStrokes;

          const updatedPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex
              ? { ...p, strokes: updated, undoneStrokes: newUndone }
              : p
          );

          return {
            strokes: updated,
            undoneStrokes: newUndone,
            pages: updatedPages,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.undoneStrokes.length === 0) return state;

          const restored = [...state.undoneStrokes];
          const stroke = restored.pop();
          const updatedStrokes = stroke
            ? [...state.strokes, stroke]
            : state.strokes;

          const updatedPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex
              ? { ...p, strokes: updatedStrokes, undoneStrokes: restored }
              : p
          );

          return {
            strokes: updatedStrokes,
            undoneStrokes: restored,
            pages: updatedPages,
          };
        }),

      clearBoard: () =>
        set((state) => {
          const updatedPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex
              ? {
                  ...p,
                  strokes: [],
                  undoneStrokes: [],
                  aiText: "",
                  aiPosition: { x: 120, y: 700 },
                }
              : p
          );
          return {
            strokes: [],
            undoneStrokes: [],
            aiText: "",
            aiPosition: { x: 120, y: 700 },
            pages: updatedPages,
          };
        }),
    }),
    {
      name: "blackboard-state-v2",
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
        pages: state.pages,
        currentPageIndex: state.currentPageIndex,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.pages || state.pages.length === 0) {
          state.pages = [
            {
              id: "page-1",
              strokes: state.strokes || [],
              undoneStrokes: state.undoneStrokes || [],
              aiText: state.aiText || "",
              aiPosition: state.aiPosition || { x: 120, y: 700 },
            },
          ];
          state.currentPageIndex = 0;
        } else {
          const safeIdx = Math.max(
            0,
            Math.min(state.currentPageIndex || 0, state.pages.length - 1)
          );
          state.currentPageIndex = safeIdx;
          const curPage = state.pages[safeIdx];
          if (curPage) {
            state.strokes = curPage.strokes || [];
            state.undoneStrokes = curPage.undoneStrokes || [];
            state.aiText = curPage.aiText || "";
            state.aiPosition = curPage.aiPosition || { x: 120, y: 700 };
          }
        }
      },
    }
  )
);