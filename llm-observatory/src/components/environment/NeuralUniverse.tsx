"use client";

import { useEffect, useRef } from "react";

interface NeuralUniverseProps {
  calm?: boolean;
}

/** Gentle ambient field — soft dots, slow drift, no tensor storms */
export function NeuralUniverse({ calm = true }: NeuralUniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const particles: { x: number; y: number; z: number; vx: number; vy: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const count = calm ? 35 : 55;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.06 - 0.02,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#6b9b7a";

    let t = 0;
    const draw = () => {
      t += 0.012;
      ctx.fillStyle = "rgba(15, 17, 20, 0.35)";
      ctx.fillRect(0, 0, w, h);

      const ac = accent();

      particles.forEach((p) => {
        p.x += p.vx * (0.3 + p.z * 0.2);
        p.y += p.vy * (0.3 + p.z * 0.2);
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const size = 1 + p.z * 1.5;
        const pulse = 0.25 + Math.sin(t * 0.8 + p.x * 0.01) * 0.12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = ac;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      ctx.strokeStyle = `${ac}0a`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i += 9) {
        const a = particles[i];
        const b = particles[(i + 17) % particles.length];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 140) {
          ctx.globalAlpha = (1 - dist / 140) * 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [calm]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${calm ? "opacity-35" : "opacity-50"}`}
      aria-hidden
    />
  );
}
