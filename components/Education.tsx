"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { education, training, toolkit } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import SplitReveal from "./SplitReveal";

type Entry = { period: string; title: string; place: string; note?: string };

function List({ heading, items }: { heading: string; items: Entry[] }) {
  return (
    <div>
      <h3 className="eyebrow text-ink/50">{heading}</h3>
      <ul className="mt-4">
        {items.map((e) => (
          <li key={e.title} className="ed-row group relative py-6 md:py-8">
            <div className="ed-rule absolute inset-x-0 top-0 h-px origin-left bg-ink/25" />
            <div className="grid grid-cols-12 gap-x-4 gap-y-2">
              <span className="ed-in eyebrow col-span-12 text-coral md:col-span-3">{e.period}</span>
              <div className="col-span-12 md:col-span-9">
                <p className="ed-in display text-[clamp(1.75rem,3.2vw,3rem)] leading-[0.95] transition-colors duration-500 group-hover:text-coral">
                  {e.title}
                </p>
                <p className="ed-in mt-2 flex flex-wrap gap-x-3 text-ink/70">
                  <span>{e.place}</span>
                  {e.note && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="italic">{e.note}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Education() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".ed-row").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
            .from(row.querySelector(".ed-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" })
            .from(row.querySelectorAll(".ed-in"), { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.3);
        });

        gsap.from(".tk-chip", {
          yPercent: 120,
          rotate: () => gsap.utils.random(-12, 12),
          autoAlpha: 0,
          duration: 1.2,
          stagger: { each: 0.04, from: "random" },
          scrollTrigger: { trigger: ".tk-list", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="education" className="relative bg-mist px-4 py-24 md:px-8 md:py-36">
      <SectionLabel index="04" title="Education & Training" aside="Always learning" />

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-16 md:mt-20">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SplitReveal as="h2" className="display text-[length:var(--text-huge)]">
              The <em className="text-coral">curious</em> mind, credentialed.
            </SplitReveal>
            <p className="mt-6 max-w-sm text-lg leading-snug text-ink/70">
              From the newsroom to a data science bootcamp — and an MBA in view — every step has sharpened how I read numbers and the people behind them.
            </p>
          </div>
        </div>

        <div className="col-span-12 space-y-16 lg:col-span-7">
          <List heading="Education" items={education} />
          <List heading="Training & Development" items={training} />

          <div>
            <h3 className="eyebrow text-ink/50">Toolkit</h3>
            <ul className="tk-list mt-6 flex flex-wrap gap-2 md:gap-3">
              {toolkit.map((t) => (
                <li key={t} className="overflow-hidden rounded-full">
                  <span className="tk-chip block rounded-full border border-ink/25 bg-paper px-4 py-2 text-sm transition-colors duration-300 hover:border-coral hover:bg-coral hover:text-paper md:px-5 md:py-2.5 md:text-base">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
