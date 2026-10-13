import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { services } from '../data'
import { reduced } from '../lib/scroll'

const STEP = 360 / services.length

function Face({ s, style, className = '' }) {
  const Icon = s.icon
  return (
    <article style={style} className={`panel group flex flex-col p-5 sm:p-7 ${className}`}>
      <span className="grid h-14 w-14 place-items-center rounded-full border border-stone text-accent transition-transform duration-700 ease-smooth group-hover:rotate-[360deg]">
        <Icon size={26} weight="duotone" />
      </span>
      <h3 className="display mt-auto pt-8 text-[1.6rem] sm:pt-10 sm:text-[1.9rem]">{s.name}</h3>
      <p className="mt-3 leading-relaxed text-ink-70">{s.desc}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {s.tags.map((t) => (
          <li key={t} className="rounded-full border border-stone px-3 py-1 font-mono text-xs text-ink-70">
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Services() {
  const root = useRef()
  const prism = useRef()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('all', () => {
        const faces = gsap.utils.toArray('.face')
        // Scroll turns the hexagonal prism one face at a time
        gsap.fromTo(
          prism.current,
          { rotationY: 0, rotationX: -10 },
          {
            rotationY: -(services.length - 1) * STEP,
            rotationX: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${window.innerHeight * 2.6}`,
              pin: true,
              scrub: 0.6,
              snap: { snapTo: 1 / (services.length - 1), duration: 0.4, ease: 'power2.inOut' },
              onUpdate: (s) => {
                const front = Math.round(s.progress * (services.length - 1))
                faces.forEach((f, i) => f.classList.toggle('is-front', i === front))
              },
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={root} className="relative overflow-hidden">
      <div className={`mx-auto flex max-w-7xl flex-col px-4 sm:px-8 ${reduced ? 'py-28' : 'h-[100dvh] justify-center'}`}>
        <h2 className="skew display text-center text-[clamp(2.4rem,6vw,5.2rem)]">
          Six things <span className="text-accent">we build.</span>
        </h2>

        {/* A six-sided prism you rotate by scrolling, phones included */}
        <div className={`relative mx-auto mt-20 h-[360px] w-[250px] [--rz:230px] [perspective:1800px] sm:mt-16 sm:h-[420px] sm:w-[330px] sm:[--rz:310px] ${reduced ? 'hidden' : ''}`}>
          <div ref={prism} className="prism absolute inset-0">
            {services.map((s, i) => (
              <Face
                key={s.name}
                s={s}
                className={`face ${i === 0 ? 'is-front' : ''}`}
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--rz))` }}
              />
            ))}
          </div>
        </div>

        {/* Reduced motion: a plain grid */}
        <div className={`mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${reduced ? '' : 'hidden'}`}>
          {services.map((s) => (
            <Face key={s.name} s={s} className="min-h-[320px]" />
          ))}
        </div>
      </div>
    </section>
  )
}
