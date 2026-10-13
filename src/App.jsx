import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { startScroll, reduced, scrollState } from './lib/scroll'
import Boot from './components/Boot'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Manifesto from './components/Manifesto'
import Work from './components/Work'
import Numbers from './components/Numbers'
import OpenSource from './components/OpenSource'
import Process from './components/Process'
import Services from './components/Services'
import Integrations from './components/Integrations'
import Contact from './components/Contact'

/* three.js is the heaviest thing on the page: load it once the text has painted */
const Scene = lazy(() => import('./components/Scene'))

export default function App() {
  const [showScene, setShowScene] = useState(false)
  const bar = useRef()

  useEffect(() => {
    const stop = startScroll()
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
    const id = idle(() => setShowScene(true))

    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.to(bar.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      })

      // Section headings lean into the scroll and spring back when it stops
      const skews = gsap.utils.toArray('.skew').map((el) => gsap.quickTo(el, 'skewY', { duration: 0.6, ease: 'power3.out' }))
      const lean = () => {
        const k = gsap.utils.clamp(-6, 6, -scrollState.velocity * 0.18)
        skews.forEach((set) => set(k))
      }
      gsap.ticker.add(lean)
      return () => gsap.ticker.remove(lean)
    })
    return () => {
      stop()
      ctx.revert()
      window.cancelIdleCallback?.(id)
    }
  }, [])

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-paper"
      >
        Skip to work
      </a>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {showScene && (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        )}
      </div>
      <div ref={bar} aria-hidden className="fixed top-0 left-0 z-50 h-[2px] w-full origin-left scale-x-0 bg-accent" />
      <Boot />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Manifesto />
        <Work />
        <Numbers />
        <Process />
        <Services />
        <Integrations />
        <OpenSource />
        <Contact />
      </main>
    </>
  )
}
