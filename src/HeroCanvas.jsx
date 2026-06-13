import { useEffect, useRef } from "react";

// HeroCanvas — a living "collective intelligence" constellation drifting over a
// soft aurora wash. Points (citizens) link with hairlines when near, glow like
// the lights on the share image, and reach toward the cursor. Everything runs
// inside the effect, so SSR renders an empty <canvas> and hydration never
// mismatches; prefers-reduced-motion gets a calm static frame.
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = 0;

    const BRAND = [
      [41, 167, 208],   // brand cyan
      [104, 199, 133],  // green
      [139, 123, 216],  // violet
      [86, 156, 214],   // ice blue
    ];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let blobs = [];
    let pts = [];
    const build = () => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Soft aurora blobs for colour depth behind the network.
      blobs = Array.from({ length: 5 }, (_, i) => ({
        c: BRAND[i % BRAND.length],
        ax: 0.1 + Math.random() * 0.8, ay: Math.random() * 0.6,
        dx: 0.08 + Math.random() * 0.1, dy: 0.05 + Math.random() * 0.07,
        fx: 0.04 + Math.random() * 0.05, fy: 0.03 + Math.random() * 0.05,
        p: Math.random() * Math.PI * 2,
        r: 0.5 + Math.random() * 0.35,
        alpha: 0.08 + Math.random() * 0.06,
      }));

      // Constellation points — count scales with area, capped for performance.
      const count = Math.min(94, Math.max(26, Math.round((W * H) / 21000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
        c: BRAND[(Math.random() * BRAND.length) | 0],
        r: 1 + Math.random() * 1.6,
      }));
    };
    build();
    window.addEventListener("resize", build);

    const pointer = { x: -9999, y: -9999, on: false };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const onLeave = () => { pointer.on = false; pointer.x = pointer.y = -9999; };
    const host = canvas.parentElement;
    if (finePointer && !reduced && host) {
      host.addEventListener("mousemove", onMove);
      host.addEventListener("mouseleave", onLeave);
    }

    const LINK2 = 130 * 130;   // neighbour-link distance²
    const CUR2 = 175 * 175;    // cursor-link / glow radius²

    const frame = (tms) => {
      const t = tms / 1000;
      ctx.clearRect(0, 0, W, H);

      // Aurora wash.
      for (const b of blobs) {
        const x = (b.ax + Math.sin(t * b.fx + b.p) * b.dx) * W;
        const y = (b.ay + Math.cos(t * b.fy + b.p) * b.dy) * H;
        const rr = b.r * Math.min(W, H);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
        g.addColorStop(0, `rgba(${b.c}, ${b.alpha})`);
        g.addColorStop(1, `rgba(${b.c}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }

      // Drift.
      if (!reduced) {
        for (const a of pts) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < -12) a.x = W + 12; else if (a.x > W + 12) a.x = -12;
          if (a.y < -12) a.y = H + 12; else if (a.y > H + 12) a.y = -12;
        }
      }

      // Hairline links — a soft navy web, with brighter cyan links to the cursor.
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          ctx.strokeStyle = `rgba(16, 59, 104, ${(1 - d2 / LINK2) * 0.16})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        if (pointer.on) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < CUR2) {
            ctx.strokeStyle = `rgba(41, 167, 208, ${(1 - d2 / CUR2) * 0.5})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
          }
        }
      }

      // Glowing nodes (citizens) — swell and brighten near the cursor.
      for (const a of pts) {
        let r = a.r, alpha = 0.5;
        if (pointer.on) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < CUR2) { const k = 1 - d2 / CUR2; r += k * 1.4; alpha += k * 0.4; }
        }
        ctx.beginPath();
        ctx.shadowColor = `rgba(${a.c}, 0.9)`;
        ctx.shadowBlur = 7;
        ctx.fillStyle = `rgba(${a.c}, ${alpha})`;
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      if (host) {
        host.removeEventListener("mousemove", onMove);
        host.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
