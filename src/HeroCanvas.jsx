import { useEffect, useRef } from "react";

// HeroCanvas — a living "collective intelligence" constellation over a soft
// aurora wash. Points (citizens) link with hairlines and reach toward the
// cursor. With `faces`, a few nodes ARE circular portraits of people: they
// drift as real members of the graph (bounded to margin regions that never
// reach the text), wire into nearby points at the ring edge, glow with an
// aurora ring, and emit signal pulses along their links.
// All client-side, so SSR renders an empty <canvas> (no hydration mismatch);
// prefers-reduced-motion gets a calm static frame.
const FACE_SRCS = [
  "/uploads/2026/06/hero-face-1.jpg",
  "/uploads/2026/06/hero-face-2.jpg",
  "/uploads/2026/06/hero-face-3.jpg",
  "/uploads/2026/06/hero-face-4.jpg",
];

export default function HeroCanvas({ faces = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = 0, lastT = 0, pulseTimer = 0;
    const pulses = [];

    const BRAND = [
      [41, 167, 208], [104, 199, 133], [139, 123, 216], [86, 156, 214],
    ];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const faceImgs = faces ? FACE_SRCS.map((src) => { const im = new Image(); im.src = src; return im; }) : [];
    if (reduced) faceImgs.forEach((im) => { im.onload = () => frame(0); });

    let blobs = [], pts = [], photos = [];
    const build = () => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      blobs = Array.from({ length: 5 }, (_, i) => ({
        c: BRAND[i % BRAND.length],
        ax: 0.1 + Math.random() * 0.8, ay: Math.random() * 0.6,
        dx: 0.08 + Math.random() * 0.1, dy: 0.05 + Math.random() * 0.07,
        fx: 0.04 + Math.random() * 0.05, fy: 0.03 + Math.random() * 0.05,
        p: Math.random() * Math.PI * 2, r: 0.5 + Math.random() * 0.35,
        alpha: 0.08 + Math.random() * 0.06,
      }));

      const count = Math.min(94, Math.max(26, Math.round((W * H) / 21000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
        c: BRAND[(Math.random() * BRAND.length) | 0], r: 1 + Math.random() * 1.6,
      }));

      // Portraits live in margin REGIONS outside the centered text box, so they
      // can drift/bounce freely yet never reach the words. A region is dropped
      // if it's too narrow (small screens simply show fewer or none).
      photos = [];
      if (faces) {
        const r = clamp(W * 0.03, 38, 58) * 1.1; // 10% larger portrait rings
        const pad = r + 10, gap = r + 22, cx = W * 0.5, cy = H * 0.5;
        const hw = Math.min(W * 0.4, 430);          // half the text-safe width
        const leftX1 = cx - hw - gap, rightX0 = cx + hw + gap;
        const regions = [];
        if (leftX1 - pad > 2 * r) {
          regions.push([pad, leftX1, pad, cy], [pad, leftX1, cy, H - pad]);
        }
        if (W - pad - rightX0 > 2 * r) {
          regions.push([rightX0, W - pad, pad, cy], [rightX0, W - pad, cy, H - pad]);
        }
        regions.slice(0, 4).forEach((rg, i) => {
          const [x0, x1, y0, y1] = rg;
          const px = (x0 + x1) / 2, py = (y0 + y1) / 2;
          // Aim the opening glide inward (toward the hero centre), so the bounce
          // cycle starts moving in rather than straight out to the edge.
          const ix = cx - px, iy = cy - py, il = Math.hypot(ix, iy) || 1;
          photos.push({
            img: faceImgs[i % faceImgs.length], r, x0, x1, y0, y1,
            x: px, y: py, scale: 1, dispR: r,
            vx: (ix / il) * 0.06,
            vy: (iy / il) * 0.06,
          });
        });
      }
    };
    build();
    window.addEventListener("resize", build);

    const pointer = { x: -9999, y: -9999, on: false };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.on = true;
    };
    const onLeave = () => { pointer.on = false; pointer.x = pointer.y = -9999; };
    const host = canvas.parentElement;
    if (finePointer && !reduced && host) {
      host.addEventListener("mousemove", onMove);
      host.addEventListener("mouseleave", onLeave);
    }

    const LINK2 = 130 * 130;
    const CUR2 = 175 * 175;
    const PR = 230, PR2 = PR * PR;       // portrait ↔ point link range (wider = more wired in)
    const REACT = 240, REACT2 = REACT * REACT; // cursor influence on portraits

    const frame = (tms) => {
      const t = tms / 1000;
      const dt = lastT ? Math.min(0.05, t - lastT) : 0;
      lastT = t;
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

      // Drift points.
      if (!reduced) {
        for (const a of pts) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < -12) a.x = W + 12; else if (a.x > W + 12) a.x = -12;
          if (a.y < -12) a.y = H + 12; else if (a.y > H + 12) a.y = -12;
        }
        // Portraits drift + shy away from the cursor; when the cursor lands on
        // one it holds still and springs to 2× (snaps back fast on leave).
        for (const ph of photos) {
          const dxp = pointer.x - ph.x, dyp = pointer.y - ph.y;
          const hovered = pointer.on && dxp * dxp + dyp * dyp < ph.dispR * ph.dispR;
          ph.scale += ((hovered ? 1.8 : 1) - ph.scale) * (hovered ? 0.16 : 0.3);
          ph.dispR = ph.r * ph.scale;
          if (!hovered) {
            ph.x += ph.vx; ph.y += ph.vy;
            const d2 = dxp * dxp + dyp * dyp;
            if (pointer.on && d2 < REACT2 && d2 > 1) {
              const d = Math.sqrt(d2), f = 0.04 * (1 - d / REACT);
              ph.vx -= (dxp / d) * f; ph.vy -= (dyp / d) * f;
            }
            const sp = Math.hypot(ph.vx, ph.vy) || 1, tsp = clamp(sp, 0.04, 0.18);
            ph.vx = (ph.vx / sp) * tsp; ph.vy = (ph.vy / sp) * tsp;
            if (ph.x < ph.x0) { ph.x = ph.x0; ph.vx = Math.abs(ph.vx); }
            else if (ph.x > ph.x1) { ph.x = ph.x1; ph.vx = -Math.abs(ph.vx); }
            if (ph.y < ph.y0) { ph.y = ph.y0; ph.vy = Math.abs(ph.vy); }
            else if (ph.y > ph.y1) { ph.y = ph.y1; ph.vy = -Math.abs(ph.vy); }
          }
        }
      }

      // Point ↔ point links + cursor links.
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

      // Portrait links — wire each face into nearby points (from the ring edge),
      // and to the cursor (a bright link that springs up as you move near).
      ctx.lineWidth = 1.2;
      for (const ph of photos) {
        for (const a of pts) {
          const dx = a.x - ph.x, dy = a.y - ph.y, d2 = dx * dx + dy * dy;
          if (d2 > PR2 || d2 < ph.dispR * ph.dispR) continue;
          const d = Math.sqrt(d2);
          const ex = ph.x + (dx / d) * ph.dispR, ey = ph.y + (dy / d) * ph.dispR;
          ctx.strokeStyle = `rgba(16, 59, 104, ${(1 - d2 / PR2) * 0.3})`;
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(a.x, a.y); ctx.stroke();
        }
        if (pointer.on) {
          const dx = pointer.x - ph.x, dy = pointer.y - ph.y, d2 = dx * dx + dy * dy;
          if (d2 < REACT2 && d2 > ph.dispR * ph.dispR) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(41, 167, 208, ${(1 - d2 / REACT2) * 0.65})`;
            ctx.lineWidth = 1.7;
            ctx.beginPath();
            ctx.moveTo(ph.x + (dx / d) * ph.dispR, ph.y + (dy / d) * ph.dispR);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
            ctx.lineWidth = 1.2;
          }
        }
      }
      ctx.lineWidth = 1;

      // Spawn signal pulses from a portrait along one of its live links.
      pulseTimer += dt;
      if (!reduced && photos.length && pulseTimer > 1.1) {
        pulseTimer = 0;
        const ph = photos[(Math.random() * photos.length) | 0];
        const near = pts.filter((a) => {
          const dx = a.x - ph.x, dy = a.y - ph.y; return dx * dx + dy * dy < PR2;
        });
        if (near.length) pulses.push({ ph, a: near[(Math.random() * near.length) | 0], prog: 0, dur: 0.95 });
      }

      // Glowing points.
      for (const a of pts) {
        let r = a.r, alpha = 0.5;
        if (pointer.on) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < CUR2) { const k = 1 - d2 / CUR2; r += k * 1.4; alpha += k * 0.4; }
        }
        ctx.beginPath();
        ctx.shadowColor = `rgba(${a.c}, 0.9)`; ctx.shadowBlur = 7;
        ctx.fillStyle = `rgba(${a.c}, ${alpha})`;
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Travel + draw pulses (recompute endpoints each frame as nodes move).
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.prog += dt / p.dur;
        if (p.prog >= 1) { pulses.splice(i, 1); continue; }
        const { ph, a } = p;
        const dx = a.x - ph.x, dy = a.y - ph.y, d = Math.hypot(dx, dy) || 1;
        const ex = ph.x + (dx / d) * ph.dispR, ey = ph.y + (dy / d) * ph.dispR;
        const px = ex + (a.x - ex) * p.prog, py = ey + (a.y - ey) * p.prog;
        ctx.save();
        ctx.shadowColor = "rgba(41, 167, 208, 0.9)"; ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(120, 210, 235, ${0.9 * (1 - Math.abs(0.5 - p.prog) * 1.4)})`;
        ctx.beginPath(); ctx.arc(px, py, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Portraits as luminous aurora-ringed nodes (glow → photo → gradient ring).
      for (const ph of photos) {
        const img = ph.img, r = ph.dispR;
        if (!img || !img.complete || !img.naturalWidth) continue;
        const gg = ctx.createRadialGradient(ph.x, ph.y, r * 0.8, ph.x, ph.y, r * 1.55);
        gg.addColorStop(0, "rgba(41, 167, 208, 0.2)");
        gg.addColorStop(1, "rgba(41, 167, 208, 0)");
        ctx.fillStyle = gg;
        ctx.beginPath(); ctx.arc(ph.x, ph.y, r * 1.55, 0, Math.PI * 2); ctx.fill();

        ctx.save();
        ctx.beginPath(); ctx.arc(ph.x, ph.y, r, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, ph.x - r, ph.y - r, r * 2, r * 2);
        ctx.fillStyle = `rgba(41, 167, 208, ${0.05 * clamp(2 - ph.scale, 0, 1)})`;
        ctx.fillRect(ph.x - r, ph.y - r, r * 2, r * 2);
        ctx.restore();

        const ring = ctx.createLinearGradient(ph.x - r, ph.y - r, ph.x + r, ph.y + r);
        ring.addColorStop(0, "rgba(41, 167, 208, 0.95)");
        ring.addColorStop(0.5, "rgba(104, 199, 133, 0.9)");
        ring.addColorStop(1, "rgba(139, 123, 216, 0.95)");
        ctx.lineWidth = 2.5 * (0.7 + 0.3 * ph.scale); ctx.strokeStyle = ring;
        ctx.beginPath(); ctx.arc(ph.x, ph.y, r, 0, Math.PI * 2); ctx.stroke();
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
