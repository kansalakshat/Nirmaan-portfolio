import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ArrowUpRight, ArrowDown } from '@phosphor-icons/react'
import { scrollToId, reduced, bootDone } from '../lib/scroll'
import { useMagnetic } from '../hooks/useInteractions'
import { WHATSAPP } from '../data'

gsap.registerPlugin(SplitText)

export default function Hero() {
  const root = useRef()
  const work = useMagnetic(0.3)
  const talk = useMagnetic(0.2)

  useEffect(() => {
    if (reduced) return
    let alive = true
    const ctx = gsap.context(() => {
      /* The hero holds still for one screen while the headline swells toward
         you and dissolves. Built synchronously, before the font wait below, so
         this pin is created ahead of the pins further down the page and every
         later trigger is measured with its spacer in place.
         Plain scale, not z: z near the perspective distance blows up without
         limit. The copy clears out first so the growing type never covers it.
         scrub: 1 trails the scroll slightly, which is what reads as smooth. */
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=100%', pin: true, scrub: 1 },
        })
        .to('.hero-sub', { y: -50, autoAlpha: 0, ease: 'power1.in', duration: 0.25 }, 0)
        .to('.hero-cue', { autoAlpha: 0, ease: 'none', duration: 0.12 }, 0)
        .to('.hero-title', { scale: 3.2, ease: 'power2.in', duration: 1 }, 0)
        .to('.hero-title', { autoAlpha: 0, ease: 'power1.in', duration: 0.4 }, 0.6)
    }, root)
    // Split only after the display font lands (or line breaks come out wrong)
    // and the boot screen opens (or the intro plays unseen behind it)
    Promise.all([document.fonts.ready, bootDone]).then(() => alive && ctx.add(() => {
      const split = SplitText.create('.hero-title', { type: 'lines,words,chars' })

      // Letters drop in from deep space, flipping up to face you
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(split.chars, {
          z: -600,
          rotationX: -100,
          opacity: 0,
          duration: 1.6,
          stagger: 0.035,
          transformPerspective: 900,
        })
        .from('.hero-fade', { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, '-=1.1')
    }))
    return () => {
      alive = false
      ctx.revert()
    }
  }, [])

  return (
    <section id="top" ref={root} className="relative flex min-h-[100dvh] items-end overflow-x-clip md:items-center">
      {/* Keeps the type legible where it overlaps the 3D mark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent md:bg-gradient-to-r md:from-paper/80 md:via-paper/20"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-28 sm:px-8 md:pb-0">
        <h1 className="hero-title display origin-[35%_50%] text-[clamp(2.3rem,11.4vw,3rem)] sm:text-[clamp(3rem,8.4vw,8rem)]">
          Ideas into <span className="text-accent">systems.</span>
        </h1>
        <div className="hero-sub">
          <p className="hero-fade mt-8 max-w-md text-lg leading-relaxed font-light text-ink-70 sm:text-xl">
            Nirmaan Tech is an Indore studio building <span className="text-ink">open-source</span> websites, apps,
            CRMs and AI automation for growing businesses.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap gap-3">
            <a ref={work} href="#work" onClick={(e) => scrollToId(e, 'work')} className="btn btn-primary">
              See the work <ArrowDown size={18} weight="bold" />
            </a>
            <a ref={talk} href={WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Start a project <ArrowUpRight size={18} weight="bold" />
            </a>
          </div>
        </div>
      </div>

      <a
        href="#work"
        onClick={(e) => scrollToId(e, 'work')}
        aria-label="Scroll to the work"
        className="hero-cue absolute bottom-6 left-1/2 flex min-h-11 -translate-x-1/2 flex-col items-center gap-2 text-ink/45 transition-colors duration-300 hover:text-accent"
      >
        <span className="font-mono text-[11px] tracking-[0.35em] uppercase">Scroll</span>
        <ArrowDown size={18} weight="bold" className="animate-bounce" />
      </a>
    </section>
  )
}
