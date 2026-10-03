"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { competencies } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import dashboard from "@/public/images/dashboard.jpg";
import markets from "@/public/images/markets.jpg";

export default function Competencies() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scroll the track sideways
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.offsetWidth - window.innerWidth);

        const scroller = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".cp-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(".cp-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".cp-pin", start: "top top", end: () => `+=${distance()}`, scrub: true },
        });

        // Cards already on screen when the pin starts reveal on the vertical
        // approach; the rest reveal as the track carries them into view.
        gsap.utils.toArray<HTMLElement>(".cp-card").forEach((card) => {
          const onScreen = card.offsetLeft < window.innerWidth * 0.85;
          gsap.from(card.querySelectorAll(".cp-in"), {
            yPercent: 60,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 1.1,
            delay: onScreen ? card.offsetLeft / window.innerWidth / 3 : 0,
            scrollTrigger: onScreen
              ? { trigger: ".cp-pin", start: "top 55%", once: true }
              : { trigger: card, containerAnimation: scroller, start: "left 85%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".cp-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: scroller,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      // Mobile / tablet: simple staggered entrances
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.utils.toArray<HTMLElement>(".cp-card").forEach((card) => {
          gsap.from(card.querySelectorAll(".cp-in"), {
            y: 40,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 1.1,
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="expertise" className="relative bg-paper">
      <div className="cp-pin relative lg:flex lg:h-svh lg:flex-col lg:overflow-hidden">
        <div className="px-4 pt-24 md:px-8 md:pt-36 lg:pt-28">
          <SectionLabel index="03" title="Expertise" aside="Core competencies" />
        </div>

        <div
          ref={track}
          className="flex flex-col gap-6 px-4 pb-24 pt-12 md:px-8 lg:w-max lg:flex-1 lg:flex-row lg:items-stretch lg:gap-8 lg:py-12 lg:pb-16"
        >
          {/* Intro panel */}
          <div className="cp-card flex shrink-0 flex-col justify-between lg:w-[38vw]">
            <h2 className="display text-[length:var(--text-huge)]">
              <span className="line-mask"><span className="cp-in block">What I bring</span></span>
              <span className="line-mask"><span className="cp-in block italic text-coral">to the table.</span></span>
            </h2>
            <p className="cp-in mt-6 max-w-sm text-lg leading-snug text-ink/70">
              Nine competencies, three disciplines. The common denominator: turning information into decisions people can act on.
            </p>
            <div className="mt-8 hidden items-center gap-4 lg:flex">
              <span className="eyebrow text-ink/50">Scroll</span>
              <div className="h-px flex-1 bg-ink/15">
                <div className="cp-progress h-full origin-left scale-x-0 bg-coral" />
              </div>
            </div>
          </div>

          {competencies.map((c, i) => (
            <article
              key={c.title}
              className={`cp-card group relative flex shrink-0 flex-col justify-between overflow-hidden p-6 md:p-10 lg:w-[30vw] ${
                i === 1 ? "bg-ink text-paper" : "bg-mist"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="cp-in eyebrow">{c.blurb}</span>
                <span className={`cp-in display text-outline text-[clamp(5rem,9vw,9rem)] leading-none ${i === 1 ? "[--outline:var(--color-coral)]" : "[--outline:var(--color-ink)] opacity-40"}`}>
                  0{i + 1}
                </span>
              </div>
              <div className="mt-16">
                <h3 className="cp-in display text-[clamp(2.25rem,3.6vw,3.75rem)]">{c.title}</h3>
                <ul className="mt-6 space-y-0">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className={`cp-in flex items-center justify-between gap-4 border-t py-3 text-base md:text-lg ${
                        i === 1 ? "border-paper/20" : "border-ink/15"
                      }`}
                    >
                      {item}
                      <span className="text-coral" aria-hidden>↗</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-coral transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
            </article>
          ))}

          {/* Image panels */}
          {[
            { src: dashboard, alt: "Analytics dashboard showing bounce rate and session charts", cap: "Fig. 03 — Performance, measured." },
            { src: markets, alt: "Trading screen with market candlestick charts", cap: "Fig. 04 — Next chapter: financial services." },
          ].map((f) => (
            <figure key={f.cap} className="cp-card flex shrink-0 flex-col lg:w-[34vw]">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:aspect-auto lg:flex-1">
                <div className="cp-img absolute inset-[0_-12%]">
                  <Image src={f.src} alt={f.alt} fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 95vw" className="object-cover" />
                </div>
              </div>
              <figcaption className="cp-in eyebrow mt-3 text-ink/60">{f.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
