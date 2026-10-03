"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function SectionLabel({
  index,
  title,
  aside,
  tone = "light",
}: {
  index: string;
  title: string;
  aside?: string;
  tone?: "light" | "dark";
}) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el.current, start: "top 90%", once: true } });
        tl.from(".sl-rule", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }).from(
          ".sl-text",
          { yPercent: 110, duration: 1, stagger: 0.08 },
          0.4,
        );
      });
    },
    { scope: el },
  );

  const muted = tone === "dark" ? "text-paper/50" : "text-ink/50";

  return (
    <div ref={el}>
      <div className="flex items-end justify-between gap-4 pb-3">
        <span className="overflow-hidden">
          <span className="sl-text eyebrow block">
            <span className="text-coral">({index})</span> — {title}
          </span>
        </span>
        {aside && (
          <span className="overflow-hidden">
            <span className={`sl-text eyebrow block ${muted}`}>{aside}</span>
          </span>
        )}
      </div>
      <div className={`sl-rule h-px origin-left ${tone === "dark" ? "bg-paper/30" : "bg-ink"}`} />
    </div>
  );
}
