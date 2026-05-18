"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (
        !circleRef.current ||
        !nameRef.current ||
        !lineRef.current ||
        !subtitleRef.current ||
        !topHalfRef.current ||
        !bottomHalfRef.current ||
        !containerRef.current
      ) return;

      const tl = gsap.timeline();

      // Entrance: fade in core elements staggered
      tl.fromTo(
        circleRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
      )
        .fromTo(
          nameRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.1"
        )
        .fromTo(
          lineRef.current,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
          "-=0.1"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        );

      // Counter: count from 0 to 100 over 2 seconds from t=0
      const counterObj = { value: 0 };
      gsap.to(counterObj, {
        value: 100,
        duration: 2,
        ease: "power1.inOut",
        onUpdate() {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counterObj.value)}%`;
          }
        },
      });

      // Exit at 2.2s: split screen
      tl.to(
        containerRef.current,
        { pointerEvents: "none", duration: 0 },
        2.2
      )
        .to(
          topHalfRef.current,
          {
            yPercent: -100,
            duration: 0.6,
            ease: "cubic-bezier(0.76, 0, 0.24, 1)",
          },
          2.2
        )
        .to(
          bottomHalfRef.current,
          {
            yPercent: 100,
            duration: 0.6,
            ease: "cubic-bezier(0.76, 0, 0.24, 1)",
          },
          2.2
        )
        .call(() => {
          onComplete();
        });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Top half */}
      <div
        ref={topHalfRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "#001D39",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "48px",
          gap: "20px",
        }}
      >
        {/* Glowing teal circle */}
        <div
          ref={circleRef}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#14b8a6",
            boxShadow:
              "0 0 0 0 rgba(20, 184, 166, 0.7), 0 0 20px rgba(20, 184, 166, 0.5)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />

        {/* Name */}
        <p
          ref={nameRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32,
            letterSpacing: "0.3em",
            color: "#BDD8E9",
            margin: 0,
            userSelect: "none",
          }}
        >
          ATUL PARMAR
        </p>
      </div>

      {/* Bottom half */}
      <div
        ref={bottomHalfRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "#001D39",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "48px",
          gap: "20px",
        }}
      >
        {/* Animated line */}
        <svg
          width={200}
          height={2}
          overflow="visible"
          style={{ display: "block" }}
        >
          <line
            ref={lineRef}
            x1={0}
            y1={1}
            x2={200}
            y2={1}
            stroke="#14b8a6"
            strokeWidth={1}
            strokeLinecap="round"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              vectorEffect: "non-scaling-stroke",
            }}
            pathLength={1}
          />
        </svg>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "#6EA2B3",
            margin: 0,
            userSelect: "none",
          }}
        >
          PORTFOLIO 2026
        </p>

        {/* Percentage counter — bottom left of the full viewport via absolute */}
      </div>

      {/* Counter: absolute to viewport, bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 40,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.1em",
          color: "#6EA2B3",
          userSelect: "none",
          zIndex: 1,
        }}
      >
        <span ref={counterRef}>0%</span>
      </div>
    </div>
  );
}
