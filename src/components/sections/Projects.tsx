"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "@/lib/animations";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";

// ─── Tag chip ─────────────────────────────────────────────────────────────────

function TagChip({
  label,
  accentColor,
}: {
  label: string;
  accentColor: string;
}) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: accentColor,
        border: `1px solid ${accentColor}`,
        borderRadius: 999,
        padding: "4px 12px",
        whiteSpace: "nowrap",
        backgroundColor: `${accentColor}22`,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

// ─── Tech pill ────────────────────────────────────────────────────────────────

function TechPill({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: "rgba(255,255,255,0.82)",
        backgroundColor: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 4,
        padding: "4px 12px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── Card button ──────────────────────────────────────────────────────────────

function CardButton({
  href,
  variant,
  children,
  accentColor,
}: {
  href: string | null;
  variant: "outline" | "solid";
  children: React.ReactNode;
  accentColor?: string;
}) {
  const solidBg = accentColor ?? "#4E8EA2";
  const ref = useRef<HTMLAnchorElement>(null);

  if (!href) return null;

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => {
        if (ref.current) gsap.to(ref.current, { y: -3, scale: 1.02, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={() => {
        if (ref.current) gsap.to(ref.current, { y: 0, scale: 1, duration: 0.2, ease: "power2.out" });
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 42,
        padding: "0 22px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: "0.07em",
        textDecoration: "none",
        cursor: "none",
        borderRadius: 5,
        transition: "background-color 200ms, color 200ms, border-color 200ms",
        ...(variant === "outline"
          ? { border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.88)", backgroundColor: "transparent" }
          : { border: "none", color: "#000E1A", backgroundColor: solidBg, fontWeight: 600 }),
      }}
    >
      {children}
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
    </a>
  );
}

// ─── Single project card ──────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  cardRef,
}: {
  project: Project;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  // Even index → panel left / image right; odd → image left / panel right
  const panelOnLeft = index % 2 === 0;
  const num = String(index + 1).padStart(2, "0");

  const onMouseEnter = () => {
    if (imgRef.current)
      gsap.to(imgRef.current, { scale: 1.05, duration: 0.7, ease: "power2.out" });
  };
  const onMouseLeave = () => {
    if (imgRef.current)
      gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power2.out" });
  };

  const Panel = (
    <div
      key="panel"
      style={{
        position: "relative",
        padding: "52px 48px 52px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "rgba(0,5,16,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          [panelOnLeft ? "left" : "right"]: 0,
          width: 3,
          height: "100%",
          backgroundColor: project.accentColor,
        }}
      />
      {/* Watermark number */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 24,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 130,
          color: project.accentColor,
          opacity: 0.06,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {num}
      </div>
      {/* Tags */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {project.tags.map((t) => (
          <TagChip key={t} label={t} accentColor={project.accentColor} />
        ))}
      </div>
      {/* Title */}
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(44px, 5vw, 68px)",
          color: "#FFFFFF",
          margin: 0,
          marginBottom: 12,
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}
      >
        {project.title}
      </h3>
      {/* Accent rule */}
      <div
        style={{
          width: 48,
          height: 2,
          backgroundColor: project.accentColor,
          marginBottom: 20,
          borderRadius: 1,
        }}
      />
      {/* Description */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14.5,
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.8,
          margin: 0,
          marginBottom: 24,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {project.description}
      </p>
      {/* Tech pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 32 }}>
        {project.techStack.map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </div>
      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <CardButton href={project.github} variant="outline">GitHub</CardButton>
        <CardButton href={project.demo} variant="solid" accentColor={project.accentColor}>Live Demo</CardButton>
      </div>
    </div>
  );

  const ImagePane = (
    <div
      key="image"
      style={{ position: "relative", overflow: "hidden", minHeight: 380 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div ref={imgRef} style={{ position: "absolute", inset: 0, transformOrigin: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: project.imagePlaceholder }} />
        <Image
          src={`/images/projects/${project.id}.jpg`}
          alt={project.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>
      {/* Blend toward panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: panelOnLeft
            ? "linear-gradient(to left, transparent 45%, rgba(0,5,16,0.95) 100%)"
            : "linear-gradient(to right, transparent 45%, rgba(0,5,16,0.95) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,5,16,0.25) 0%, transparent 20%, transparent 80%, rgba(0,5,16,0.35) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );

  return (
    <div
      ref={cardRef}
      className="proj-card"
      style={{
        display: "grid",
        gridTemplateColumns: panelOnLeft ? "55fr 45fr" : "45fr 55fr",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${project.accentColor}18`,
      }}
    >
      {panelOnLeft ? [Panel, ImagePane] : [ImagePane, Panel]}
    </div>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
          }
        );
      }
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 82%", once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 860px) {
          .proj-card { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="projects"
        style={{ backgroundColor: "#00101E", padding: "120px 0 140px" }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 48px" }}>

          {/* Header */}
          <div
            ref={headerRef}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 72,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              paddingBottom: 32,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#4E8EA2",
                  letterSpacing: "0.22em",
                  display: "block",
                  marginBottom: 14,
                  textTransform: "uppercase",
                }}
              >
                // Selected Work
              </span>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(56px, 8vw, 110px)",
                  color: "#FFFFFF",
                  margin: 0,
                  lineHeight: 0.88,
                  letterSpacing: "0.01em",
                }}
              >
                Projects
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
                paddingBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {String(PROJECTS.length).padStart(2, "0")} Projects
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.18)",
                  letterSpacing: "0.04em",
                }}
              >
                2024 – 2026
              </span>
            </div>
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                cardRef={(el) => { cardRefs.current[i] = el; }}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
