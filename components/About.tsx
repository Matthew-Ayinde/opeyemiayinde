"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { manifesto, stats } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import newsprint from "@/public/images/newsprint.jpg";

// "*word*" marks emphasis — render each word as its own span for the scrub.
function Manifesto() {
  return manifesto.split(" ").map((raw, i) => {
    const em = raw.startsWith("*");
    const word = raw.replace(/\*/g, "");
    return (
      <span key={i} className={`about-word ${em ? "font-display italic text-coral" : ""}`}>
        {word}{" "}
      </span>
    );
  });
}

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".about-word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: ".about-statement", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );

        gsap.fromTo(
          ".about-img",
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: ".about-figure", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from(".about-figure", {
          clipPath: "inset(0% 0% 0% 100%)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".about-figure", start: "top 85%", once: true },
        });

        gsap.utils.toArray<HTMLElement>(".stat").forEach((stat, i) => {
          const rule = stat.querySelector(".stat-rule");
          const num = stat.querySelector<HTMLElement>("[data-count]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: stat, start: "top 90%", once: true }, delay: i * 0.1 });
          tl.from(rule, { scaleX: 0, duration: 1.4, ease: "expo.inOut" })
            .from(stat.querySelectorAll(".stat-fade"), { yPercent: 100, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.3);
          if (num) {
            const target = Number(num.dataset.count);
            const from = target > 100 ? target - 40 : 0;
            const o = { v: from };
            tl.fromTo(
              o,
              { v: from },
              {
                v: target,
                duration: 1.8,
                ease: "power3.out",
                onUpdate: () => {
                  num.textContent = String(Math.round(o.v)).padStart(String(target).length === 1 ? 2 : 0, "0");
                },
              },
              0.3,
            );
          }
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="profile" className="relative px-4 py-24 md:px-8 md:py-36">
      <SectionLabel index="01" title="Profile" />
      <h2 className="sr-only">Profile — about Ayinde Opeyemi</h2>

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-20">
        <p className="about-statement col-span-12 text-[length:var(--text-statement)] font-light leading-[1.08] tracking-[-0.02em] lg:col-span-9">
          <Manifesto />
        </p>

        <figure className="col-span-12 sm:col-span-6 sm:col-start-7 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:self-end">
          <div className="about-figure relative aspect-[3/4] overflow-hidden bg-mist">
            <div className="absolute inset-[-14%_0]">
              <Image
                src={newsprint}
                alt="Stacked newspapers with the business section on top"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                className="about-img object-cover grayscale-[40%]"
              />
            </div>
            <div className="absolute inset-0 bg-ink/10 mix-blend-multiply" />
          </div>
          <figcaption className="eyebrow mt-3 text-ink/60">
            Fig. 02 — Where it began: the newsroom, 2018.
          </figcaption>
        </figure>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-32 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-rule h-px origin-left bg-ink" />
            <p className="overflow-hidden pt-4">
              <span
                className="stat-fade display block text-[clamp(3.5rem,8vw,7.5rem)]"
                {...(s.count ? { "data-count": s.count } : {})}
              >
                {s.value}
              </span>
            </p>
            <p className="overflow-hidden">
              <span className="stat-fade mt-3 block max-w-[16rem] text-sm leading-relaxed text-ink/70 md:text-base">
                {s.label}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
