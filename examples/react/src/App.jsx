import React from "react";
import { presets, useParticles } from "particular";

export default function App() {
  const { canvasRef, canvasStyle, burstFromEvent } = useParticles({
    preset: "magic",
    renderer: "webgl",
    config: { ...presets.magic, maxCount: 450 },
  });

  return (
    <>
      <canvas ref={canvasRef} className="particular" style={canvasStyle} />
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <button
          onClick={burstFromEvent}
          style={{
            fontSize: "1rem",
            padding: "0.8rem 1.2rem",
            borderRadius: 12,
            border: "1px solid #2e3552",
            background: "#121a33",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Click for particles
        </button>
      </main>
    </>
  );
}
