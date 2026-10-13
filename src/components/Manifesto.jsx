import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { pillars } from '../data'
import { reduced } from '../lib/scroll'

const text =
  'We build custom digital solutions that help businesses grow, automate operations and manage everything from one platform.'
const hot = new Set(['one', 'platform.'])

export default function Manifesto() {
  const root = useRef()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Words light up in reading order as you scroll through
      gsap.fromTo(
        '.word',
        { opacity: 0.12, z: -80, rotationX: 40 },
        {
          opacity: 1,
          z: 0,
          rotationX: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.words', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('.pillar', {
        y: 50,
        opacity: 0,
        rotationY: -30,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pillars', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative bg-gradient-to-b from-transparent via-paper/80 to-transparent">
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-8 md:py-44">
        <p className="eyebrow mb-10">About</p>
        <h2 className="words display max-w-6xl text-[clamp(1.7rem,4.6vw,4.1rem)] leading-[1.02] [perspective:700px]">
          {text.split(' ').map((w, i) => (
            <span key={i} className={`word inline-block pr-[0.28em] ${hot.has(w) ? 'text-accent' : ''}`}>
              {w}
            </span>
          ))}
        </h2>
        <ul className="pillars mt-20 grid gap-px overflow-hidden rounded-2xl border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4 [perspective:900px]">
          {pillars.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="pillar group flex items-center gap-4 bg-paper/90 p-6 transition-colors duration-500 hover:bg-bone"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-stone text-accent transition-transform duration-700 ease-smooth group-hover:rotate-[360deg] group-hover:border-accent">
                <Icon size={22} weight="duotone" />
              </span>
              <span className="leading-snug font-semibold">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
