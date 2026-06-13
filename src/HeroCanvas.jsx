import { useEffect, useRef } from "react";

// HeroCanvas — a living "collective intelligence" constellation drifting over a
// soft aurora wash. Points (citizens) link with hairlines when near and reach
// toward the cursor. With `faces`, a few nodes become circular portraits of
// people participating — wiring real human moments into the same network.
// Everything runs in the effect, so SSR renders an empty <canvas> and hydration
// never mismatches; prefers-reduced-motion gets a calm static frame.
const FACE_SRCS = [
  "/uploads/2026/06/hero-face-1.jpg",
  "/uploads/2026/06/hero-face-2.jpg",
  "/uploads/2026/06/hero-face-3.jpg",
  "/uploads/2026/06/hero-face-4.jpg",
];
// Peripheral anchors (fractions of W/H) — kept clear of the centered headline.
const FACE_ANCHORS = [
  [0.12, 0.30],
  [0.16, 0.74],
  [0.88, 0.26],
  [0.84, 0.70],
];

export default function HeroCanvas({ faces = false }) {
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

    // Preload portraits only when this hero uses them.
    const faceImgs = faces ? FACE_SRCS.map((src) => { const im = new Image(); im.src = src; return im; }) : [];
    if (reduced) faceImgs.forEach((im) => { im.onload = () => frame(0); });

    let blobs = [];
    let pts = [];
    let photos = [];
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const build = () => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      blobs = Array.from({ length: 5 }, (_, i) => ({
        c: BRAND[i % BRAND.length],
        ax: 0.1 + Math.random() * 0.8, ay: Math.random() * 0.6,
        dx: 0.08 + Math.random() * 0.1, dy: 0.05 + Math.random() * 0.07,
        fx: 0.04 + Math.random() * 0.05, fy: 0.03 + Math.random() * 0.05,
        p: Math.random() * Math.PI * 2,
        r: 0.5 + Math.random() * 0.35,
        alpha: 0.08 + Math.random() * 0.06,
      }));

      const count = Math.min(94, Math.max(26, Math.round((W * H) / 21000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
        c: BRAND[(Math.random() * BRAND.length) | 0],
        r: 1 + Math.random() * 1.6,
      }));

      // Photo nodes: 4 on wide screens, 2 (top corners) on mid, none when
      // narrow — so they never crowd the headline on small viewports.
      photos = [];
      if (faces) {
        const which = W >= 1080 ? [0, 1, 2, 3] : W >= 820 ? [0, 2] : [];
        const r = clamp(W * 0.032, 40, 60);
        which.forEach((idx) => {
          photos.push({
            img: faceImgs[idx],
            ax: FACE_ANCHORS[idx][0], ay: FACE_ANCHORS[idx][1],
            r,
            dx: 0.012, dy: 0.016, fx: 0.05, fy: 0.04, p: idx * 1.7,
          });
        });
      }
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

    const LINK2 = 130 * 130;
    const CUR2 = 175 * 175;

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

      // Current photo-node positions (gentle bounded drift around their anchor).
      for (const ph of photos) {
        ph.x = (ph.ax + Math.sin(t * ph.fx + ph.p) * ph.dx) * W;
        ph.y = (ph.ay + Math.cos(t * ph.fy + ph.p) * ph.dy) * H;
      }

      // Hairline links — soft navy web, brighter cyan to the cursor.
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

      // Links weaving each portrait into the network (drawn under the photos).
      const PLINK2 = 200 * 200;
      for (const ph of photos) {
        for (const a of pts) {
          const dx = a.x - ph.x, dy = a.y - ph.y, d2 = dx * dx + dy * dy;
          if (d2 > PLINK2) continue;
          ctx.strokeStyle = `rgba(16, 59, 104, ${(1 - d2 / PLINK2) * 0.18})`;
          ctx.beginPath(); ctx.moveTo(ph.x, ph.y); ctx.lineTo(a.x, a.y); ctx.stroke();
        }
      }

      // Glowing dots.
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

      // Portrait nodes: soft shadow disc → circular photo → white ring.
      for (const ph of photos) {
        const img = ph.img, r = ph.r;
        if (!img || !img.complete || !img.naturalWidth) continue;
        ctx.save();
        ctx.shadowColor = "rgba(16, 41, 63, 0.22)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(ph.x, ph.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath(); ctx.arc(ph.x, ph.y, r, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, ph.x - r, ph.y - r, r * 2, r * 2);
        // faint cool wash so portraits sit in the aurora palette
        ctx.fillStyle = "rgba(41, 167, 208, 0.06)";
        ctx.fillRect(ph.x - r, ph.y - r, r * 2, r * 2);
        ctx.restore();

        ctx.beginPath(); ctx.arc(ph.x, ph.y, r, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
        ctx.stroke();
      }

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
  }, [faces]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
