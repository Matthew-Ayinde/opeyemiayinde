"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { onIntroDone } from "@/lib/intro";
import { nav, profile } from "@/lib/content";

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // Resolve targets now: the intro callback fires inside the preloader's
      // GSAP context, where selector text would be scoped to the preloader.
      const items = gsap.utils.toArray<HTMLElement>(".nav-item");
      gsap.set(items, { yPercent: -160 });
      const off = onIntroDone(() =>
        gsap.to(items, { yPercent: 0, duration: 1.2, stagger: 0.06, delay: 0.5 }),
      );

      // Hide on scroll down, reveal on scroll up
      const hide = gsap.to(".nav-bar", { yPercent: -150, duration: 0.6, ease: "power3.inOut", paused: true });
      ScrollTrigger.create({
        start: "top -120",
        end: "max",
        onUpdate: (self) => (self.direction === 1 ? hide.play() : hide.reverse()),
        onLeaveBack: () => hide.reverse(),
      });

      // Reading progress
      gsap.to(".nav-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(menu.current, { display: "flex" })
        .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 })
        .from(".menu-link", { yPercent: 120, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=0.4")
        .from(".menu-meta", { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.05, ease: "expo.out" }, "<0.2");

      return off;
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    const lenis = getLenis();
    if (open) {
      tl.timeScale(1).play();
      lenis?.stop();
    } else {
      tl.timeScale(1.6).reverse();
      lenis?.start();
    }
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu begin closing before the scroll starts
    setTimeout(() => scrollToTarget(href), open ? 350 : 0);
  };

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      <div className="nav-progress fixed left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-coral" />

      <div className="nav-bar flex items-center justify-between gap-4 px-4 pt-4 md:px-8 md:pt-6">
        <div className="overflow-hidden">
          <a
            href="#top"
            onClick={go("#top")}
            className="nav-item flex h-12 items-center gap-3 rounded-full bg-ink pl-1.5 pr-5 text-paper"
            aria-label="Back to top"
          >
            <span className="grid size-9 place-items-center rounded-full bg-coral font-display text-sm italic">
              AO
            </span>
            <span className="eyebrow hidden sm:inline">{profile.fullName}</span>
          </a>
        </div>

        <nav aria-label="Primary" className="hidden overflow-hidden lg:block">
          <ul className="nav-item flex h-12 items-center gap-1 rounded-full border border-ink/10 bg-paper/80 px-2 backdrop-blur-md">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={go(item.href)}
                  className="eyebrow block rounded-full px-4 py-2 transition-colors duration-300 hover:bg-ink hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-2 overflow-hidden">
          <a
            href="#contact"
            onClick={go("#contact")}
            className="nav-item hidden h-12 items-center gap-2 rounded-full bg-coral px-5 text-paper transition-colors duration-300 hover:bg-ink sm:flex"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-paper" />
            <span className="eyebrow">Let&apos;s talk</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="nav-item relative z-10 grid size-12 place-items-center rounded-full bg-ink text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 -z-10 hidden flex-col justify-between bg-ink px-5 pb-8 pt-28 text-paper lg:hidden"
      >
        <ul className="space-y-1">
          {nav.map((item, i) => (
            <li key={item.href} className="line-mask">
              <a
                href={item.href}
                onClick={go(item.href)}
                className="menu-link display flex items-baseline gap-4 text-[clamp(3rem,13vw,6rem)] transition-colors hover:text-coral"
              >
                <span className="font-mono text-xs tracking-normal text-coral">0{i + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="space-y-2">
          <a href={`mailto:${profile.email}`} className="menu-meta block text-lg">
            {profile.email}
          </a>
          <a href={profile.phoneHref} className="menu-meta eyebrow block text-paper/60">
            {profile.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
