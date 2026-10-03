"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { experience } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import SplitReveal from "./SplitReveal";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".xp-row").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } });
          tl.from(row.querySelector(".xp-rule"), { scaleX: 0, duration: 1.5, ease: "expo.inOut" })
            .from(row.querySelectorAll(".xp-in"), { yPercent: 105, duration: 1.2, stagger: 0.06 }, 0.35)
            .from(row.querySelectorAll(".xp-point"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.07 }, 0.55);
        });

        // Giant ghost year drifting behind the list
        gsap.fromTo(
          ".xp-ghost",
          { yPercent: -20 },
          {
            yPercent: 40,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="experience"
      className="relative overflow-hidden bg-ink px-4 py-24 text-paper md:px-8 md:py-36"
    >
      <span
        aria-hidden
        className="xp-ghost display text-outline pointer-events-none absolute -right-[4vw] top-24 select-none text-[clamp(10rem,34vw,34rem)] opacity-15 [--outline:var(--color-paper)]"
      >
        ’26
      </span>

      <SectionLabel index="02" title="Experience" aside="2018 — Present" tone="dark" />

      <SplitReveal
        as="h2"
        className="display relative mt-12 max-w-[14ch] text-[length:var(--text-giant)] md:mt-20"
      >
        Four roles, one <em className="text-coral">thread</em>: evidence.
      </SplitReveal>

      <ol className="relative mt-20 md:mt-32">
        {experience.map((job, i) => (
          <li key={job.role} className="xp-row group relative pb-14 md:pb-20">
            <div className="xp-rule h-px origin-left bg-paper/30" />
            <div className="absolute left-0 top-0 h-px w-0 bg-coral transition-[width] duration-700 ease-[var(--ease-expo)] group-hover:w-full" />

            <div className="grid grid-cols-12 gap-x-4 gap-y-6 pt-6 md:pt-8">
              <div className="col-span-2 overflow-hidden md:col-span-1">
                <span className="xp-in block font-mono text-sm text-coral">0{i + 1}</span>
              </div>
              <div className="col-span-10 overflow-hidden md:col-span-3 lg:col-span-2">
                <span className="xp-in eyebrow block text-paper/60">{job.period}</span>
              </div>

              <div className="col-span-12 md:col-span-8 lg:col-span-5">
                <h3 className="line-mask transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
                  <span className="xp-in display block text-[clamp(2.25rem,4.6vw,4.5rem)] group-hover:italic group-hover:text-coral">
                    {job.role}
                  </span>
                </h3>
                <div className="mt-3 overflow-hidden">
                  <span className="xp-in eyebrow block text-paper/70">{job.company}</span>
                </div>
              </div>

              <ul className="col-span-12 space-y-3 md:col-span-8 md:col-start-5 lg:col-span-4 lg:col-start-9">
                {job.points.map((p) => (
                  <li key={p} className="xp-point flex gap-3 text-[0.95rem] leading-relaxed text-paper/80">
                    <span className="mt-[0.6em] h-px w-4 shrink-0 bg-coral" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
