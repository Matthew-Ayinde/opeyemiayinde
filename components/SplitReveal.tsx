"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "lines" slides masked lines up; "chars" staggers each letter. */
  type?: "lines" | "chars";
  delay?: number;
  stagger?: number;
  start?: string;
  id?: string;
};

export default function SplitReveal({
  as: Tag = "div",
  children,
  className,
  type = "lines",
  delay = 0,
  stagger,
  start = "top 88%",
  id,
}: Props) {
  const el = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        SplitText.create(el.current, {
          type: type === "chars" ? "lines,chars" : "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el.current, { visibility: "visible" });
            const targets = type === "chars" ? self.chars : self.lines;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: type === "chars" ? 6 : 2,
              transformOrigin: "0% 100%",
              duration: 1.3,
              delay,
              stagger: stagger ?? (type === "chars" ? 0.025 : 0.09),
              scrollTrigger: { trigger: el.current, start, once: true },
            });
          },
        });
      });

      mm.add(REDUCED, () => {
        gsap.set(el.current, { visibility: "visible" });
      });
    },
    { scope: el },
  );

  return (
    <Tag ref={el} data-split className={className} id={id}>
      {children}
    </Tag>
  );
}
