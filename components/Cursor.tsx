"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const el = dot.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

      const move = (e: PointerEvent) => {
        gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
        xTo(e.clientX);
        yTo(e.clientY);
        const interactive = (e.target as Element)?.closest?.("a, button");
        gsap.to(inner.current, { scale: interactive ? 4.5 : 1, opacity: interactive ? 0.35 : 1, duration: 0.5, ease: "expo.out", overwrite: "auto" });
      };
      const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 });

      window.addEventListener("pointermove", move);
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-3 [@media(pointer:fine)]:block"
      style={{ visibility: "hidden" }}
    >
      <span ref={inner} className="block size-full rounded-full bg-coral" />
    </div>
  );
}
