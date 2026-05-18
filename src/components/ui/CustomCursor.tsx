"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CustomCursorProps {}

export default function CustomCursor(_props: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);
  const cursorState = useRef<"default" | "hover" | "text">("default");
  const hasMoved = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const LERP = 0.18; // ~80ms lag at 60fps

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // quickSetters for high-frequency position updates in RAF
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    function tick() {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * LERP;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * LERP;

      setDotX(mouse.current.x);
      setDotY(mouse.current.y);
      setRingX(ringPos.current.x);
      setRingY(ringPos.current.y);

      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!hasMoved.current) {
        hasMoved.current = true;
        // Seed ring position to avoid first-frame snap
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        setTimeout(() => {
          gsap.to([dot, ring], { opacity: 1, duration: 0.3, ease: "power2.out" });
        }, 500);
      }
    }

    function applyDefaultState() {
      if (cursorState.current === "default") return;
      cursorState.current = "default";
      document.body.classList.remove("cursor-hover");
      gsap.to(dot, {
        width: 8,
        height: 8,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(ring, {
        width: 36,
        height: 36,
        borderColor: "#4E8EA2",
        borderWidth: "1.5px",
        borderRadius: "50%",
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    function applyHoverState() {
      if (cursorState.current === "hover") return;
      cursorState.current = "hover";
      document.body.classList.add("cursor-hover");
      gsap.to(dot, {
        width: 4,
        height: 4,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(ring, {
        width: 60,
        height: 60,
        borderColor: "#F5A623",
        borderWidth: "1.5px",
        borderRadius: "50%",
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    function applyTextState() {
      if (cursorState.current === "text") return;
      cursorState.current = "text";
      document.body.classList.remove("cursor-hover");
      gsap.to(dot, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
      });
      gsap.to(ring, {
        width: 2,
        height: 24,
        borderColor: "#BDD8E9",
        borderWidth: "1.5px",
        borderRadius: "1px",
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as Element;

      if (target.closest('a, button, [data-cursor="hover"]')) {
        applyHoverState();
        return;
      }

      if (target.closest("p, h1, h2, h3, h4, h5, h6")) {
        applyTextState();
        return;
      }

      applyDefaultState();
    }

    function onMouseDown() {
      gsap.to(dot, { scale: 0.8, duration: 0.1, ease: "power2.out" });
      gsap.to(ring, { scale: 0.8, duration: 0.1, ease: "power2.out" });
    }

    function onMouseUp() {
      gsap.to(dot, { scale: 1, duration: 0.15, ease: "back.out(2.5)" });
      gsap.to(ring, { scale: 1, duration: 0.15, ease: "back.out(2.5)" });
    }

    function onMouseLeave() {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    }

    function onMouseEnter() {
      if (hasMoved.current) {
        const dotTargetOpacity = cursorState.current === "text" ? 0 : 1;
        gsap.to(dot, { opacity: dotTargetOpacity, duration: 0.2 });
        gsap.to(ring, { opacity: cursorState.current === "hover" ? 0.6 : 1, duration: 0.2 });
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.body.classList.remove("cursor-hover");
    };
  }, []);

  return (
    <>
      {/* Dot — tracks mouse with zero delay */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#F5A623",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
        }}
      />

      {/* Ring — lags behind dot via lerp */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid #4E8EA2",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9997,
          willChange: "transform",
        }}
      />
    </>
  );
}
