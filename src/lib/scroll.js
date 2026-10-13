import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Read every frame by the WebGL scene and the heading skew. A plain object,
   not React state: it changes 60 times a second and nothing should re-render. */
export const scrollState = { velocity: 0 }

/* The boot screen resolves this when it starts to open. The hero intro and
   scrolling both wait on it, so nothing plays behind the loader. */
let bootResolve
export const bootDone = new Promise((r) => (bootResolve = r))
export const finishBoot = () => bootResolve()

let lenis = null

export function startScroll() {
  if (reduced) return () => {}
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  // Lenis animates the scroll itself, so ScrollTrigger must hear every step
  lenis.on('scroll', ScrollTrigger.update)
  lenis.stop()
  /* Lag smoothing stays on through the boot: while the page is still loading,
     the main thread stalls and an unsmoothed ticker would jump the intro ahead
     instead of pausing it. Off afterwards, so Lenis and ScrollTrigger agree. */
  bootDone.then(() => {
    gsap.ticker.lagSmoothing(0)
    lenis?.start()
  })

  /* Velocity is sampled on the ticker, not in the scroll event: Lenis zeroes
     it when it settles but emits no event for that, so an event-driven copy
     would stay stuck at the last non-zero speed. */
  const tick = (t) => {
    lenis.raf(t * 1000)
    scrollState.velocity = lenis.velocity
  }
  gsap.ticker.add(tick)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

/* Freeze page scroll while an overlay (the phone menu) is open */
export function lockScroll(on) {
  if (lenis) on ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = on ? 'hidden' : ''
}

export function scrollToId(e, id) {
  const el = document.getElementById(id)
  if (!el) return
  e?.preventDefault()
  if (lenis) lenis.scrollTo(el)
  else el.scrollIntoView()
}
