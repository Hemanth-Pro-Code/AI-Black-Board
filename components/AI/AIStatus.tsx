
"use client";

interface AIStatusProps {
  loading: boolean;
}

export default function AIStatus({ loading }: AIStatusProps) {
  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 18px",
        borderRadius: 999,
        background: "rgba(34,197,94,0.15)",
        border: "1px solid rgba(34,197,94,0.35)",
        color: "#bbf7d0",
        fontWeight: 600,
        zIndex: 2000,
        backdropFilter: "blur(10px)",
      }}
    >
      🤖 AI is thinking...
    </div>
  );
}

