import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { reduced } from '../lib/scroll'

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin)

const stats = [
  { value: 60000, suffix: '+', label: 'public tenders tracked by Tenderleo' },
  { value: 23, label: 'government portals crawled every day' },
  { value: 4, label: 'products live in production' },
  { value: 2, label: 'languages in Nirmaan OS, English and Hindi' },
]

/* Circuit traces: horizontal runs with 45 degree jogs, like a PCB */
const TRACES = [
  'M-20 60 H240 L290 110 H560 L610 60 H830 L880 20 H1220',
  'M-20 165 H130 L180 215 H430 L480 165 H700 L750 215 H1010 L1060 165 H1220',
  'M-20 270 H320 L370 320 H640 L690 270 H910 L960 320 H1220',
  'M-20 375 H210 L260 410 H520 L570 375 H790 L840 410 H1220',
]
const PADS = [
  [290, 110], [610, 60], [880, 20], [180, 215], [480, 165], [750, 215], [1060, 165],
  [370, 320], [690, 270], [960, 320], [260, 410], [570, 375], [840, 410],
]

const fmt = (n) => Math.round(n).toLocaleString('en-IN')

export default function Numbers() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.stat-num')
      if (reduced) return

      // Traces draw themselves as the section scrolls through
      gsap.fromTo(
        '.trace-live',
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          stagger: 0.15,
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 45%', scrub: true },
        },
      )

      // Data packets run the traces on a loop, only while the section is on screen
      const packets = gsap.timeline({ paused: true, repeat: -1 })
      gsap.utils.toArray('.packet').forEach((dot, i) => {
        packets.to(
          dot,
          {
            motionPath: { path: `#trace-${i % TRACES.length}`, align: `#trace-${i % TRACES.length}`, alignOrigin: [0.5, 0.5] },
            duration: 3.2 + (i % 3) * 0.7,
            ease: 'none',
            repeat: 1,
          },
          i * 0.45,
        )
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (s) => (s.isActive ? packets.play() : packets.pause()),
      })

      // Counters run up once, the first time they come into view
      nums.forEach((el, i) => {
        const s = stats[i]
        const o = { v: 0 }
        el.textContent = '0'
        gsap.to(o, {
          v: s.value,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = fmt(o.v)),
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-label="In numbers" className="relative overflow-hidden bg-paper/85 py-28 md:py-40">
      <svg
        aria-hidden
        viewBox="0 0 1200 430"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {TRACES.map((d, i) => (
          <path key={`b${i}`} d={d} fill="none" stroke="#2b2621" strokeWidth="2" />
        ))}
        {TRACES.map((d, i) => (
          <path key={i} id={`trace-${i}`} className="trace-live" d={d} fill="none" stroke="#ff6b00" strokeOpacity="0.55" strokeWidth="2" />
        ))}
        {PADS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#0a0908" stroke="#ff6b00" strokeOpacity="0.7" strokeWidth="2" />
        ))}
        {!reduced &&
          Array.from({ length: 8 }, (_, i) => (
            <rect key={i} className="packet" x="-6" y="-3" width="12" height="6" rx="3" fill="#ff6b00" />
          ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <h2 className="skew display text-[clamp(2.4rem,6vw,5.2rem)]">
          Built, shipped, <span className="text-accent">running.</span>
        </h2>
        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:gap-x-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-accent bg-paper/70 py-2 pl-5">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="display text-[clamp(1.9rem,3.5vw,3.4rem)] tabular-nums">
                  <span className="stat-num">{fmt(s.value)}</span>
                  {s.suffix && <span className="text-accent">{s.suffix}</span>}
                </span>
                <p aria-hidden className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ink-70 sm:text-base">
                  {s.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
