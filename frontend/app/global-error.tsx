"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p style={{ fontSize: "72px", fontWeight: 700, color: "#ef4444" }}>500</p>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#0f172a", marginTop: "16px" }}>
            Critical error
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>
            {error.message || "A critical error occurred."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "32px",
              padding: "10px 24px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
