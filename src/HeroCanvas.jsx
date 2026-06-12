import { useEffect, useRef } from "react";

// HeroCanvas — soft aurora ribbons drifting slowly over the warm-white hero.
// Pure client-side decoration: everything runs inside the effect so SSR just
// renders an empty <canvas> and hydration never mismatches.
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;

    const resize = () => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Aurora palette anchored on the citizens.is brand cyan (#29a7d0),
    // listed first so it appears most often among the blobs.
    const COLORS = [
      [41, 167, 208],
      [104, 199, 133],
      [139, 123, 216],
      [64, 186, 170],
    ];

    const blobs = Array.from({ length: 7 }, (_, i) => ({
      c: COLORS[i % COLORS.length],
      // Anchor in the upper part of the hero; drift around it on slow sines.
      ax: 0.05 + Math.random() * 0.9,
      ay: Math.random() * 0.65,
      dx: 0.08 + Math.random() * 0.12,
      dy: 0.05 + Math.random() * 0.08,
      fx: 0.05 + Math.random() * 0.07,
      fy: 0.04 + Math.random() * 0.06,
      p: Math.random() * Math.PI * 2,
      r: 0.45 + Math.random() * 0.4,
      alpha: 0.1 + Math.random() * 0.08,
    }));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (tms) => {
      const t = tms / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const b of blobs) {
        const x = (b.ax + Math.sin(t * b.fx + b.p) * b.dx) * W;
        const y = (b.ay + Math.cos(t * b.fy + b.p) * b.dy) * H;
        const r = b.r * Math.min(W, H);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${b.c}, ${b.alpha})`);
        g.addColorStop(1, `rgba(${b.c}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
