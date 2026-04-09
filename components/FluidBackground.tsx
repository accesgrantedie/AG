"use client";

import { useEffect, useRef } from "react";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // ✅ RESET before scaling (CRITICAL)
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const render = () => {
      t += 0.003;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createRadialGradient(
        w / 2 + Math.sin(t) * 200,
        h / 2 + Math.cos(t) * 200,
        100,
        w / 2,
        h / 2,
        800
      );

      gradient.addColorStop(0, "rgba(74,222,128,0.15)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none"
    />
  );
}