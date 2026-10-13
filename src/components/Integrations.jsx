import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { integrations } from '../data'
import { reduced } from '../lib/scroll'

/* Outer ring stays under 0.95 of the stage so a chip centred on it never
   pokes past the stage edge, at any width. */
const RINGS = [
  { size: 0.6, dur: '42s', rev: false, offset: 45 },
  { size: 0.92, dur: '64s', rev: true, offset: 0 },
]

/* Phones get icon-only chips: ten labelled chips cannot share a 300px orbit
   without piling up. The names are listed in full under the orbit instead. */
function Chip({ name, icon: Icon }) {
  return (
    <div
      title={name}
      className="panel flex items-center gap-2 !rounded-full p-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 hover:!border-accent sm:!rounded-xl sm:px-4 sm:py-3"
    >
      <Icon size={20} weight="duotone" className="text-accent" />
      <span className="hidden sm:inline">{name}</span>
    </div>
  )
}

export default function Integrations() {
  const root = useRef()
  const stage = useRef()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // The orbit tips from edge-on to open as you scroll through it.
      // Phones open it wider so the squashed ellipse still has room.
      const mm = gsap.matchMedia()
      const tip = (from, to) =>
        gsap.fromTo(
          stage.current,
          { '--tilt': from },
          {
            '--tilt': to,
            ease: 'none',
            scrollTrigger: { trigger: stage.current, start: 'top bottom', end: 'center center', scrub: true },
          },
        )
      mm.add('(max-width: 639px)', () => tip('72deg', '42deg'))
      mm.add('(min-width: 640px)', () => tip('80deg', '54deg'))
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
        <h2 className="skew display text-[clamp(2.2rem,5.4vw,4.6rem)]">
          Plugs into the tools <span className="text-accent">you already use.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-70">
          WhatsApp, payment gateways, email, SMS, Google Maps, accounting tools and other third-party services, wired
          into one system.
        </p>
      </div>

      <div
        ref={stage}
        aria-hidden
        className="orbit-stage relative mx-auto mt-6 aspect-square w-[min(80vw,720px)] [--S:min(80vw,720px)]"
        style={{ '--tilt': '54deg' }}
      >
        <div className="orbit-plane absolute inset-0">
          {RINGS.map((r, ri) => (
            <div
              key={ri}
              className={`ring ${r.rev ? 'rev' : ''}`}
              style={{ width: `${r.size * 100}%`, height: `${r.size * 100}%`, '--dur': r.dur }}
            >
              {integrations[ri].map((c, k) => (
                <div
                  key={c.name}
                  className="chip-slot"
                  style={{
                    '--a': `${(k * 360) / integrations[ri].length + r.offset}deg`,
                    '--r': `calc(var(--S) * ${r.size / 2})`,
                  }}
                >
                  <div className="chip">
                    <Chip {...c} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-2xl border border-accent/60 bg-paper sm:h-28 sm:w-28 sm:rounded-3xl">
          <img src="/logo.png" alt="" width="96" height="94" className="h-10 w-10 object-contain sm:h-16 sm:w-16" />
          <span
            aria-hidden
            className="absolute -inset-3 animate-ping rounded-[1.5rem] border border-accent/30 [animation-duration:2.6s] sm:-inset-4 sm:rounded-[2rem]"
          />
        </div>
      </div>

      {/* The orbit is decorative; this is the readable list, shown where chips are icon-only */}
      <ul className="mx-auto mt-2 flex max-w-md flex-wrap justify-center gap-2 px-4 sm:sr-only">
        {integrations.flat().map(({ name }) => (
          <li key={name} className="rounded-full border border-stone px-3 py-1.5 font-mono text-xs text-ink-70">
            {name}
          </li>
        ))}
      </ul>
    </section>
  )
}
