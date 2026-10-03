"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { profile } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import SplitReveal from "./SplitReveal";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const magnet = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(".ct-in", {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.08,
          scrollTrigger: { trigger: ".ct-links", start: "top 90%", once: true },
        });
        gsap.from(magnet.current, {
          scale: 0,
          rotate: -120,
          duration: 1.6,
          scrollTrigger: { trigger: magnet.current, start: "top 95%", once: true },
        });
      });

      // Magnetic CTA — fine pointers only
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const btn = magnet.current!;
        const xTo = gsap.quickTo(btn, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        return () => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="relative overflow-hidden bg-ink px-4 pt-24 text-paper md:px-8 md:pt-36">
      <SectionLabel index="05" title="Contact" aside={profile.location} tone="dark" />

      <div className="relative mt-12 md:mt-20">
        <SplitReveal as="h2" type="chars" className="display text-[length:var(--text-mega)] leading-[0.82]">
          Let&apos;s <em className="text-coral">talk.</em>
        </SplitReveal>

        <a
          ref={magnet}
          href={`mailto:${profile.email}`}
          className="group absolute right-0 top-1/2 hidden size-40 -translate-y-1/2 place-items-center rounded-full bg-coral text-center text-paper md:grid lg:size-52"
        >
          <span className="pointer-events-none absolute inset-0 scale-0 rounded-full bg-paper transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-100" />
          <span className="eyebrow relative transition-colors duration-500 group-hover:text-ink">
            Say hello
            <br />→
          </span>
        </a>
      </div>

      <div className="ct-links mt-16 grid grid-cols-12 gap-x-4 gap-y-10 border-t border-paper/20 pt-10 md:mt-24">
        <div className="col-span-12 lg:col-span-6">
          <p className="ct-in eyebrow text-paper/50">Email</p>
          <a
            href={`mailto:${profile.email}`}
            className="ct-in link-underline mt-3 inline-block break-all font-display text-[clamp(1.4rem,5.4vw,2.6rem)] leading-tight lg:break-normal lg:text-[clamp(1.6rem,2.6vw,2.6rem)]"
          >
            {profile.email}
          </a>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <p className="ct-in eyebrow text-paper/50">Phone</p>
          <a href={profile.phoneHref} className="ct-in link-underline mt-3 inline-block font-display text-2xl md:text-3xl">
            {profile.phone}
          </a>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <p className="ct-in eyebrow text-paper/50">Looking for</p>
          <p className="ct-in mt-3 text-lg leading-snug text-paper/85">{profile.seeking}</p>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="ct-in col-span-12 flex h-14 items-center justify-center gap-3 rounded-full bg-coral text-paper md:hidden"
        >
          <span className="eyebrow">Say hello →</span>
        </a>
      </div>

      <footer className="mt-24 flex flex-col gap-6 border-t border-paper/20 py-8 md:mt-36 md:flex-row md:items-center md:justify-between">
        <p className="eyebrow text-paper/50">© 2026 {profile.fullName}. All rights reserved.</p>
        <p className="eyebrow text-paper/50">References available upon request</p>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="eyebrow group flex items-center gap-3 self-start md:self-auto"
        >
          Back to top
          <span className="grid size-9 place-items-center rounded-full border border-paper/40 transition-colors duration-500 group-hover:border-coral group-hover:bg-coral">
            ↑
          </span>
        </button>
      </footer>

      {/* Oversized signature */}
      <p
        aria-hidden
        className="display pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center text-[21vw] italic leading-none text-paper/[0.06]"
      >
        Opeyemi
      </p>
    </section>
  );
}
