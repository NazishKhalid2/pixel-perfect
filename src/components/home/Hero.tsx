import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import { initSmoothScroll, scrollToY } from "@/lib/smooth-scroll";
import desktopVideo from "@/assets/hero/assembly.mp4.asset.json";
import mobileVideo from "@/assets/hero/assembly-mobile.mp4.asset.json";
import finalFrame from "@/assets/hero-final.jpg";

/** Media source switch. "frames" draws /hero/frames/frame_0001.jpg ... to a canvas. */
export const HERO_SOURCE: "video" | "frames" = "video";
const FRAME_COUNT = 240;
const frameUrl = (i: number) => `/hero/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

/** Film is played between these scroll progress points. */
const FILM_START = 0.1;
const FILM_END = 0.92;

const CAPTIONS = [
  { text: "Mounting frame", corner: "top-28 left-6 md:left-12" },
  { text: "Filter housings", corner: "bottom-28 right-6 md:right-12" },
  { text: "Water softener", corner: "top-28 right-6 md:right-12" },
  { text: "Control valve", corner: "bottom-28 left-6 md:left-12" },
  { text: "UV sterilizer", corner: "top-28 left-6 md:left-12" },
];

/** Nudge these x positions (percent of stage width) to align labels under each unit. */
export const UNIT_LABELS = {
  softener: { x: 24, label: "Water Softener" },
  filter: { x: 52, label: "Triple Filtration" },
  uv: { x: 76, label: "UV Sterilizer" },
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(0);
  const [p, setP] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMobile(window.innerWidth < 768);
  }, []);

  // Loader: buffer progress, with a safety timeout so the page never stalls.
  useEffect(() => {
    if (reduced) return setReady(true);
    const t = window.setTimeout(() => setReady(true), 8000);
    if (HERO_SOURCE === "video") {
      const v = videoRef.current;
      if (!v) return;
      const onProg = () => {
        if (v.duration && v.buffered.length) setLoaded(v.buffered.end(v.buffered.length - 1) / v.duration);
      };
      const onReady = () => { setLoaded(1); setReady(true); v.play().then(() => v.pause()).catch(() => {}); };
      const onErr = () => { setFailed(true); setReady(true); };
      v.addEventListener("progress", onProg);
      v.addEventListener("canplaythrough", onReady);
      v.addEventListener("error", onErr);
      v.load();
      return () => { clearTimeout(t); v.removeEventListener("progress", onProg); v.removeEventListener("canplaythrough", onReady); v.removeEventListener("error", onErr); };
    }
    return () => clearTimeout(t);
  }, [reduced, mobile]);

  // Image sequence preload + draw.
  const frames = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    if (HERO_SOURCE !== "frames" || reduced) return;
    let count = 0;
    frames.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.onload = img.onerror = () => { count++; setLoaded(count / FRAME_COUNT); if (count === FRAME_COUNT) setReady(true); };
      img.src = frameUrl(i);
      return img;
    });
  }, [reduced]);

  // Scroll scrubbing.
  useEffect(() => {
    if (reduced || !wrapRef.current) return;
    initSmoothScroll();
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => { target.current = self.progress; },
    });
    let current = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const loop = () => {
      current += (target.current - current) * 0.12;
      if (Math.abs(target.current - current) < 0.0005) current = target.current;
      setP((prev) => (Math.abs(prev - current) > 0.0008 ? current : prev));
      const film = range(current, FILM_START, FILM_END);
      const v = videoRef.current;
      if (HERO_SOURCE === "video" && v && v.duration) {
        const t = film * (v.duration - 0.05);
        if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
      }
      const c = canvasRef.current;
      if (HERO_SOURCE === "frames" && c) {
        const img = frames.current[Math.round(film * (FRAME_COUNT - 1))];
        if (img?.complete && img.naturalWidth) {
          const w = window.innerWidth * dpr, h = window.innerHeight * dpr;
          if (c.width !== w) { c.width = w; c.height = h; }
          const ctx = c.getContext("2d")!;
          const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
          const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
          ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); st.kill(); };
  }, [reduced]);

  const skip = () => {
    const el = wrapRef.current;
    if (el) scrollToY(el.offsetTop + el.offsetHeight - window.innerHeight);
  };

  const prog = reduced ? 1 : p;
  const showFinal = reduced || failed;
  const intro = 1 - range(prog, 0.06, 0.12);
  const capIdx = prog >= 0.1 && prog < 0.8 ? Math.floor(((prog - 0.1) / 0.7) * CAPTIONS.length) : -1;
  const capLocal = capIdx >= 0 ? (((prog - 0.1) / 0.7) * CAPTIONS.length) % 1 : 0;
  const capOpacity = capIdx >= 0 ? Math.min(range(capLocal, 0, 0.2), 1 - range(capLocal, 0.8, 1)) : 0;
  const labels = showFinal ? 1 : range(prog, 0.82, 0.88);
  const brand = showFinal ? 1 : range(prog, 0.92, 0.97);
  const cta = showFinal ? 1 : range(prog, 0.95, 1);
  const src = mobile ? mobileVideo.url : desktopVideo.url;

  return (
    <section id="hero" ref={wrapRef} className="relative bg-navy" style={{ height: reduced ? "100vh" : "500vh" }} aria-label="MENA AQUA Tru introduction">
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-fallback">
        {/* Media */}
        {showFinal ? (
          <img src={finalFrame} alt="" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-center" />
        ) : HERO_SOURCE === "video" ? (
          <video
            key={src}
            ref={videoRef}
            src={src}
            poster={undefined}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        )}

        {/* Vignette for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/70 via-transparent to-navy/40" />

        {/* Intro: light sweep + scroll cue */}
        {!showFinal && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: intro }}>
            <div className="absolute inset-0 light-sweep" />
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-on-dark-muted">
              <span className="text-[0.7rem] uppercase tracking-[0.3em]">Scroll</span>
              <span className="h-8 w-px hairline animate-cue" />
            </div>
          </div>
        )}

        {/* Assembly captions */}
        {capIdx >= 0 && capIdx < CAPTIONS.length && (() => {
          const cap = CAPTIONS[capIdx]!;
          return (
            <div className={`pointer-events-none absolute ${cap.corner} flex items-center gap-3`} style={{ opacity: capOpacity }}>
              <span className="h-px w-10 hairline" />
              <span className="font-display text-xs uppercase tracking-[0.25em] text-on-dark">
                <span className="mr-2 text-aqua">0{capIdx + 1}</span>{cap.text}
              </span>
            </div>
          );
        })()}

        {/* Unit labels */}
        {!failed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[6%] hidden h-16 sm:block" style={{ opacity: labels }}>
            {Object.values(UNIT_LABELS).map((u) => (
              <div key={u.label} className="absolute flex -translate-x-1/2 flex-col items-center gap-2" style={{ left: `${u.x}%` }}>
                <span className="h-6 w-px hairline" />
                <span className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.22em] text-on-dark">{u.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Brand reveal */}
        <div className="absolute inset-x-0 top-[13%] flex flex-col items-center px-5 text-center" style={{ opacity: brand, transform: `scale(${0.94 + brand * 0.06})`, pointerEvents: brand > 0.5 ? "auto" : "none" }}>
          <h1 className="sr-only">MENA AQUA Tru water filtration in Dubai</h1>
          <div className="relative overflow-hidden">
            <Logo size="xl" />
            <div className="pointer-events-none absolute inset-0 light-sweep" />
          </div>
          <p className="mt-4 font-display text-lg text-on-dark md:text-2xl" style={{ opacity: cta }}>Pure water. Better living.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3" style={{ opacity: cta, transform: `translateY(${(1 - cta) * 12}px)` }}>
            <Link to="/products" className="btn btn-primary" tabIndex={cta > 0.5 ? 0 : -1}>Explore Filters</Link>
            <Link to="/contact" className="btn btn-ghost-dark" tabIndex={cta > 0.5 ? 0 : -1}>Book a Free Consultation</Link>
          </div>
        </div>

        {/* Skip intro */}
        {!showFinal && prog < 0.9 && (
          <button onClick={skip} className="absolute bottom-8 right-6 text-xs uppercase tracking-[0.2em] text-on-dark-muted underline-offset-4 hover:text-on-dark hover:underline md:right-12">
            Skip intro
          </button>
        )}

        {/* Loader */}
        {!ready && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-navy" role="status" aria-label="Loading">
            <Logo />
            <div className="h-px w-48 bg-on-dark/15">
              <div className="h-px bg-aqua transition-[width] duration-300" style={{ width: `${Math.max(6, loaded * 100)}%` }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
