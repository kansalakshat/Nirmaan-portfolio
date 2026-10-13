import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ArrowUpRight, GithubLogo, List, X } from '@phosphor-icons/react'
import { scrollToId, reduced, lockScroll } from '../lib/scroll'
import { useMagnetic } from '../hooks/useInteractions'
import { GITHUB } from '../data'

gsap.registerPlugin(ScrambleTextPlugin)

const links = [
  ['work', 'Work'],
  ['process', 'Process'],
  ['services', 'Services'],
  ['contact', 'Contact'],
]

/* Label decodes itself on hover, like a terminal resolving a string */
function ScrambleLink({ id, label }) {
  const ref = useRef()
  const enter = () => {
    if (reduced) return
    gsap.to(ref.current, { duration: 0.6, scrambleText: { text: label, chars: '01<>/_#', speed: 0.6 } })
  }
  return (
    <a
      href={`#${id}`}
      onClick={(e) => scrollToId(e, id)}
      onMouseEnter={enter}
      onFocus={enter}
      className="inline-flex min-h-11 items-center rounded-full px-4 font-mono text-sm tracking-[0.16em] text-ink-70 uppercase transition-colors duration-300 hover:bg-ink/5 hover:text-ink"
    >
      <span ref={ref}>{label}</span>
    </a>
  )
}

/* Phones: a full-screen menu that irises open from the toggle */
function MobileMenu({ open, onClose }) {
  const root = useRef()
  const tl = useRef()
  const wasOpen = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: 'visible' })
        .fromTo(
          root.current,
          { clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' },
          { clipPath: 'circle(150% at calc(100% - 3rem) 3rem)', duration: reduced ? 0.01 : 0.7, ease: 'expo.inOut' },
        )
        .from('.m-link', { yPercent: 110, rotationX: -70, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out', transformPerspective: 600 }, '-=0.3')
        .from('.m-foot', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      wasOpen.current = true
      lockScroll(true)
      tl.current.timeScale(1).play()
      root.current.querySelector('a')?.focus()
      const onKey = (e) => e.key === 'Escape' && onClose()
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
    if (!wasOpen.current) return
    wasOpen.current = false
    lockScroll(false)
    tl.current.timeScale(1.8).reverse()
  }, [open, onClose])

  const go = (e, id) => {
    e.preventDefault()
    onClose()
    // Let the menu start closing before the page moves under it
    setTimeout(() => scrollToId(null, id), 250)
  }

  return (
    <div
      ref={root}
      id="mobile-menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-bone px-6 pt-32 pb-10 md:hidden"
    >
      <nav aria-label="Mobile" className="flex flex-col gap-2">
        {links.map(([id, label]) => (
          <div key={id} className="overflow-hidden">
            <a
              href={`#${id}`}
              onClick={(e) => go(e, id)}
              tabIndex={open ? 0 : -1}
              className="m-link display block py-1 text-[clamp(2.6rem,13vw,4rem)] transition-colors active:text-accent"
            >
              {label}
            </a>
          </div>
        ))}
      </nav>
      <div className="m-foot font-mono text-sm tracking-[0.16em] text-ink-70 uppercase">
        <p>nirmaanos35@gmail.com</p>
        <p className="mt-2">Indore, India</p>
      </div>
    </div>
  )
}

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const cta = useMagnetic(0.25)
  const close = useCallback(() => setOpen(false), [])

  /* Hide on the way down, return on the way up */
  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 200 && y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <MobileMenu open={open} onClose={close} />
      <header
        className={`fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 transition-transform duration-500 ease-smooth ${
          hidden && !open ? '-translate-y-[160%]' : ''
        }`}
      >
        <nav className="panel flex h-16 items-center gap-2 !rounded-full !bg-paper/70 py-2 pr-2 pl-4 backdrop-blur-md">
          <a
            href="#top"
            onClick={(e) => scrollToId(e, 'top')}
            className="flex min-h-11 items-center gap-3"
            aria-label="Nirmaan Tech, back to top"
          >
            <img src="/favicon.png" alt="" width="32" height="32" className="h-8 w-8" />
            <span className="hidden font-display text-sm font-bold tracking-[0.08em] uppercase sm:inline">
              Nirmaan<span className="text-accent">.</span>Tech
            </span>
          </a>
          <div className="ml-auto hidden items-center md:flex">
            {links.map(([id, label]) => (
              <ScrambleLink key={id} id={id} label={label} />
            ))}
          </div>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            aria-label="Nirmaan Tech on GitHub, all our code is open source"
            title="We are open source"
            className="ml-2 hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-stone text-ink transition-colors duration-300 hover:border-accent hover:text-accent md:grid"
          >
            <GithubLogo size={20} weight="bold" />
          </a>
          <a
            ref={cta}
            href="#contact"
            onClick={(e) => scrollToId(e, 'contact')}
            className="btn btn-primary ml-auto !min-h-12 !px-5 !text-xs md:ml-2"
          >
            Start a project <ArrowUpRight size={16} weight="bold" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-stone text-ink transition-colors active:bg-accent active:text-paper md:hidden"
          >
            {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </nav>
      </header>
    </>
  )
}
