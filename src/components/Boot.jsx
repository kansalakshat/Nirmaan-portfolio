import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { finishBoot, reduced } from '../lib/scroll'

gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin, CustomEase)

/* The Nirmaan mark as five rounded slabs, in the logo's own pixel space */
const SLABS = [
  { x: 495, y: 142, w: 117, h: 443 },
  { x: 453, y: 92, w: 117, h: 498 },
  { x: 398, y: 40, w: 117, h: 515 },
  { x: 45, y: 10, w: 150, h: 555 },
  { x: 208, y: -30, w: 160, h: 630, rot: -41 },
]

const LINES = ['Nirmaan.OS', 'Linking modules', 'Rendering world']

/* Plays once per browser session: a returning visitor clicking around
   should not sit through the intro again. */
const seen = () => {
  try {
    return !!sessionStorage.getItem('nt-boot')
  } catch {
    return false
  }
}

export default function Boot() {
  const [show, setShow] = useState(() => !reduced && !seen())
  const root = useRef()
  const num = useRef()

  useEffect(() => {
    if (!show) {
      finishBoot()
      return
    }
    try {
      sessionStorage.setItem('nt-boot', '1')
    } catch {
      /* private mode: the intro just plays again next time */
    }

    let alive = true
    const ctx = gsap.context(() => {
      CustomEase.create('slam', 'M0,0 C0.7,0 0.84,0.12 0.9,0.5 0.96,0.88 0.98,1 1,1')
      const count = { v: 0 }
      const tl = gsap
        .timeline({ paused: true, onComplete: () => setShow(false) })
        .from('.boot-slab', { drawSVG: 0, duration: 1.3, stagger: 0.12, ease: 'power2.inOut' })
        .to('.boot-slab', { fillOpacity: 1, duration: 0.45, stagger: 0.05 }, '-=0.35')
        .to(
          count,
          {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            // Revert on unmount replays this once more after the node is gone
            onUpdate: () => num.current && (num.current.textContent = String(Math.round(count.v)).padStart(3, '0')),
          },
          0,
        )
        .to('.boot-line', { duration: 0.7, scrambleText: { text: '{original}', chars: '01<>/_#', speed: 0.5 }, stagger: 0.3 }, 0.1)
        .add(finishBoot, '+=0.05')
        // The screen splits along the middle and the hero rushes through
        .to('.boot-core', { scale: 1.5, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, '<')
        .to('.boot-top', { yPercent: -100, duration: 0.9, ease: 'slam' }, '<0.15')
        .to('.boot-bottom', { yPercent: 100, duration: 0.9, ease: 'slam' }, '<')
      // The counter is set in the display face; start once it has loaded
      // alive: a cleaned-up run must not play its reverted timeline, whose
      // instant onComplete would close the boot screen early
      // Capped: a slow font server must never strand the visitor on the loader
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => alive && tl.play())
    }, root)
    return () => {
      alive = false
      ctx.revert()
    }
  }, [show])

  if (!show) return null

  return (
    <div ref={root} role="status" aria-label="Loading Nirmaan Tech" className="fixed inset-0 z-[90]">
      <div className="boot-top absolute inset-x-0 top-0 h-1/2 border-b border-accent/40 bg-paper" />
      <div className="boot-bottom absolute inset-x-0 bottom-0 h-1/2 bg-paper" />
      <div className="boot-core absolute inset-0 flex flex-col items-center justify-center gap-8">
        <svg viewBox="0 -40 672 680" className="h-28 w-28 overflow-visible sm:h-36 sm:w-36" aria-hidden>
          {SLABS.map((s, i) => (
            <rect
              key={i}
              className="boot-slab"
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx="42"
              transform={s.rot ? `rotate(${s.rot} ${s.x + s.w / 2} ${s.y + s.h / 2})` : undefined}
              fill="#ff6b00"
              fillOpacity="0"
              stroke="#ff6b00"
              strokeWidth="10"
            />
          ))}
        </svg>
        <div className="flex flex-col items-center gap-1 font-mono text-xs tracking-[0.24em] text-ink-40 uppercase">
          {LINES.map((l) => (
            <span key={l} className="boot-line">
              {l}
            </span>
          ))}
        </div>
        <span ref={num} className="font-display text-5xl font-bold text-ink tabular-nums">
          000
        </span>
      </div>
    </div>
  )
}
