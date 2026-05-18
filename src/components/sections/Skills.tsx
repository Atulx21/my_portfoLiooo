"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "@/lib/animations";
import { SKILLS } from "@/lib/data";

// ─── Config ───────────────────────────────────────────────────────────────────

// Skills that get the special "proficient" treatment
const FEATURED = new Set(["React", "Python", "Node.js", "LangChain"]);

// Dot colors per featured skill
const FEATURED_DOT: Record<string, string> = {
  React:      "#61dafb",
  Python:     "#ffd43b",
  "Node.js":  "#68a063",
  LangChain:  "#14b8a6",
};

// Category display order + labels
const CATEGORIES: { key: keyof typeof SKILLS; label: string }[] = [
  { key: "Languages",  label: "Languages" },
  { key: "Frameworks", label: "Frameworks & Libraries" },
  { key: "Databases",  label: "Databases" },
  { key: "Tools",      label: "Dev Tools" },
  { key: "Coursework", label: "Coursework" },
];

// ─── Circuit-board SVG pattern ────────────────────────────────────────────────

function CircuitPattern() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.04,
        pointerEvents: "none",
        zIndex: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* horizontal traces */}
          <line x1="0" y1="20" x2="30" y2="20" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="50" y1="20" x2="80" y2="20" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="0" y1="60" x2="20" y2="60" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="60" y1="60" x2="80" y2="60" stroke="#4E8EA2" strokeWidth="1" />
          {/* vertical traces */}
          <line x1="40" y1="0" x2="40" y2="15" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="40" y1="25" x2="40" y2="55" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="40" y1="65" x2="40" y2="80" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="20" y1="60" x2="20" y2="80" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="60" y1="0"  x2="60" y2="60"  stroke="#4E8EA2" strokeWidth="1" />
          {/* nodes */}
          <circle cx="40" cy="20" r="2.5" fill="#4E8EA2" />
          <circle cx="40" cy="60" r="2.5" fill="#4E8EA2" />
          <circle cx="20" cy="60" r="2"   fill="#4E8EA2" />
          <circle cx="60" cy="60" r="2"   fill="#4E8EA2" />
          <circle cx="60" cy="20" r="1.5" fill="#4E8EA2" />
          {/* IC pads */}
          <rect x="32" y="36" width="16" height="8" rx="1" fill="none" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="28" y1="38" x2="32" y2="38" stroke="#4E8EA2" strokeWidth="1" />
          <line x1="48" y1="40" x2="52" y2="40" stroke="#4E8EA2" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

// ─── Connector SVG (decorative lines between rows) ────────────────────────────

function ConnectorLines({ rowCount }: { rowCount: number }) {
  const pathRef = useRef<SVGGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!pathRef.current) return;

    const paths = pathRef.current.querySelectorAll("path");
    paths.forEach((p) => {
      const len = (p as SVGPathElement).getTotalLength?.() ?? 200;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.to(Array.from(paths), {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power2.inOut",
      stagger: 0.3,
      scrollTrigger: {
        trigger: pathRef.current,
        start: "top 85%",
        once: true,
      },
    });
  }, []);

  // Build simple zigzag connectors — one per gap between rows
  const lines: string[] = [];
  for (let i = 0; i < rowCount - 1; i++) {
    const y1 = 80 + i * 110 + 55;
    const y2 = y1 + 55;
    lines.push(`M 60 ${y1} C 60 ${(y1 + y2) / 2} 120 ${(y1 + y2) / 2} 120 ${y2}`);
  }

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 180,
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "visible",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g ref={pathRef}>
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#49769F"
            strokeWidth="1"
            strokeOpacity="0.15"
          />
        ))}
      </g>
    </svg>
  );
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────

function Chip({ name }: { name: string }) {
  const [hovered, setHovered] = useState(false);
  const isFeatured = FEATURED.has(name);
  const dot = FEATURED_DOT[name];

  return (
    <div
      data-chip
      data-cursor="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#0A4174",
        border: `1px solid ${hovered || isFeatured ? "#4E8EA2" : "#49769F"}`,
        borderRadius: 4,
        padding: "8px 16px",
        cursor: "none",
        transition: "border-color 250ms, box-shadow 250ms, transform 250ms, color 250ms",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        boxShadow: hovered ? "0 0 16px rgba(78,142,162,0.3)" : "none",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: isFeatured ? 6 : 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          color: hovered ? "#BDD8E9" : "#7BBDE8",
          transition: "color 250ms",
          whiteSpace: "nowrap",
        }}
      >
        {isFeatured && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: dot,
              flexShrink: 0,
              boxShadow: `0 0 6px ${dot}`,
            }}
          />
        )}
        {name}
      </span>
      {isFeatured && (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#4E8EA2",
            letterSpacing: "0.12em",
            marginTop: 3,
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms",
            userSelect: "none",
          }}
        >
          PROFICIENT
        </span>
      )}
    </div>
  );
}

// ─── Category Row ─────────────────────────────────────────────────────────────

function CategoryRow({
  label,
  items,
  rowRef,
}: {
  label: string;
  items: string[];
  rowRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={rowRef}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "#6EA2B3",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 16,
          display: "block",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {items.map((name) => (
          <Chip key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export default function Skills() {
  const sectionRef    = useRef<HTMLElement>(null);
  const headerRef     = useRef<HTMLDivElement>(null);
  const rowsAreaRef   = useRef<HTMLDivElement>(null);
  const rowRefs       = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── Header fade-up ───────────────────────────────────────────────────
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

      // ── Rows slide-in with chip stagger ──────────────────────────────────
      rowRefs.current.forEach((row, i) => {
        if (!row) return;

        gsap.fromTo(
          row,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              once: true,
            },
          }
        );

        // Chips within the row
        const chips = row.querySelectorAll<HTMLDivElement>("[data-chip]");
        if (chips.length) {
          gsap.fromTo(
            Array.from(chips),
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.4)",
              stagger: 0.05,
              delay: i * 0.15 + 0.1,
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
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
    <section
      ref={sectionRef}
      id="skills"
      style={{
        position: "relative",
        padding: "120px 0",
        backgroundColor: "#001D39",
        overflow: "hidden",
      }}
    >
      {/* Circuit pattern background */}
      <CircuitPattern />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 80,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "#4E8EA2",
              letterSpacing: "0.15em",
              marginBottom: 16,
              display: "block",
            }}
          >
            {`// TECHNICAL STACK`}
          </span>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 5vw, 64px)",
              color: "#BDD8E9",
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              marginBottom: 24,
            }}
          >
            What I Work With
          </h2>
          <div
            style={{
              width: 120,
              height: 1,
              backgroundColor: "#49769F",
            }}
          />
        </div>

        {/* ── Categories area + connector lines ─────────────────────────── */}
        <div ref={rowsAreaRef} style={{ position: "relative" }}>
          <ConnectorLines rowCount={CATEGORIES.length} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 56,
              position: "relative",
              zIndex: 2,
            }}
          >
            {CATEGORIES.map(({ key, label }, i) => (
              <CategoryRow
                key={key}
                label={label}
                items={SKILLS[key]}
                rowRef={(el) => { rowRefs.current[i] = el; }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
