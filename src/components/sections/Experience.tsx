"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "@/lib/animations";
import { EXPERIENCE } from "@/lib/data";

// ─── Experience card ──────────────────────────────────────────────────────────

function ExperienceCard({
  item,
  side,
  cardRef,
}: {
  item: (typeof EXPERIENCE)[number];
  side: "left" | "right";
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#0A4174",
        border: `1px solid ${hovered ? "#4E8EA2" : "#49769F"}`,
        borderRadius: 8,
        padding: 32,
        maxWidth: 380,
        width: "100%",
        cursor: "default",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 32px rgba(78,142,162,0.18)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        transition:
          "border-color 250ms, box-shadow 250ms, transform 250ms",
        // On desktop, push left cards to the left and right cards to the right
        marginLeft: side === "right" ? "auto" : undefined,
        marginRight: side === "left" ? "auto" : undefined,
      }}
    >
      {/* Top row: company + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "#6EA2B3",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {item.company}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#4E8EA2",
            border: "1px solid #4E8EA2",
            borderRadius: 2,
            padding: "2px 7px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {item.type === "Intern" ? "INTERNSHIP" : item.type.toUpperCase()}
        </span>
      </div>

      {/* Role */}
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          color: "#BDD8E9",
          lineHeight: 1.1,
          letterSpacing: "0.02em",
          marginBottom: 6,
        }}
      >
        {item.role}
      </div>

      {/* Period */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: "#4E8EA2",
          marginBottom: 20,
        }}
      >
        {item.period}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          backgroundColor: "#49769F",
          opacity: 0.4,
          marginBottom: 20,
        }}
      />

      {/* Bullet points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {item.description.map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                color: "#F5A623",
                flexShrink: 0,
                lineHeight: 1.7,
              }}
            >
              →
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#7BBDE8",
                lineHeight: 1.7,
              }}
            >
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {item.techStack.map((tech) => (
          <span
            key={tech}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#7BBDE8",
              backgroundColor: "#001D39",
              border: "1px solid #1E5A8E",
              borderRadius: 3,
              padding: "3px 10px",
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

export default function Experience() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<SVGLineElement>(null);
  const dotRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── Header fade-up ─────────────────────────────────────────────────
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ── Timeline line draw ─────────────────────────────────────────────
      if (lineRef.current) {
        const len = lineRef.current.getTotalLength?.() ?? 600;
        gsap.set(lineRef.current, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 1,
          },
        });
      }

      // ── Dots + cards ───────────────────────────────────────────────────
      EXPERIENCE.forEach((_, i) => {
        const dot  = dotRefs.current[i];
        const card = cardRefs.current[i];
        const isLeft = i % 2 === 0;

        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              ease: "back.out(2)",
              delay: i * 0.2,
              scrollTrigger: {
                trigger: dot,
                start: "top 80%",
                once: true,
              },
              onComplete() {
                // Pulse glow
                gsap.to(dot, {
                  boxShadow: "0 0 16px rgba(78,142,162,0.6)",
                  duration: 0.8,
                  repeat: 3,
                  yoyo: true,
                  ease: "power2.inOut",
                });
              },
            }
          );
        }

        if (card) {
          gsap.fromTo(
            card,
            { x: isLeft ? -50 : 50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: i * 0.2,
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .exp-entry {
          display: grid;
          grid-template-columns: 1fr 48px 1fr;
          align-items: start;
          gap: 0;
          position: relative;
        }
        .exp-entry-left  { grid-column: 1; display: flex; justify-content: flex-end; padding-right: 32px; padding-bottom: 64px; }
        .exp-entry-right { grid-column: 3; padding-left: 32px; padding-bottom: 64px; }
        .exp-entry-mid   { grid-column: 2; display: flex; flex-direction: column; align-items: center; }
        /* On odd entries, card is on left side — mirror the columns */
        .exp-entry.right-card .exp-entry-left  { visibility: hidden; }
        .exp-entry.left-card  .exp-entry-right { visibility: hidden; }

        @media (max-width: 767px) {
          .exp-entry {
            grid-template-columns: 28px 1fr;
          }
          .exp-entry-left  { display: none; }
          .exp-entry-mid   { grid-column: 1; }
          .exp-entry-right { grid-column: 2; padding-left: 24px; }
          /* For entries that are "left-card" on desktop, move to right on mobile */
          .exp-entry.left-card .exp-entry-right {
            visibility: visible;
          }
          .exp-entry.left-card .exp-entry-left {
            display: none;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="experience"
        style={{
          padding: "120px 0",
          backgroundColor: "#001D39",
          overflowX: "clip",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            ref={headerRef}
            style={{
              textAlign: "center",
              marginBottom: 80,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "#4E8EA2",
                letterSpacing: "0.15em",
                display: "block",
                marginBottom: 16,
              }}
            >
              {`// EXPERIENCE`}
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                color: "#BDD8E9",
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: "0.02em",
              }}
            >
              Where I&apos;ve Worked
            </h2>
          </div>

          {/* ── Timeline ───────────────────────────────────────────────── */}
          <div style={{ position: "relative" }}>

            {/* SVG vertical line behind entries */}
            <svg
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: "translateX(-50%)",
                width: 2,
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
                zIndex: 0,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                ref={lineRef}
                x1="1"
                y1="0"
                x2="1"
                y2="100%"
                stroke="#0A4174"
                strokeWidth="1"
              />
            </svg>

            {/* Entries */}
            {EXPERIENCE.map((item, i) => {
              const isLeft = i % 2 === 0; // even = card on LEFT, odd = card on RIGHT
              return (
                <div
                  key={item.company}
                  className={`exp-entry ${isLeft ? "left-card" : "right-card"}`}
                >
                  {/* Left slot */}
                  <div className="exp-entry-left">
                    {isLeft && (
                      <ExperienceCard
                        item={item}
                        side="left"
                        cardRef={(el) => { cardRefs.current[i] = el; }}
                      />
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="exp-entry-mid" style={{ paddingTop: 32 }}>
                    <div
                      ref={(el) => { dotRefs.current[i] = el; }}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid #4E8EA2",
                        backgroundColor: "#001D39",
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 2,
                      }}
                    />
                  </div>

                  {/* Right slot */}
                  <div className="exp-entry-right">
                    {!isLeft && (
                      <ExperienceCard
                        item={item}
                        side="right"
                        cardRef={(el) => { cardRefs.current[i] = el; }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
