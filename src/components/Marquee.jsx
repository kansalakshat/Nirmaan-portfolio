import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const words = ['Websites', 'Apps', 'CRM', 'Open source', 'Automation', 'AI', 'Custom software']

/* Two bands crossing in an X. Each loops forever; scroll velocity kicks its
   speed up and flips direction, then it coasts back (E-Cell's Marquee). */
function Band({ dir, className, rotate, hidden }) {
  const track = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const loop = gsap.fromTo(
          track.current,
          { xPercent: dir > 0 ? 0 : -50 },
          { xPercent: dir > 0 ? -50 : 0, duration: 30, ease: 'none', repeat: -1 },
        )
        ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(1, 7, Math.abs(self.getVelocity()) / 300)
            gsap
              .timeline({ overwrite: true })
              .set(loop, { timeScale: self.direction * boost })
              .to(loop, { timeScale: self.direction, duration: 1, ease: 'power2.out' })
          },
        })
      })
    }, track)
    return () => ctx.revert()
  }, [dir])

  return (
    <div
      aria-hidden={hidden || undefined}
      className={`overflow-hidden py-4 ${className}`}
      style={{ transform: `rotate(${rotate}deg) scale(1.08)` }}
    >
      <div ref={track} className="flex w-max">
        {[0, 1].map((half) => (
          <span key={half} aria-hidden={half === 1 || undefined} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className="display flex items-center gap-10 pr-10 text-[clamp(1.4rem,3.2vw,2.6rem)]">
                {w}
                <span className="inline-block h-3 w-3 rotate-45 bg-current opacity-60" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section aria-label="What we build" className="relative overflow-hidden py-16">
      <Band dir={-1} rotate={3} hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-y border-stone bg-bone text-ink-70" />
      <Band dir={1} rotate={-4} className="relative z-10 bg-accent text-paper" />
    </section>
  )
}
