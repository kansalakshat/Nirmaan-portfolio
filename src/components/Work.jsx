import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import { projects } from '../data'
import { reduced } from '../lib/scroll'
import { useTilt } from '../hooks/useInteractions'

const DEPTH = 2200 // px between panels in the corridor

function Card({ p }) {
  const tilt = useTilt(5)
  return (
    <article
      ref={tilt}
      className={`tilt panel brackets relative grid w-full gap-4 p-4 sm:gap-6 sm:p-7 md:gap-10 ${
        p.portrait ? 'md:grid-cols-[minmax(0,0.75fr)_1fr]' : 'md:grid-cols-[1.3fr_1fr]'
      }`}
    >
      <span className="spot" aria-hidden />
      <a
        href={p.live}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${p.name} live`}
        className={`shot block self-center ${p.portrait ? 'mx-auto w-[130px] sm:w-[min(100%,260px)]' : ''}`}
      >
        <img
          src={p.shot}
          alt={`${p.name} running live`}
          loading="lazy"
          width={p.portrait ? 430 : 1440}
          height={p.portrait ? 900 : 900}
          className={`w-full object-cover object-top ${p.portrait ? 'aspect-[430/820]' : 'aspect-[16/10]'}`}
        />
      </a>
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-3">
          <p className="hud-label">{p.kind}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
            <GithubLogo size={12} weight="bold" /> Open source
          </span>
        </div>
        <h3 className="display mt-2 text-[clamp(1.6rem,3.2vw,2.9rem)] sm:mt-3">{p.name}</h3>
        <p className="mt-2 font-semibold text-ink sm:mt-4 sm:text-lg">{p.line}</p>
        <p className="mt-3 hidden leading-relaxed text-ink-70 md:block [@media(max-height:820px)]:hidden">{p.desc}</p>
        <ul className="mt-3 space-y-1.5 sm:mt-5 sm:space-y-2">
          {p.facts.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-ink">
              <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
              {f}
            </li>
          ))}
        </ul>
        <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
          {p.stack.map((s) => (
            <li key={s} className="rounded-full border border-stone px-3 py-1 font-mono text-xs text-ink-70">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-4 sm:pt-7">
          <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary">
            Live <ArrowUpRight size={18} weight="bold" />
          </a>
          <a href={p.code} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <GithubLogo size={18} weight="bold" /> Source
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  const root = useRef()
  const stage = useRef()
  const count = useRef()
  const corridor = !reduced

  useEffect(() => {
    if (!corridor) return
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('all', () => {
        const panels = gsap.utils.toArray('.proj')
        const n = panels.length
        const start = 0 // first panel (Tenderleo) starts centred on the reading plane

        /* The camera is fixed; the corridor moves. Each panel sits DEPTH further
           back, swings in from alternating sides, and dissolves as it passes. */
        const span = (n - 1) * DEPTH - start
        const render = (p) => {
          const cam = start + p * span
          panels.forEach((el, i) => {
            const z = cam - i * DEPTH
            const side = i % 2 ? 1 : -1
            // Fully solid while near the reading plane, fades only at the ends
            const o = z > 120 ? 1 - (z - 120) / 500 : z < -500 ? 1 + (z + 500) / (DEPTH * 0.8) : 1
            const alpha = gsap.utils.clamp(0, 1, o)
            gsap.set(el, {
              z,
              x: side * -z * (window.innerWidth < 768 ? 0.05 : 0.16),
              rotationY: side * gsap.utils.clamp(-40, 40, (-z / DEPTH) * 28),
              autoAlpha: alpha,
              zIndex: Math.round(5000 + z),
            })
          })
          const active = gsap.utils.clamp(0, n - 1, Math.round((cam + 300) / DEPTH))
          count.current.textContent = `${String(active + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}  ${projects[active].name}`
        }

        ScrollTrigger.create({
          trigger: stage.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * n * 1.1}`,
          pin: true,
          // Come to rest with a project square on the reading plane
          snap: {
            snapTo: panels.map((_, i) => (i * DEPTH - start) / span),
            duration: { min: 0.3, max: 0.8 },
            delay: 0.15,
            ease: 'power2.inOut',
          },
          onUpdate: (s) => render(s.progress),
          onRefresh: (s) => render(s.progress),
        })
        render(0)
        return () => gsap.set(panels, { clearProps: 'all' })
      })
    }, root)
    return () => ctx.revert()
  }, [corridor])

  return (
    <section id="work" ref={root} className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-8 md:pt-32">
        <p className="eyebrow mb-6">Selected work</p>
        <h2 className="skew display text-[clamp(2.2rem,6vw,5.2rem)]">
          Four systems. Live and <span className="text-accent">open source.</span>
        </h2>
      </div>

      <div
        ref={stage}
        className={`relative mx-auto max-w-7xl px-4 sm:px-8 ${
          corridor ? 'h-[100dvh] max-w-none overflow-hidden [perspective:1200px]' : ''
        }`}
      >
        <div className="flex flex-col gap-10 py-16 md:gap-16">
          {projects.map((p) => (
            <div
              key={p.name}
              className={`proj ${
                corridor
                  ? 'pointer-events-none absolute inset-0 flex items-center justify-center px-4 pt-14 md:px-8 md:pt-16'
                  : ''
              }`}
            >
              <div className="pointer-events-auto w-full max-w-[1120px]">
                <Card p={p} />
              </div>
            </div>
          ))}
        </div>
        {corridor && (
          <p
            ref={count}
            aria-hidden
            className="hud-label absolute bottom-6 left-8 hidden whitespace-pre text-ink md:block"
          />
        )}
      </div>
    </section>
  )
}
