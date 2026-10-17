import { useEffect, useRef, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const tw = gsap.fromTo(ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

const products = [
  { name: "AquaHome 6-Stage RO System", price: "AED 1,450", facts: ["Under-sink reverse osmosis", "6 stages: sediment, carbon x2, RO membrane, post-carbon, mineralizer", "280 litres/day", "12 L pressurized tank"] },
  { name: "AquaHome UV + RO Purifier", price: "AED 1,950", facts: ["Adds a UV chamber", "7 stages", "300 litres/day"] },
  { name: "VillaGuard Whole-House Softener", price: "AED 4,800", facts: ["Up to 2,500 L/h", "Automatic digital valve"] },
];

function TiltCard({ p }: { p: (typeof products)[number] }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <article ref={ref} onPointerMove={move} onPointerLeave={leave} className="flex flex-col overflow-hidden rounded-lg border bg-card transition-transform duration-300 ease-out will-change-transform">
      <div className="hero-fallback relative flex aspect-[4/3] items-end p-4">
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-on-dark-muted">Product photo</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">Residential</p>
        <h3 className="mt-2 text-lg font-semibold">{p.name}</h3>
        <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
          {p.facts.map((f) => <li key={f} className="flex gap-2"><span className="mt-2 h-px w-3 shrink-0 bg-aqua" />{f}</li>)}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">From <span className="font-display text-xl font-semibold text-foreground">{p.price}</span></p>
      </div>
    </article>
  );
}

export function Solve() {
  return (
    <section className="dark-to-light pb-28 pt-32" aria-labelledby="solve">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="eyebrow">Featured systems</p>
          <h2 id="solve" className="mt-3 max-w-xl text-3xl font-semibold text-on-dark md:text-5xl">How we solve your problem</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {products.map((p) => <Reveal key={p.name} className="h-full"><TiltCard p={p} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export function WhoWeAre() {
  return (
    <section className="py-28" aria-labelledby="who">
      <Reveal className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1fr_1.4fr] md:px-8">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 id="who" className="mt-3 text-3xl font-semibold md:text-4xl">One team for clean water, start to finish.</h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>MENA AQUA Tru supplies, installs and services water filtration, softening and purification systems for homes and businesses across the UAE.</p>
          <p>Water testing, written quotations, installation, scheduled maintenance and genuine spare parts are handled by one accountable team.</p>
          <p className="text-base text-foreground">Based in Al Muteena, Deira, Dubai. Open every day 8:00 AM to 9:00 PM.</p>
        </div>
      </Reveal>
    </section>
  );
}

export function Stock() {
  const path = useRef<SVGPathElement>(null);
  useEffect(() => {
    const el = path.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.strokeDashoffset = "0"; return; }
    gsap.registerPlugin(ScrollTrigger);
    const tw = gsap.to(el, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: 0.6 } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);
  return (
    <section className="bg-tint py-28" aria-labelledby="stock">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Where our stock comes from</p>
          <h2 id="stock" className="mt-3 text-3xl font-semibold md:text-4xl">From our US warehouse to your home in the UAE.</h2>
          <p className="mt-5 text-lg text-muted-foreground">Our filtration systems and spare parts are stocked at our own warehouse in the United States and shipped to the UAE for installation and service.</p>
        </Reveal>
        <svg viewBox="0 0 1000 340" className="mt-14 w-full" role="img" aria-label="Route from the United States to Dubai">
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={i} x1={i * 62.5} y1="0" x2={i * 62.5} y2="340" className="stroke-border" strokeWidth="1" />
          ))}
          <path ref={path} d="M 180 210 C 380 40, 640 40, 820 190" fill="none" className="stroke-primary" strokeWidth="2" />
          <circle cx="180" cy="210" r="6" className="fill-primary" />
          <circle cx="820" cy="190" r="6" className="fill-aqua" />
          <circle cx="820" cy="190" r="16" fill="none" className="stroke-aqua" strokeWidth="1" />
          <text x="180" y="248" textAnchor="middle" className="fill-foreground font-display text-[15px]">United States</text>
          <text x="180" y="268" textAnchor="middle" className="fill-muted-foreground text-[12px]">Warehouse</text>
          <text x="820" y="228" textAnchor="middle" className="fill-foreground font-display text-[15px]">Dubai, UAE</text>
          <text x="820" y="248" textAnchor="middle" className="fill-muted-foreground text-[12px]">Installation and service</text>
        </svg>
      </div>
    </section>
  );
}

const trust = [
  { t: "One Accountable Team", d: "The people who test your water install and service the system." },
  { t: "Test First", d: "We test your water before recommending anything." },
  { t: "Written Quotations", d: "Scope, price and warranty confirmed in writing before work starts." },
  { t: "Direct Support", d: "Call or WhatsApp 050-7183290." },
];

export function Trust() {
  return (
    <section className="py-28" aria-labelledby="trust">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal><p className="eyebrow">Why trust us</p><h2 id="trust" className="mt-3 text-3xl font-semibold md:text-4xl">Clear work, done properly.</h2></Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((x, i) => (
            <Reveal key={x.t} className="bg-background p-8">
              <span className="font-display text-sm text-primary">0{i + 1}</span>
              <h3 className="mt-6 text-lg font-semibold">{x.t}</h3>
              <p className="mt-3 text-muted-foreground">{x.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { t: "Free Consultation", d: "We test your water and talk through what your home or business needs." },
  { t: "Installation", d: "Our team installs the agreed system as quoted in writing." },
  { t: "Scheduled Maintenance", d: "Filters and parts serviced on a planned schedule." },
  { t: "Ongoing Support", d: "Call or WhatsApp the same team whenever you need us." },
];

export function NextStep() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrap.current || !track.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) return;
    gsap.registerPlugin(ScrollTrigger);
    const t = track.current;
    const tw = gsap.to(t, {
      x: () => -(t.scrollWidth - window.innerWidth + 64),
      ease: "none",
      scrollTrigger: { trigger: wrap.current, start: "top top", end: () => `+=${t.scrollWidth}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);
  return (
    <section aria-labelledby="next" className="bg-navy text-on-dark">
      <div ref={wrap} className="flex min-h-screen flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <p className="eyebrow text-aqua">The next step</p>
          <h2 id="next" className="mt-3 text-3xl font-semibold md:text-5xl">Four steps to better water.</h2>
        </div>
        <div ref={track} className="mt-14 flex flex-col gap-6 px-5 md:flex-row md:px-8 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {steps.map((s, i) => (
            <div key={s.t} className="shrink-0 rounded-lg border border-on-dark/15 bg-navy-2 p-8 md:w-[26rem]">
              <span className="font-display text-5xl font-light text-aqua">0{i + 1}</span>
              <h3 className="mt-10 text-xl font-semibold">{s.t}</h3>
              <p className="mt-3 text-on-dark-muted">{s.d}</p>
            </div>
          ))}
          <div className="flex shrink-0 flex-col justify-center gap-3 md:w-[22rem]">
            <a href="/contact" className="btn btn-primary">Book a Free Consultation</a>
            <a href="https://wa.me/971507183290" className="btn btn-ghost-dark">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}
