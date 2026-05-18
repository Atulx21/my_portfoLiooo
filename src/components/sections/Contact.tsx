"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "@/lib/animations";
import { PERSONAL_INFO } from "@/lib/data";

// ─── Magnetic wrapper ─────────────────────────────────────────────────────────

function Magnetic({
  children,
  intensity = 0.3,
}: {
  children: React.ReactNode;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * intensity;
      const dy = (e.clientY - cy) * intensity;
      gsap.to(el, { x: dx, y: dy, duration: 0.25, ease: "power2.out" });
    },
    [intensity]
  );

  const onMouseLeave = useCallback(() => {
    if (ref.current)
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1,0.5)" });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ display: "inline-block" }}
    >
      {children}
    </div>
  );
}

// ─── Terminal typewriter ──────────────────────────────────────────────────────

function Terminal({ active }: { active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const full = `> ${PERSONAL_INFO.name}`;

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [active, full]);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        color: "#4E8EA2",
        letterSpacing: "0.06em",
        marginBottom: 32,
        height: 22,
      }}
    >
      {displayed}
      <span style={{ opacity: cursorOn ? 1 : 0, transition: "opacity 0.1s" }}>|</span>
    </div>
  );
}

// ─── Email block with clipboard ───────────────────────────────────────────────

function EmailBlock() {
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  const onMouseEnter = () => {
    if (underlineRef.current)
      gsap.to(underlineRef.current, { scaleX: 1, duration: 0.35, ease: "power2.out" });
  };
  const onMouseLeave = () => {
    if (underlineRef.current)
      gsap.to(underlineRef.current, { scaleX: 0, duration: 0.25, ease: "power2.in" });
  };

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: silent fail
    }
  };

  return (
    <Magnetic intensity={0.25}>
      <div
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ position: "relative", display: "inline-block", cursor: "none" }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(14px, 4vw, 20px)",
            color: "#BDD8E9",
            letterSpacing: "0.02em",
            wordBreak: "break-all",
          }}
        >
          {PERSONAL_INFO.email}
        </span>

        {/* Animated underline */}
        <span
          ref={underlineRef}
          style={{
            display: "block",
            height: 1,
            backgroundColor: "#F5A623",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            marginTop: 4,
          }}
        />

        {/* Copied tooltip */}
        <span
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#F5A623",
            backgroundColor: "#0A4174",
            border: "1px solid #F5A623",
            borderRadius: 3,
            padding: "3px 10px",
            whiteSpace: "nowrap",
            opacity: copied ? 1 : 0,
            transition: "opacity 200ms",
            pointerEvents: "none",
          }}
        >
          Copied!
        </span>
      </div>
    </Magnetic>
  );
}

// ─── Social icon button ───────────────────────────────────────────────────────

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const innerRef = useRef<HTMLAnchorElement>(null);

  return (
    <Magnetic intensity={0.35}>
      <a
        ref={innerRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => {
          if (innerRef.current)
            gsap.to(innerRef.current, { y: -4, color: "#BDD8E9", duration: 0.2, ease: "power2.out" });
        }}
        onMouseLeave={() => {
          if (innerRef.current)
            gsap.to(innerRef.current, { y: 0, color: "#6EA2B3", duration: 0.25, ease: "power2.out" });
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "#6EA2B3",
          textDecoration: "none",
          cursor: "none",
        }}
      >
        {icon}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      </a>
    </Magnetic>
  );
}

// ─── Resume button (fill from left) ──────────────────────────────────────────

function ResumeButton() {
  const fillRef  = useRef<HTMLSpanElement>(null);
  const textRef  = useRef<HTMLSpanElement>(null);
  const iconRef  = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (fillRef.current)
      gsap.to(fillRef.current, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    if (textRef.current)
      gsap.to(textRef.current, { color: "#001D39", duration: 0.2, delay: 0.1 });
    if (iconRef.current)
      gsap.to(iconRef.current, { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
  };
  const onLeave = () => {
    if (fillRef.current)
      gsap.to(fillRef.current, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    if (textRef.current)
      gsap.to(textRef.current, { color: "#F5A623", duration: 0.2 });
    if (iconRef.current)
      gsap.to(iconRef.current, { x: -8, opacity: 0, duration: 0.2 });
  };

  return (
    <a
      href="/Atul_Parmar_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "16px 48px",
        border: "2px solid #F5A623",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "none",
        textDecoration: "none",
      }}
    >
      {/* Fill layer */}
      <span
        ref={fillRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#F5A623",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          pointerEvents: "none",
        }}
      />

      {/* Download icon — slides in from left */}
      <span
        ref={iconRef}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          transform: "translateX(-8px)",
          opacity: 0,
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v13M6 11l6 6 6-6M3 21h18"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span
        ref={textRef}
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          color: "#F5A623",
          letterSpacing: "0.1em",
        }}
      >
        Download Resume
      </span>
    </a>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef   = useRef<HTMLElement>(null);
  const terminalRef  = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const subRef       = useRef<HTMLDivElement>(null);
  const emailRef     = useRef<HTMLDivElement>(null);
  const socialsRef   = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const [terminalActive, setTerminalActive] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── Initial states ──────────────────────────────────────────────────
      const fadeEls = [subRef.current, emailRef.current, socialsRef.current, ctaRef.current]
        .filter((el): el is HTMLDivElement => el !== null);
      gsap.set(fadeEls, { opacity: 0, y: 24 });

      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll<HTMLSpanElement>("[data-word]");
        gsap.set(Array.from(words), { opacity: 0, y: -40 });
      }

      // ── Terminal trigger ────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter() {
          setTerminalActive(true);
        },
      });

      // ── Heading words fall in ───────────────────────────────────────────
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll<HTMLSpanElement>("[data-word]");
        gsap.to(Array.from(words), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // ── Staggered fade-up for remaining blocks ──────────────────────────
      [subRef, emailRef, socialsRef, ctaRef].forEach((r, i) => {
        if (!r.current) return;
        gsap.to(r.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: r.current,
            start: "top 88%",
            once: true,
          },
          delay: i * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        minHeight: "100vh",
        padding: "120px 0",
        background: "linear-gradient(160deg, #00101E 0%, #001D39 45%, #002D5A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          width: "100%",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Terminal line */}
        <div ref={terminalRef}>
          <Terminal active={terminalActive} />
        </div>

        {/* Main heading */}
        <div
          ref={headingRef}
          style={{
            marginBottom: 28,
            lineHeight: 0.95,
            letterSpacing: "0.02em",
          }}
        >
          <div>
            <span
              data-word
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(56px, 8vw, 96px)",
                color: "#FFFFFF",
                display: "inline-block",
              }}
            >
              Let&apos;s Build
            </span>
          </div>
          <div>
            <span
              data-word
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(56px, 8vw, 96px)",
                color: "#F5A623",
                display: "inline-block",
              }}
            >
              Something
            </span>
          </div>
        </div>

        {/* Subtext */}
        <div ref={subRef} style={{ marginBottom: 52 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: "rgba(189,216,233,0.72)",
              maxWidth: 480,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Currently open to full-time roles, internships, and interesting projects.
            Based at IIIT Guwahati · Available from May 2026.
          </p>
        </div>

        {/* Email */}
        <div ref={emailRef} style={{ marginBottom: 52 }}>
          <EmailBlock />
        </div>

        {/* Social links */}
        <div
          ref={socialsRef}
          style={{
            display: "flex",
            gap: 32,
            justifyContent: "center",
            marginBottom: 64,
          }}
        >
          {/* GitHub */}
          <SocialLink
            href={PERSONAL_INFO.github}
            label="GitHub"
            icon={
              <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            }
          />

          {/* LinkedIn */}
          <SocialLink
            href={`https://linkedin.com/in/${PERSONAL_INFO.linkedin}`}
            label="LinkedIn"
            icon={
              <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            }
          />
        </div>

        {/* Resume CTA */}
        <div ref={ctaRef}>
          <ResumeButton />
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 80,
            width: "100%",
          }}
        >
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              marginBottom: 24,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#49769F",
                letterSpacing: "0.06em",
              }}
            >
              Designed &amp; Built by Atul Parmar
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#49769F",
                letterSpacing: "0.06em",
              }}
            >
              © 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
