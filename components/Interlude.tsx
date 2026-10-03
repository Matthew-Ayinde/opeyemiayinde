"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SplitReveal from "./SplitReveal";
import lagos from "@/public/images/lagos.jpg";

export default function Interlude() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        tl.fromTo(".il-frame", { clipPath: "inset(12% 8% 12% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 }, 0)
          .fromTo(".il-img", { yPercent: -15, scale: 1.25 }, { yPercent: 15, scale: 1.05, duration: 1 }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[85svh] min-h-[560px] md:h-[115svh]" aria-label="Lagos, Nigeria">
      <div className="il-frame absolute inset-0 overflow-hidden bg-ink">
        <div className="il-img absolute inset-[-12%_0]">
          <Image
            src={lagos}
            alt="Aerial view of Lagos with the Civic Centre tower and the lagoon"
            fill
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

        <div className="absolute inset-0 flex flex-col justify-between px-4 py-10 text-paper md:px-8 md:py-16">
          <div className="flex justify-between">
            <span className="eyebrow">Interlude</span>
            <span className="eyebrow">6.45° N, 3.39° E</span>
          </div>
          <div>
            <SplitReveal as="p" className="display max-w-[16ch] text-[length:var(--text-huge)]">
              Where the story meets the <em className="text-coral">spreadsheet.</em>
            </SplitReveal>
            <p className="eyebrow mt-6 text-paper/70">Fig. 05 — Lagos, Nigeria. Home base.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
