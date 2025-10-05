import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CURSOR_IMG = "/assets/cursor-arrow/cursor.png";
const FINGER_IMG = "/assets/cursor-arrow/cursor-finger.png";
// Configure visual size and tip alignment so hover/click triggers at the tip
const CURSOR_SIZE = 28; // px - smaller for tighter precision
// Arrow cursor hotspot near the right-center edge
const ARROW_TIP_X_RATIO = 1.0; // 0..1 from left
const ARROW_TIP_Y_RATIO = 0.50; // 0..1 from top
// Finger cursor hotspot (approximate fingertip location inside image)
const FINGER_TIP_X_RATIO = 0.40; // tuned to align fingertip with native point
const FINGER_TIP_Y_RATIO = 0.18; // tuned to align fingertip with native point
// Additional per-mode pixel adjustments for sub-pixel alignment
const ARROW_ADJ_X = 0;
const ARROW_ADJ_Y = 0;
const FINGER_ADJ_X = 1; // nudge right a bit
const FINGER_ADJ_Y = 1; // nudge down a bit
const TRAIL_COLOR = "#E54717"; // requested color

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(true);
  const [imgReady, setImgReady] = useState(false);
  const [logged, setLogged] = useState(false);
  const [enabled, setEnabled] = useState(false); // disabled on mobile/tablet
  const [isPointerTarget, setIsPointerTarget] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaledCursorRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  // For line-based trail
  const pointsRef = useRef<Array<{ x: number; y: number; lifetime: number }>>([]);
  // For click ripple effects
  const ripplesRef = useRef<
    Array<{ x: number; y: number; frame: number; delay: number; maxFrames: number; startR: number; endR: number }>
  >([]);

  // Decide if we should enable the custom cursor (disable on mobile/tablet)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use broader query to catch hybrid devices; enable if any-pointer is fine
    const mq = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    // Fallback: if we detect a real mousemove, enable regardless of MQ
    const mouseEnableOnce = (e: MouseEvent) => {
      setEnabled(true);
      window.removeEventListener("mousemove", mouseEnableOnce);
    };
    window.addEventListener("mousemove", mouseEnableOnce, { passive: true });
    // Additional fallbacks: desktop-sized viewport and wheel usage
    if (window.innerWidth >= 768) setEnabled(true);
    const wheelEnableOnce = () => {
      setEnabled(true);
      window.removeEventListener("wheel", wheelEnableOnce);
    };
    window.addEventListener("wheel", wheelEnableOnce, { passive: true });
    // Additionally, if any touch interaction occurs, force-disable
    const handleFirstTouch = () => setEnabled(false);
    window.addEventListener("touchstart", handleFirstTouch, { passive: true });
    window.addEventListener("touchmove", handleFirstTouch, { passive: true });
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("mousemove", mouseEnableOnce);
      window.removeEventListener("wheel", wheelEnableOnce);
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("touchmove", handleFirstTouch);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Ensure native cursor is visible
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    // Activate CSS that hides the native cursor
    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const handleMove = (e: MouseEvent) => {
      if (!logged) {
        console.debug("CustomCursor: mousemove detected");
        setLogged(true);
      }
      setVisible(true);
      setPos({ x: e.clientX, y: e.clientY });
      // Determine if we are over an element that would show a pointer cursor
      // IMPORTANT: hit-test at the VISIBLE TIP position so the switch happens
      // as soon as the tip touches the text/interactive element.
      // Add a slight forward bias and small neighborhood sampling for early detection.
      // Hit-test exactly at the real mouse point so native :hover matches
      const baseTipX = e.clientX;
      const baseTipY = e.clientY;

      const pointerSel = "a,button,[role=\"button\"],input,textarea,select,label,summary,.cursor-pointer,[data-cursor=pointer]";
      let pointer = false;
      const el = document.elementFromPoint(baseTipX, baseTipY) as Element | null;
      if (el) {
        if (el.closest(pointerSel)) {
          pointer = true;
        } else {
          try {
            const cs = window.getComputedStyle(el);
            if (cs.cursor && cs.cursor.includes("pointer")) {
              pointer = true;
            }
          } catch {}
        }
      }
      setIsPointerTarget(pointer);
      // Always hide native cursor; we render our own overlay
      try {
        const rootEl = document.documentElement as HTMLElement;
        rootEl.style.cursor = "none";
      } catch {}
      // Add a point for the line-based trail; seed twice on first move so it renders immediately
      if (pointsRef.current.length === 0) {
        pointsRef.current.push({ x: e.clientX, y: e.clientY, lifetime: 0 });
      }
      pointsRef.current.push({ x: e.clientX, y: e.clientY, lifetime: 0 });
    };

    window.addEventListener("mousemove", handleMove);
    const handleDown = (e: MouseEvent) => {
      // Create 3 concentric ripples with slight stagger
      const base = { x: e.clientX, y: e.clientY };
      const COUNT = 3;
      const maxFrames = 36; // ~0.6s at 60fps
      const startR = 2;
      const endR = 44; // bigger final radius for more visible ripples
      for (let i = 0; i < COUNT; i++) {
        ripplesRef.current.push({
          x: base.x,
          y: base.y,
          frame: 0,
          delay: i * 4, // slight delay between rings
          maxFrames,
          startR,
          endR,
        });
      }
    };
    window.addEventListener("mousedown", handleDown, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      // Reset any forced cursor style on cleanup
      try {
        const rootEl = document.documentElement as HTMLElement;
        rootEl.style.cursor = "";
      } catch {}
      // Deactivate CSS if component ever unmounts
      root.classList.remove("custom-cursor-active");
    };
  }, [enabled, logged, isPointerTarget]);

  // Preload the cursor image and track if it loads successfully
  useEffect(() => {
    if (!enabled) return;
    const img = new Image();
    img.onload = () => {
      setImgReady(true);
      // Build a browser-friendly scaled cursor (many browsers reject PNG cursors larger than 32x32 on Windows)
      try {
        const CANVAS_SIZE = 32; // 32 is safest for cross-browser support
        const c = document.createElement("canvas");
        c.width = CANVAS_SIZE;
        c.height = CANVAS_SIZE;
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          // draw centered and contain within box
          const ratio = Math.min(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
          const w = Math.max(1, Math.round(img.width * ratio));
          const h = Math.max(1, Math.round(img.height * ratio));
          const x = Math.floor((CANVAS_SIZE - w) / 2);
          const y = Math.floor((CANVAS_SIZE - h) / 2);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, x, y, w, h);
          const url = c.toDataURL("image/png");
          scaledCursorRef.current = url;
        }
      } catch {}
    };
    img.onerror = () => setImgReady(false);
    img.src = CURSOR_IMG;
  }, [enabled]);

  // Setup and run the canvas-based line trail
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      // reset transform before scaling to avoid compounding scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    // Line-based trail adapted to requested style
    const tick = () => {
      // Clear entire canvas each frame (DPR-safe)
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const points = pointsRef.current;
      // Duration in frames (not milliseconds): ~0.18s at 60fps ≈ 11 frames
      const duration = Math.round(0.18 * 60);

      for (let i = 1; i < points.length; ++i) {
        const point = points[i];
        const lastPoint = points[i - 1];

        point.lifetime += 1;
        if (point.lifetime > duration) {
          // Remove oldest point
          points.shift();
          i--; // adjust index after shift
          continue;
        }

        // Life percent: 0..1
        const lifePercent = point.lifetime / duration;
        // Slightly thinner overall line for a subtler aesthetic
        const spreadRate = Math.max(0.6, 3 * (1 - lifePercent));

        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = spreadRate;
        // Fade alpha with life, with a much lighter baseline
        const alpha = Math.max(0.08, 0.5 * (1 - lifePercent));
        ctx.strokeStyle = hexToRgba(TRAIL_COLOR, alpha);

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
      }

      // Draw click ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.frame += 1;
        if (r.frame < r.delay) continue; // not started yet
        const t = (r.frame - r.delay) / r.maxFrames; // 0..1
        if (t >= 1) {
          ripplesRef.current.splice(i, 1);
          continue;
        }
        const radius = r.startR + (r.endR - r.startR) * t;
        const alpha = Math.max(0, 0.2 * (1 - t)); // lighter ripple
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(TRAIL_COLOR, alpha);
        ctx.lineWidth = 1.5;
        // remove glow for a cleaner, lighter look
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.closePath();
      }

      if (!logged) {
    }
    rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [enabled]);

  function hexToRgba(hex: string, a = 1) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const size = CURSOR_SIZE; // Rendered size of the cursor image (px)

  if (!enabled) return null;

  const tipXRatio = isPointerTarget ? FINGER_TIP_X_RATIO : ARROW_TIP_X_RATIO;
  const tipYRatio = isPointerTarget ? FINGER_TIP_Y_RATIO : ARROW_TIP_Y_RATIO;
  const adjX = isPointerTarget ? FINGER_ADJ_X : ARROW_ADJ_X;
  const adjY = isPointerTarget ? FINGER_ADJ_Y : ARROW_ADJ_Y;
  const cursorEl = (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 2147483646, // just under the cursor image
        }}
      />

      {/* Cursor image/fallback box */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: size,
          height: size,
          // transform: `translate(${pos.x - size * tipXRatio + adjX}px, ${pos.y - size * tipYRatio + adjY}px)`,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          backgroundImage: imgReady ? `url(${isPointerTarget ? FINGER_IMG : CURSOR_IMG})` : "none",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundColor: imgReady ? "transparent" : "rgba(255, 80, 0, 0.35)",
          borderRadius: imgReady ? 0 : 8,
          boxShadow: imgReady ? "none" : "0 0 8px rgba(0,0,0,0.35)",
          pointerEvents: "none",
          zIndex: 2147483647,
          opacity: visible ? 1 : 0,
          transition: "opacity 120ms ease-out",
          willChange: "transform",
        }}
      />
    </>
  );

  // Render into body to avoid clipping/stacking context issues
  const body = typeof document !== "undefined" ? document.body : null;
  return body ? createPortal(cursorEl, body) : null;
};

export default CustomCursor;
