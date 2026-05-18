"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const logoUnderlineRef = useRef<SVGLineElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const bar1Ref = useRef<HTMLSpanElement>(null);
  const bar2Ref = useRef<HTMLSpanElement>(null);
  const bar3Ref = useRef<HTMLSpanElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Scroll listener for nav background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Mobile menu open/close animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    const b1 = bar1Ref.current;
    const b2 = bar2Ref.current;
    const b3 = bar3Ref.current;
    if (!menu) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        mobileLinkRefs.current.filter(Boolean),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power3.out", delay: 0.1 }
      );
      // Hamburger → X
      gsap.to(b1, { rotation: 45, y: 8, duration: 0.3, ease: "power2.inOut" });
      gsap.to(b2, { opacity: 0, duration: 0.2 });
      gsap.to(b3, { rotation: -45, y: -8, duration: 0.3, ease: "power2.inOut" });
    } else {
      document.body.style.overflow = "";
      gsap.to(menu, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
      // X → hamburger
      gsap.to(b1, { rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(b2, { opacity: 1, duration: 0.2 });
      gsap.to(b3, { rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
    }
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      if (menuOpen) setMenuOpen(false);
    },
    [menuOpen]
  );

  const handleLogoMouseEnter = () => {
    if (!logoUnderlineRef.current) return;
    gsap.fromTo(
      logoUnderlineRef.current,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }
    );
  };

  const handleLogoMouseLeave = () => {
    if (!logoUnderlineRef.current) return;
    gsap.to(logoUnderlineRef.current, {
      strokeDashoffset: 1,
      duration: 0.3,
      ease: "power2.in",
    });
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 64,
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          backgroundColor: scrolled ? "rgba(0, 29, 57, 0.85)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(78, 142, 162, 0.2)"
            : "1px solid transparent",
          transition: "background-color 400ms ease, backdrop-filter 400ms ease, border-color 400ms ease",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onMouseEnter={handleLogoMouseEnter}
          onMouseLeave={handleLogoMouseLeave}
          style={{ textDecoration: "none", position: "relative", display: "inline-block" }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24,
              color: "#F5A623",
              letterSpacing: "0.05em",
              lineHeight: 1,
              display: "block",
            }}
          >
            AP
          </span>
          <svg
            width="100%"
            height={2}
            style={{ position: "absolute", bottom: -3, left: 0, overflow: "visible" }}
          >
            <line
              ref={logoUnderlineRef}
              x1={0}
              y1={1}
              x2="100%"
              y2={1}
              stroke="#14b8a6"
              strokeWidth={1.5}
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </a>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeSection === id;
              return (
                <DesktopLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  isActive={isActive}
                  onClick={handleNavClick}
                />
              );
            })}
          </div>
        )}

        {/* Hire Me button (desktop) / Hamburger (mobile) */}
        {!isMobile ? (
          <HireMeButton />
        ) : (
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {[bar1Ref, bar2Ref, bar3Ref].map((ref, i) => (
              <span
                key={i}
                ref={ref}
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  backgroundColor: "#BDD8E9",
                  transformOrigin: "center",
                }}
              />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        ref={mobileMenuRef}
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          zIndex: 99,
          backgroundColor: "rgba(0, 29, 57, 0.98)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            ref={(el) => { mobileLinkRefs.current[i] = el; }}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 48,
              color: activeSection === link.href.slice(1) ? "#F5A623" : "#BDD8E9",
              textDecoration: "none",
              letterSpacing: "0.05em",
              lineHeight: 1.1,
              transition: "color 200ms ease",
            }}
          >
            {link.label}
          </a>
        ))}

        <div style={{ marginTop: 32 }}>
          <HireMeButton />
        </div>
      </div>
    </>
  );
}

// ─── Desktop nav link with amber dot indicator ────────────────────────────────

function DesktopLink({
  label,
  href,
  isActive,
  onClick,
}: {
  label: string;
  href: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const dotRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    gsap.to(dotRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: "back.out(2)",
    });
  };

  const handleMouseLeave = () => {
    if (isActive) return;
    gsap.to(dotRef.current, {
      opacity: 0,
      scale: 0,
      duration: 0.15,
      ease: "power2.in",
    });
  };

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        letterSpacing: "0.05em",
        color: isActive ? "#BDD8E9" : "#7BBDE8",
        textDecoration: "none",
        paddingBottom: 10,
        transition: "color 200ms ease",
        display: "inline-block",
      }}
    >
      {label}
      {/* Amber dot below */}
      <span
        ref={dotRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#F5A623",
          opacity: isActive ? 1 : 0,
          scale: isActive ? "1" : "0",
          display: "block",
        }}
      />
    </a>
  );
}

// ─── Hire Me button ───────────────────────────────────────────────────────────

function HireMeButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    gsap.to(btnRef.current, {
      backgroundColor: "#F5A623",
      color: "#001D39",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      backgroundColor: "transparent",
      color: "#F5A623",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <a
      ref={btnRef}
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: "0.05em",
        color: "#F5A623",
        border: "1px solid #F5A623",
        padding: "8px 20px",
        backgroundColor: "transparent",
        textDecoration: "none",
        display: "inline-block",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      Hire Me
    </a>
  );
}
