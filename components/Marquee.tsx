"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { marquee } from "@/lib/content";

function Row({ reverse, outline }: { reverse?: boolean; outline?: boolean }) {
  const items = [...marquee, ...marquee];
  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div className={`marquee-track flex shrink-0 ${reverse ? "is-reverse" : ""}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span
                  className={`display whitespace-nowrap px-5 text-[clamp(2.75rem,7vw,7rem)] md:px-8 ${
                    outline ? "text-outline [--outline:var(--color-paper)]" : i % 2 ? "italic" : ""
                  }`}
                >
                  {word}
                </span>
                <svg viewBox="0 0 40 40" className="size-6 shrink-0 fill-coral md:size-10" aria-hidden>
                  <path d="M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const wrap = gsap.utils.wrap(-50, 0);
        const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track").map((el) => ({
          set: gsap.quickSetter(el, "xPercent"),
          sign: el.classList.contains("is-reverse") ? -1 : 1,
          pos: el.classList.contains("is-reverse") ? -25 : 0,
        }));

        // speed.v eases back to the scroll direction after each velocity burst
        const speed = { v: 1 };
        let direction = 1;
        const BASE = 0.0016; // xPercent per ms: a full loop takes ~30s at rest

        const tick = (_t: number, dt: number) => {
          tracks.forEach((t) => {
            t.pos = wrap(t.pos - BASE * dt * speed.v * t.sign);
            t.set(t.pos);
          });
        };
        gsap.ticker.add(tick);

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction;
            const boost = gsap.utils.clamp(1, 7, Math.abs(self.getVelocity()) / 200);
            gsap.killTweensOf(speed);
            gsap.to(speed, { v: boost * direction, duration: 0.15, ease: "power1.out" });
            gsap.to(speed, { v: direction, duration: 1.2, delay: 0.15, ease: "power2.out" });
          },
        });

        gsap.fromTo(
          ".marquee-tilt",
          { rotate: -4 },
          {
            rotate: 2,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative z-10 overflow-hidden py-10 md:py-16" aria-label="Areas of focus">
      <div className="marquee-tilt -mx-[5vw] space-y-2 bg-ink py-6 text-paper md:py-8">
        <Row />
        <Row reverse outline />
      </div>
      <p className="sr-only">{marquee.join(", ")}</p>
    </section>
  );
}
