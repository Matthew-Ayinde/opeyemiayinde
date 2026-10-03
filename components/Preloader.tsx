"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, REDUCED } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        markIntroDone();
        ScrollTrigger.refresh();
      };

      if (window.matchMedia(REDUCED).matches) {
        gsap.to(root.current, {
          autoAlpha: 0,
          duration: 0.4,
          onComplete: () => {
            gsap.set(root.current, { display: "none" });
            finish();
          },
        });
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".pl-word", { yPercent: 110, duration: 1.1, stagger: 0.08 })
        .from(".pl-meta", { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.05 }, 0.2)
        .to(
          counter,
          {
            v: 100,
            duration: 1.8,
            ease: "power3.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pl-bar", { scaleX: 1, duration: 1.8, ease: "power3.inOut" }, 0)
        .to(".pl-word", { yPercent: -110, duration: 0.8, stagger: 0.05, ease: "expo.in" }, "+=0.1")
        .to(".pl-meta", { autoAlpha: 0, duration: 0.4 }, "<")
        .to(root.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "expo.inOut",
        }, "-=0.25")
        .add(finish, "-=0.6")
        .set(root.current, { display: "none" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 text-paper md:p-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden
    >
      <div className="flex justify-between">
        <span className="pl-meta eyebrow">Portfolio — Vol. 01</span>
        <span className="pl-meta eyebrow">Lagos, NG</span>
      </div>

      <div className="display text-[clamp(3.5rem,14vw,13rem)]">
        <span className="line-mask"><span className="pl-word block">Ayinde</span></span>
        <span className="line-mask">
          <span className="pl-word block italic text-coral">Opeyemi.</span>
        </span>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="pl-meta eyebrow max-w-[16rem] text-paper/60">
            Growth · Strategy · Communication
          </span>
          <span ref={count} className="pl-meta font-mono text-5xl tabular-nums md:text-7xl">
            000
          </span>
        </div>
        <div className="pl-bar mt-4 h-px origin-left scale-x-0 bg-coral" />
      </div>
    </div>
  );
}
