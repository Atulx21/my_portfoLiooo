"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 3, suffix: "+", label: "Major Projects" },
  { value: 2, suffix: "", label: "Internships" },
  { value: 4, suffix: "+", label: "Technologies" },
] as const;

// ─── Arrow CTA link ───────────────────────────────────────────────────────────

function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const arrowRef = useRef<HTMLSpanElement>(null);

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById(href.replace("#", ""))
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      onMouseEnter={() => {
        if (arrowRef.current)
          gsap.to(arrowRef.current, { x: 4, duration: 0.25, ease: "power2.out" });
      }}
      onMouseLeave={() => {
        if (arrowRef.current)
          gsap.to(arrowRef.current, { x: 0, duration: 0.25, ease: "power2.out" });
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        color: "#F5A623",
        textDecoration: "none",
        letterSpacing: "0.05em",
        cursor: "none",
        alignSelf: "flex-start",
      }}
    >
      <span ref={arrowRef} style={{ display: "inline-flex", alignItems: "center" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="#F5A623"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </a>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!leftRef.current || !rightRef.current) return;

      // ── Initial states ────────────────────────────────────────────────────
      gsap.set(leftRef.current, { x: -60, opacity: 0 });
      gsap.set(rightRef.current, { x: 60, opacity: 0 });
      // Frame starts coinciding with image (CSS top:16,left:16 minus transform -16,-16 = 0,0)
      if (frameRef.current) gsap.set(frameRef.current, { x: -16, y: -16 });

      const trigger = {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      };

      // ── Column slide-ins ──────────────────────────────────────────────────
      gsap.to(leftRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      gsap.to(rightRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      // ── Frame reveal (0 offset → +16px offset) ───────────────────────────
      if (frameRef.current) {
        gsap.to(frameRef.current, {
          x: 0,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: trigger,
        });
      }

      // ── Stat counters ─────────────────────────────────────────────────────
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const { value, suffix } = STATS[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          val: value,
          duration: 1.8,
          ease: "power2.out",
          delay: i * 0.15,
          scrollTrigger: trigger,
          onUpdate() {
            if (el) el.textContent = Math.round(obj.val) + suffix;
          },
          onComplete() {
            if (el) el.textContent = value + suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .about-image-col {
            display: flex;
            justify-content: center;
            order: -1;
          }
        }
        @media (max-width: 600px) {
          .about-container { padding: 0 20px !important; }
        }
        @media (max-width: 500px) {
          .about-image-outer {
            transform: scale(0.78);
            transform-origin: top center;
            margin-bottom: -90px;
          }
          .about-float-badge { display: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="about"
        style={{
          minHeight: "100vh",
          padding: "120px 0",
          backgroundColor: "#001D39",
          overflowX: "clip",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }} className="about-container">
          <div className="about-grid">

            {/* ── LEFT — Image Block ──────────────────────────────────────── */}
            <div ref={leftRef} className="about-image-col">
              {/* Outer wrapper: relative, sized to image — cards & frame overflow freely */}
              <div
                className="about-image-outer"
                style={{ position: "relative", display: "inline-block" }}
              >
                {/* Decorative frame — behind image, GSAP animates from x:-16,y:-16 → 0,0 */}
                <div
                  ref={frameRef}
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    width: 420,
                    height: 520,
                    border: "2px solid #4E8EA2",
                    borderRadius: 4,
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Main image */}
                <div
                  style={{
                    position: "relative",
                    width: 420,
                    height: 520,
                    borderRadius: 4,
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  {/* Replace /images/about.jpeg with your own photo */}
                  <Image
                    src="/images/about.jpeg"
                    alt="Atul Parmar"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 340px, 420px"
                  />
                </div>

                {/* Floating card — bottom-left, overlapping image by ~30px */}
                <div
                  className="about-float-badge"
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: 20,
                    zIndex: 3,
                    backgroundColor: "#0A4174",
                    border: "1px solid #49769F",
                    borderRadius: 8,
                    padding: "16px 24px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 32,
                      color: "#F5A623",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    2+ Years
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: "#7BBDE8",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Building Products
                  </div>
                </div>

                {/* Floating badge — top-right, overlapping image by ~20px */}
                <div
                  className="about-float-badge"
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    zIndex: 3,
                    backgroundColor: "#001D39",
                    border: "1px solid #4E8EA2",
                    borderRadius: 8,
                    padding: "12px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Graduation cap icon */}
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#F5A623" />
                    <path
                      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
                      fill="#F5A623"
                      opacity="0.7"
                    />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: "#BDD8E9",
                        letterSpacing: "0.05em",
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      IIIT Guwahati
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10,
                        color: "#6EA2B3",
                        marginTop: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      B.Tech CSE · 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT — Text Block ──────────────────────────────────────── */}
            <div ref={rightRef} style={{ display: "flex", flexDirection: "column" }}>
              {/* Section label */}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: "#4E8EA2",
                  letterSpacing: "0.15em",
                  marginBottom: 20,
                  display: "block",
                }}
              >
                {`// ABOUT ME`}
              </span>

              {/* Heading */}
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  color: "#BDD8E9",
                  lineHeight: 1.05,
                  margin: 0,
                  marginBottom: 32,
                  letterSpacing: "0.02em",
                }}
              >
                Crafting Digital
                <br />
                Experiences
              </h2>

              {/* Body paragraphs */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 48,
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "#7BBDE8",
                    margin: 0,
                  }}
                >
                  I&apos;m a Computer Science student at IIIT Guwahati, passionate
                  about building full-stack systems and AI-powered applications
                  that solve real problems — from intelligent tutoring platforms
                  to social networks.
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "#7BBDE8",
                    margin: 0,
                  }}
                >
                  Through internships at Troywings and CASET, I&apos;ve shipped
                  features used by real users — optimizing APIs, designing
                  interfaces, and integrating machine learning into production
                  workflows.
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "#7BBDE8",
                    margin: 0,
                  }}
                >
                  What drives me is the intersection of clean engineering and
                  meaningful impact — building things that not only work, but
                  leave a mark.
                </p>
              </div>

              {/* Stat counters */}
              <div
                style={{
                  display: "flex",
                  gap: 40,
                  marginBottom: 48,
                }}
              >
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span
                      ref={(el) => {
                        statRefs.current[i] = el;
                      }}
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 48,
                        color: "#F5A623",
                        lineHeight: 1,
                      }}
                    >
                      {`0${stat.suffix}`}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: "#6EA2B3",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <ArrowLink href="#contact">Get In Touch</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
