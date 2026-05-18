"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { PERSONAL_INFO } from "@/lib/data";
import { shouldReduceMotion } from "@/lib/animations";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), {
  ssr: false,
});

// ─── Text scramble hook ───────────────────────────────────────────────────────

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function useTextScramble(target: string, startDelay: number) {
  const [display, setDisplay] = useState(() => target.replace(/./g, " "));
  const resolved = useRef<boolean[]>([]);

  useEffect(() => {
    resolved.current = new Array(target.length).fill(false);
    let elapsed = 0;
    const SCRAMBLE_DURATION = 600;
    const RESOLVE_STAGGER = SCRAMBLE_DURATION / target.length;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        elapsed += 40;
        setDisplay(
          target
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (elapsed >= i * RESOLVE_STAGGER + SCRAMBLE_DURATION / 2) {
                resolved.current[i] = true;
              }
              if (resolved.current[i]) return char;
              return CHARSET[Math.floor(Math.random() * CHARSET.length)];
            })
            .join("")
        );

        if (resolved.current.every(Boolean)) clearInterval(interval);
      }, 40);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [target, startDelay]);

  return display;
}

// ─── Rotating tagline component ───────────────────────────────────────────────

function RotatingTagline({ taglines }: { taglines: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cycle = () => {
      // Fade out
      gsap.to(taglineRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setIndex((i) => (i + 1) % taglines.length);
          setVisible(false);
          setTimeout(() => setVisible(true), 50);
        },
      });
    };
    const id = setInterval(cycle, 3500);
    return () => clearInterval(id);
  }, [taglines.length]);

  useEffect(() => {
    if (!visible || !taglineRef.current) return;
    gsap.fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [visible, index]);

  return (
    <p
      ref={taglineRef}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 20,
        fontWeight: 400,
        color: "rgba(189,216,233,0.85)",
        margin: 0,
        minHeight: 32,
        letterSpacing: "0.01em",
      }}
    >
      {taglines[index]}
    </p>
  );
}

// ─── Scroll indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      if (window.scrollY > 100) {
        gsap.to(ref.current, { opacity: 0, duration: 0.4 });
      } else {
        gsap.to(ref.current, { opacity: 1, duration: 0.4 });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Scanner animation on the line
    if (lineRef.current)
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: 1,
      }}
    >
      <div
        ref={lineRef}
        style={{
          width: 1,
          height: 40,
          backgroundColor: "#49769F",
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "#6EA2B3",
        }}
      >
        SCROLL
      </span>
    </div>
  );
}

// ─── Tech icons (inline SVG paths) ────────────────────────────────────────────

const TECH_ICONS: { label: string; path: string }[] = [
  {
    label: "React",
    path: "M12 9.861A2.139 2.139 0 1 0 12 14.14 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.467a23.357 23.357 0 0 0-1.364-3.578l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.139s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.258c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 5.956 4.488 3.825 5.943 3l.27-.153.182.27a23.455 23.455 0 0 0 2.026 2.91l.135.166-.135.166a23.307 23.307 0 0 0-1.863 3.21l-.126.301-.494-.131-.628-.794zM6.508 3.844c-.982.shorts 1.06 2.564 1.568 4.817a24.897 24.897 0 0 1 1.442-2.813A24.647 24.647 0 0 1 8.2 3.628a3.932 3.932 0 0 0-1.692.216zm12.04 5.101l-.126-.302a23.653 23.653 0 0 0-1.863-3.21l-.134-.166.134-.166a23.355 23.355 0 0 0 2.025-2.91l.182-.267.27.153c1.455.826 1.755 2.957.765 5.434l-.133.467-.494.131-.626.836zM18.44 8.624c.507-2.253.586-4.317-.396-4.98a24.415 24.415 0 0 1-1.319 2.22 24.718 24.718 0 0 1 1.715 2.76zM5.31 15.16l.628-.795.494-.131.126.302a23.544 23.544 0 0 0 1.863 3.21l.135.166-.135.166a23.481 23.481 0 0 0-2.026 2.91l-.182.268-.27-.153c-1.455-.826-1.755-2.956-.765-5.434l.133-.509zm1.634 1.302c-.507 2.253-.586 4.317.396 4.98.488-.708.97-1.458 1.319-2.22a24.717 24.717 0 0 1-1.715-2.76zm11.12-1.302l.133.467c.989 2.478.69 4.608-.765 5.434l-.27.153-.182-.268a23.449 23.449 0 0 0-2.025-2.91l-.134-.166.134-.166a23.633 23.633 0 0 0 1.863-3.21l.126-.302.494.131.626.837zm-1.634-1.302a24.702 24.702 0 0 1-1.715 2.76 24.415 24.415 0 0 1 1.319 2.22c.982-.663.903-2.726.396-4.98z",
  },
  {
    label: "Next.js",
    path: "M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8988-.108 1.7442 0 .7213.0092.9318.0962 1.5231.6865 4.7862 3.9785 8.7248 8.619 10.4631.2675.1006.5421.1915.8313.2747.1889.0533.2543.0722.3595.0722.1052 0 .1682-.0178.3469-.0713.6865-.1945 1.3604-.4641 1.9878-.8143.1484-.0845.1868-.1144.1676-.1418a.4288.4288 0 0 0-.0819-.0706l-1.2006-.8215c-.1076-.0735-.1346-.0904-.1699-.0904-.0352 0-.0612.011-.1558.0619-.3167.1757-.6397.3306-1.0297.4745l-.3316.1197-.3462-.1268c-.4263-.157-.8313-.3432-1.2042-.5608l-.2783-.1612-.1198-.0688v-.005l1.1965-.8192c.0774-.053.1156-.0807.1156-.1106 0-.0339-.0275-.0538-.3235-.2278l-1.0296-.6004-.1697-.099c-.1196-.0694-.1568-.0786-.2093-.0691-.0418.0079-.0921.0444-.3143.2163l-.5491.4175-.1475.1119-.2275-.1528a8.7124 8.7124 0 0 1-1.1588-1.0358l-.1476-.1716.1148-.1597c.1597-.2222.3169-.4523.4497-.681l.1285-.2224-.1285-.2194-.4497-.6811-.1148-.1596.1476-.1717a8.7085 8.7085 0 0 1 1.1588-1.0357l.2275-.1528.1475.1119.5491.4175c.2222.1719.2724.2084.3143.2163.0525.0095.0897.0003.2093-.0691l1.0296-.6004c.2961-.1741.3235-.194.3235-.2278 0-.0299-.0382-.0576-.1156-.1106l-1.1965-.8192v-.005l.1198-.0688.2783-.1612c.3729-.2176.7779-.4038 1.2042-.5608l.3462-.1268.3316.1197c.39.1439.713.2988 1.0297.4745.0946.0509.1206.0619.1558.0619.0353 0 .0623-.0169.1699-.0904l1.2006-.8215a.4288.4288 0 0 0 .0819-.0706c.0192-.0274-.0192-.0573-.1676-.1418a10.3285 10.3285 0 0 0-1.9878-.8143c-.1787-.0535-.2417-.0713-.3469-.0713z",
  },
  {
    label: "Python",
    path: "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.04zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z",
  },
  {
    label: "Node.js",
    path: "M11.998 24a1.362 1.362 0 0 1-.697-.19L8.61 22.066c-.348-.198-.178-.268-.064-.308.55-.19.66-.232 1.243-.562.061-.035.143-.022.206.014l2.07 1.231c.075.04.181.04.25 0l8.068-4.657c.075-.043.123-.129.123-.217V6.435c0-.091-.048-.174-.126-.22l-8.063-4.648a.246.246 0 0 0-.248 0L3.99 6.215a.252.252 0 0 0-.127.221v9.31c0 .088.048.171.124.215l2.21 1.275c1.196.598 1.93-.107 1.93-.815V7.36c0-.13.104-.232.234-.232h1.02c.127 0 .233.102.233.232v8.862c0 1.597-.869 2.514-2.384 2.514-.466 0-.832 0-1.854-.505l-2.11-1.217a1.4 1.4 0 0 1-.697-1.212V6.435a1.4 1.4 0 0 1 .697-1.212l8.07-4.66a1.46 1.46 0 0 1 1.4 0l8.067 4.66c.43.248.697.71.697 1.212v9.31a1.4 1.4 0 0 1-.697 1.213l-8.067 4.657a1.362 1.362 0 0 1-.703.185zm2.49-6.41c-3.528 0-4.265-1.621-4.265-2.982 0-.13.104-.232.234-.232h1.04c.115 0 .213.084.231.197.157 1.06.625 1.596 2.763 1.596 1.702 0 2.427-.385 2.427-1.288 0-.52-.206-.907-2.852-1.167-2.213-.22-3.58-.709-3.58-2.483 0-1.636 1.38-2.611 3.69-2.611 2.597 0 3.885.901 4.046 2.836a.233.233 0 0 1-.06.177.236.236 0 0 1-.172.076h-1.044a.233.233 0 0 1-.226-.186c-.253-1.12-.867-1.479-2.544-1.479-1.875 0-2.092.652-2.092 1.14 0 .593.257.765 2.764 1.097 2.483.33 3.662.796 3.662 2.54 0 1.766-1.474 2.79-4.042 2.79z",
  },
  {
    label: "Three.js",
    path: "M.38 0h23.24L12 23.23zm1.88 1.26L11.12 20.4V2.5L2.26 1.26zM12.88 2.5V20.4l8.86-19.14zM3.04 2.5h8.08L3.04 18.57zm9.84 0l8.08 16.07z",
  },
];

// ─── CTA Button ───────────────────────────────────────────────────────────────

function CTAButton({
  children,
  onClick,
  variant,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant: "solid" | "outline";
  href?: string;
}) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const onEnter = () => {
    if (variant === "solid") {
      gsap.to(ref.current, { scale: 1.03, backgroundColor: "#FFBB3E", duration: 0.25, ease: "power2.out" });
    } else {
      gsap.to(ref.current, { borderColor: "#F5A623", color: "#F5A623", duration: 0.25, ease: "power2.out" });
    }
  };

  const onLeave = () => {
    if (variant === "solid") {
      gsap.to(ref.current, { scale: 1, backgroundColor: "#F5A623", duration: 0.25, ease: "power2.out" });
    } else {
      gsap.to(ref.current, { borderColor: "#6EA2B3", color: "#BDD8E9", duration: 0.25, ease: "power2.out" });
    }
  };

  const sharedStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: variant === "solid" ? 600 : 500,
    padding: "12px 28px",
    cursor: "none",
    textDecoration: "none",
    display: "inline-block",
    letterSpacing: "0.04em",
    ...(variant === "solid"
      ? { backgroundColor: "#F5A623", color: "#001020", border: "none" }
      : {
          backgroundColor: "transparent",
          color: "#BDD8E9",
          border: "1px solid #6EA2B3",
        }),
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={sharedStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={sharedStyle}
    >
      {children}
    </button>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const atulRef = useRef<HTMLSpanElement>(null);
  const parmarRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const atulText = useTextScramble("ATUL", 600);
  const parmarText = useTextScramble("PARMAR", 800);

  const scrollToProjects = useCallback(() => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Entrance GSAP timeline
  useEffect(() => {
    if (shouldReduceMotion()) return;
    const ctx = gsap.context(() => {
      const initialEls = [
        labelRef.current,
        atulRef.current,
        parmarRef.current,
        taglineRef.current,
        ctaRef.current,
        techRef.current,
        scrollRef.current,
      ].filter((el): el is HTMLElement => el !== null);

      if (initialEls.length) gsap.set(initialEls, { opacity: 0 });
      if (particleWrapRef.current) gsap.set(particleWrapRef.current, { opacity: 0 });

      const tl = gsap.timeline();

      // 0s: particles fade in
      if (particleWrapRef.current)
        tl.to(particleWrapRef.current, { opacity: 1, duration: 1, ease: "power2.out" }, 0);

      // 0.3s: label fades up
      if (labelRef.current)
        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.3
        );

      // 0.6s: ATUL fades in (scramble is already running)
      if (atulRef.current) tl.to(atulRef.current, { opacity: 1, duration: 0.3 }, 0.6);

      // 0.8s: PARMAR fades in
      if (parmarRef.current) tl.to(parmarRef.current, { opacity: 1, duration: 0.3 }, 0.8);

      // 1.4s: tagline fades up
      if (taglineRef.current)
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          1.4
        );

      // 1.7s: CTA buttons
      const ctaChildren = ctaRef.current ? Array.from(ctaRef.current.children) : [];
      if (ctaChildren.length)
        tl.fromTo(
          ctaChildren,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.15, ease: "power2.out" },
          1.7
        );

      // 2.0s: tech icons stagger
      const icons = iconRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (icons.length)
        tl.fromTo(
          icons,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" },
          2.0
        );

      // 2.3s: scroll indicator
      if (scrollRef.current)
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          2.3
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        backgroundColor: "#001D39",
      }}
    >
      {/* Layer 1 — Particle field */}
      <div ref={particleWrapRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <ParticleField />
      </div>

      {/* Layer 1b — Radial vignette for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,8,20,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 2 — Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          gap: 0,
        }}
      >
        {/* Available label */}
        <div
          ref={labelRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "inline-block",
              animation: "pulse-glow 2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#4E8EA2",
              userSelect: "none",
            }}
          >
            [ AVAILABLE FOR OPPORTUNITIES ]
          </span>
        </div>

        {/* Heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
            lineHeight: 1.05,
          }}
        >
          <span
            ref={atulRef}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(64px, 10vw, 120px)",
              color: "#FFFFFF",
              letterSpacing: "0.05em",
              display: "block",
            }}
          >
            {atulText}
          </span>
          <span
            ref={parmarRef}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(64px, 10vw, 120px)",
              color: "#F5A623",
              letterSpacing: "0.05em",
              display: "block",
            }}
          >
            {parmarText}
          </span>
        </div>

        {/* Rotating tagline */}
        <div ref={taglineRef} style={{ marginBottom: 40, textAlign: "center" }}>
          <RotatingTagline taglines={PERSONAL_INFO.taglines} />
        </div>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 72,
          }}
        >
          <CTAButton variant="solid" onClick={scrollToProjects}>
            View My Work
          </CTAButton>
          <CTAButton variant="outline" href="/Atul_Parmar_Resume.pdf">
            Download Resume
          </CTAButton>
        </div>

        {/* Tech stack icons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "#6EA2B3",
            }}
          >
            BUILT WITH
          </span>
          <div
            ref={techRef}
            style={{ display: "flex", gap: 28, alignItems: "flex-end" }}
          >
            {TECH_ICONS.map((tech, i) => (
              <div
                key={tech.label}
                ref={(el) => { iconRefs.current[i] = el; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  fill="#49769F"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={tech.path} />
                </svg>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#49769F",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tech.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — bottom center */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <ScrollIndicator />
      </div>
    </section>
  );
}
