"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { profile } from "@/lib/content";
import portrait from "@/public/opeyemi.png";

const Chars = ({ text, className }: { text: string; className?: string }) => (
  <>
    {text.split("").map((c, i) => (
      <span key={i} className={`inline-block will-change-transform ${className ?? ""}`}>
        {c}
      </span>
    ))}
  </>
);

function Badge() {
  return (
    <div className="relative size-full" aria-hidden>
    <svg viewBox="0 0 200 200" className="hero-badge size-full">
      <defs>
        <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="100" className="fill-coral" />
      <text className="fill-paper font-mono text-[15px] uppercase tracking-[0.32em]">
        <textPath href="#badge-circle">Growth • Strategy • Data • Story • </textPath>
      </text>
    </svg>
    <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
      <path d="M100 72 L100 128 M80 108 L100 128 L120 108" className="stroke-paper" strokeWidth="3" fill="none" />
    </svg>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(".hero-char", { yPercent: 115 });
        gsap.set(".hero-fade", { autoAlpha: 0, y: 30 });
        gsap.set(".hero-rule", { scaleX: 0 });
        gsap.set(".hero-figure", { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(".hero-img", { scale: 1.45 });
        gsap.set(".hero-badge-wrap", { scale: 0, rotate: -90 });

        const intro = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .to(".hero-rule", { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0)
          .to(".hero-l1 .hero-char", { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.1)
          .to(".hero-figure", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 0.25)
          .to(".hero-img", { scale: 1.12, duration: 2.2 }, 0.25)
          .to(".hero-l2 .hero-char", { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.45)
          .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.8)
          .to(".hero-badge-wrap", { scale: 1, rotate: 0, duration: 1.4 }, 1.1);

        const off = onIntroDone(() => intro.play());

        // Scroll-out choreography: name lines drift apart, portrait parallaxes
        const out = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        out
          .to(".hero-l1", { xPercent: -14 }, 0)
          .to(".hero-l2", { xPercent: 12 }, 0)
          .fromTo(".hero-img-wrap", { yPercent: 0 }, { yPercent: 14 }, 0)
          .to(".hero-badge", { rotate: 300 }, 0);

        gsap.to(".hero-badge", { rotate: "+=360", duration: 18, repeat: -1, ease: "none" });

        return off;
      });

      // Reduced motion: everything is already in its final state.
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative overflow-hidden px-4 pb-14 pt-24 md:px-8 md:pb-20 md:pt-28"
    >
      {/* Masthead */}
      <div className="flex items-end justify-between gap-4 pb-3">
        <span className="hero-fade eyebrow">No. 01 — The Portfolio Issue</span>
        <span className="hero-fade eyebrow hidden md:inline">Growth &amp; Strategy</span>
        <span className="hero-fade eyebrow">Lagos · 2026</span>
      </div>
      <div className="hero-rule h-px origin-left bg-ink" />

      <h1 className="sr-only">
        {profile.fullName} — {profile.role}
      </h1>

      <div className="relative mt-4 grid grid-cols-12 gap-x-4 md:mt-6">
        <div
          aria-hidden
          className="hero-l1 display line-mask col-span-12 whitespace-nowrap text-[23vw] md:text-[length:var(--text-mega)] md:col-start-1 md:row-start-1"
        >
          <Chars text={profile.firstName} className="hero-char" />
        </div>

        <figure className="relative col-span-12 mt-2 sm:col-span-8 sm:col-start-3 md:col-span-4 md:col-start-5 md:row-start-2 md:mt-0 lg:col-span-3 lg:col-start-6">
          <div className="hero-figure relative aspect-[4/5] overflow-hidden bg-mist">
            <div className="hero-img-wrap absolute inset-[-10%_0]">
              <Image
                src={portrait}
                alt="Portrait of Ayinde Opeyemi in a black blazer, arms folded, smiling"
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 90vw"
                className="hero-img object-cover object-[50%_20%]"
              />
            </div>
            <span className="eyebrow absolute right-3 top-3 text-ink/70">Fig. 01</span>
          </div>
          <div className="hero-badge-wrap absolute -left-2 top-4 z-20 size-24 md:-left-12 md:size-28 lg:size-32">
            <Badge />
          </div>
        </figure>

        <div
          aria-hidden
          className="hero-l2 display line-mask relative z-10 col-span-12 -mt-[0.62em] whitespace-nowrap text-right text-[23vw] md:text-[length:var(--text-mega)] italic md:col-start-1 md:row-start-3"
        >
          <Chars text={profile.lastName} className="hero-char" />
          <span className="hero-char inline-block text-coral">.</span>
        </div>

        <div className="col-span-12 mt-8 md:col-span-4 md:col-start-1 md:row-start-2 md:mt-0 md:self-end md:pb-[calc(var(--text-mega)*0.7)]">
          <p className="hero-fade max-w-sm text-lg leading-snug md:text-xl">
            <span className="font-display italic text-coral">{profile.role}</span> — {profile.intro.toLowerCase()}
          </p>
          <a
            href="#profile"
            className="hero-fade group mt-6 inline-flex items-center gap-3"
          >
            <span className="grid size-11 place-items-center rounded-full border border-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
              <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 4v16M5 13l7 7 7-7" />
              </svg>
            </span>
            <span className="eyebrow">Read the profile</span>
          </a>
        </div>

        <dl className="col-span-12 mt-8 hidden gap-5 md:col-span-3 md:col-start-10 md:row-start-1 md:mt-0 md:grid md:self-end md:pb-[0.6vw]">
          {[
            ["Currently", "Casafina Group"],
            ["Based in", profile.location],
            ["Focus", "Data · Growth · Comms"],
          ].map(([k, v]) => (
            <div key={k} className="hero-fade border-t border-ink/20 pt-2">
              <dt className="eyebrow text-ink/50">{k}</dt>
              <dd className="mt-1 font-display text-xl">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
