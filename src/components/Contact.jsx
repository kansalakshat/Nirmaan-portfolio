import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import { contact, GITHUB } from '../data'
import { reduced, scrollToId } from '../lib/scroll'
import { useMagnetic } from '../hooks/useInteractions'

gsap.registerPlugin(SplitText)

function Row({ label, value, href, external }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="wipe group flex flex-col gap-2 border-b border-stone px-2 py-7 md:flex-row md:items-center md:justify-between md:px-6"
      >
        <span className="hud-label">{label}</span>
        <span className="flex items-center gap-4 font-display text-[clamp(1.15rem,3.4vw,2.6rem)] font-bold tracking-tight">
          {value}
          <ArrowUpRight
            size={28}
            weight="bold"
            className="shrink-0 transition-transform duration-500 ease-smooth group-hover:rotate-45"
          />
        </span>
      </a>
    </li>
  )
}

/* Giant outlined wordmark. Letters near the cursor rise and fill orange;
   on touch screens they rise in once as the footer arrives. */
function Wordmark() {
  const root = useRef()
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray('.wm-char')
      gsap.from(chars, {
        yPercent: 100,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 95%' },
      })
      if (window.matchMedia('(hover: none)').matches) return
      const ys = chars.map((c) => gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3.out' }))
      const fills = chars.map((c) => gsap.quickTo(c, '--fill', { duration: 0.4, ease: 'power2.out' }))
      const move = (e) => {
        chars.forEach((c, i) => {
          const r = c.getBoundingClientRect()
          const d = Math.abs(e.clientX - (r.left + r.width / 2))
          const k = Math.max(0, 1 - d / (r.width * 1.6))
          ys[i](-k * r.height * 0.22)
          fills[i](k)
        })
      }
      const leave = () => chars.forEach((_, i) => (ys[i](0), fills[i](0)))
      root.current.addEventListener('mousemove', move)
      root.current.addEventListener('mouseleave', leave)
      return () => {
        root.current?.removeEventListener('mousemove', move)
        root.current?.removeEventListener('mouseleave', leave)
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} aria-hidden className="overflow-hidden px-2 pt-10 select-none sm:px-4">
      <div className="flex justify-between font-display text-[15.5vw] leading-[0.85] font-extrabold uppercase">
        {'Nirmaan'.split('').map((c, i) => (
          <span
            key={i}
            className="wm-char inline-block [--fill:0] [-webkit-text-stroke:1.5px_var(--color-accent)]"
            style={{ color: 'rgb(255 107 0 / var(--fill))' }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Contact() {
  const root = useRef()
  const cta = useMagnetic(0.3)

  useEffect(() => {
    if (reduced) return
    let alive = true
    const ctx = gsap.context(() => {}, root)
    document.fonts.ready.then(() => alive && ctx.add(() => {
      const split = SplitText.create('.contact-title', { type: 'words,chars' })
      gsap.from(split.chars, {
        yPercent: 120,
        rotationX: -90,
        opacity: 0,
        stagger: 0.02,
        duration: 1.2,
        ease: 'expo.out',
        transformPerspective: 700,
        scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
      })
      gsap.from('.wipe', {
        x: -60,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.rows', start: 'top 85%' },
      })
    }))
    return () => {
      alive = false
      ctx.revert()
    }
  }, [])

  return (
    <section id="contact" ref={root} className="relative bg-paper">
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-8 md:pt-40">
        <p className="eyebrow mb-8">Contact</p>
        <h2 className="contact-title display max-w-6xl text-[clamp(2.6rem,8.4vw,8rem)]">
          Let&apos;s build your <span className="text-accent">digital future.</span>
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-ink-70">
            Tell us what you&apos;re trying to improve. We&apos;ll help you turn it into a digital solution.
          </p>
          <a
            ref={cta}
            href={`mailto:${contact.email}?subject=${encodeURIComponent('New project for Nirmaan Tech')}`}
            className="btn btn-primary self-start md:self-auto"
          >
            Start a project <ArrowUpRight size={18} weight="bold" />
          </a>
        </div>

        <ul className="rows mt-16 border-t border-stone">
          <Row label="Email" value={contact.email} href={`mailto:${contact.email}`} />
          {contact.phones.map((p) => (
            <Row key={p.href} label="Phone" value={p.label} href={p.href} />
          ))}
          <Row
            label="Location"
            value={contact.location}
            href="https://www.google.com/maps/search/?api=1&query=Indore%2C%20India"
            external
          />
        </ul>
      </div>

      <Wordmark />
      <footer className="border-t border-stone">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <a href="#top" onClick={(e) => scrollToId(e, 'top')} className="flex min-h-11 items-center gap-3">
            <img src="/favicon.png" alt="" width="32" height="32" className="h-8 w-8" />
            <span className="font-display text-sm font-bold tracking-[0.08em] uppercase">
              Nirmaan<span className="text-accent">.</span>Tech
            </span>
          </a>
          <p className="font-mono text-sm tracking-[0.16em] text-ink-70 uppercase">One platform. Many possibilities.</p>
          <div className="flex items-center gap-6 text-sm text-ink-70">
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-accent"
            >
              <GithubLogo size={20} weight="bold" /> GitHub
            </a>
            <span>© 2026 Nirmaan Tech</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
