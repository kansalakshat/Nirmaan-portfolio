import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { steps } from '../data'
import { reduced } from '../lib/scroll'

export default function Process() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each step lights up as it crosses the middle of the screen
      gsap.utils.toArray('.step').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          onEnter: () => el.classList.add('is-on'),
          onLeaveBack: () => el.classList.remove('is-on'),
        })
        if (reduced) return
        gsap.from(el, {
          x: 80,
          rotationY: -25,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          transformPerspective: 900,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
      if (reduced) return
      gsap.fromTo(
        '.track-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 55%', end: 'bottom 55%', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="process" ref={root} className="relative overflow-x-clip bg-paper/90">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-28 sm:px-8 md:grid-cols-[5fr_7fr] md:py-40">
        <div className="self-start md:sticky md:top-32">
          <h2 className="skew display text-[clamp(2.4rem,5.6vw,5rem)]">
            From idea <span className="text-accent">to launch.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-70">
            A clear, collaborative process for high-quality, scalable and business-focused software.
          </p>
        </div>

        <ol className="steps relative">
          <div aria-hidden className="absolute top-2 bottom-2 left-[27px] w-px bg-stone">
            <div className="track-fill h-full w-full origin-top bg-accent" />
          </div>
          {steps.map(({ title, desc, icon: Icon }, i) => (
            <li key={title} className="step group relative flex gap-6 pb-14 last:pb-0">
              <span className="node relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-stone bg-paper font-mono text-sm text-ink-70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-2 transition-transform duration-500 ease-smooth group-hover:translate-x-2">
                <div className="flex items-center gap-3">
                  <Icon size={22} weight="duotone" className="text-accent" />
                  <h3 className="text-xl font-bold text-ink-70 transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                    {title}
                  </h3>
                </div>
                <p className="mt-2 text-ink-70">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
