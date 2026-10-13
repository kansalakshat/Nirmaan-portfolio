import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import { GITHUB, projects } from '../data'
import { reduced } from '../lib/scroll'
import { useMagnetic } from '../hooks/useInteractions'

gsap.registerPlugin(TextPlugin)

const REPOS = [
  { repo: 'Tender-os', lang: 'Python', what: 'tender intelligence' },
  { repo: 'CA', lang: 'JavaScript', what: 'CA firm CRM' },
  { repo: 'Nirmaan-OS', lang: 'TypeScript', what: 'construction app' },
  { repo: 'indianoil-lucky-draw', lang: 'Node.js', what: 'lucky draw system' },
]
const LIST_CMD = 'gh repo list kansalakshat --public'
const CLONE_CMD = 'git clone github.com/kansalakshat/Tender-os'

export default function OpenSource() {
  const root = useRef()
  const cta = useMagnetic(0.3)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // The terminal types itself out the first time it scrolls into view
      gsap
        .timeline({ scrollTrigger: { trigger: '.term', start: 'top 75%', once: true } })
        .fromTo('.cmd-1', { text: '' }, { text: LIST_CMD, duration: 1.1, ease: 'none' })
        .from('.repo-row', { opacity: 0, x: -24, duration: 0.45, stagger: 0.14, ease: 'power3.out' }, '+=0.15')
        .from('.prompt-2', { opacity: 0, duration: 0.01 }, '+=0.2')
        .fromTo('.cmd-2', { text: '' }, { text: CLONE_CMD, duration: 1.2, ease: 'none' })
        .from('.clone-out', { opacity: 0, duration: 0.3 }, '+=0.2')
      gsap.from('.os-word', {
        yPercent: 110,
        rotationX: -80,
        opacity: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: 'expo.out',
        transformPerspective: 700,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="os-title" className="relative bg-paper/90 py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-8">
        <p className="eyebrow mb-8 inline-block">Open source</p>
        <h2 id="os-title" className="skew display text-[clamp(2.6rem,7.4vw,6.4rem)]">
          <span className="os-word inline-block">Open source</span>{' '}
          <span className="os-word inline-block text-accent">by default.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-70">
          Every product on this page is public on GitHub. Read the code, run it yourself or fork it. You see exactly
          what you are paying for, and you are never locked in.
        </p>
      </div>

      <div className="term panel mx-auto mt-14 max-w-3xl overflow-hidden text-left font-mono text-[13px] sm:text-sm">
        <div className="flex items-center gap-2 border-b border-stone px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-stone" />
          <span className="h-3 w-3 rounded-full bg-stone" />
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="ml-3 text-xs text-ink-40">~/nirmaan</span>
        </div>
        <div className="space-y-1 overflow-x-auto p-5 leading-relaxed sm:p-6">
          <p className="whitespace-nowrap">
            <span className="text-accent">$ </span>
            <span className="cmd-1 text-ink">{LIST_CMD}</span>
          </p>
          <ul className="py-2">
            {REPOS.map((r) => (
              <li key={r.repo} className="repo-row">
                <a
                  href={`${GITHUB}/${r.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group -mx-2 grid min-h-9 grid-cols-[1fr_auto] items-center gap-x-6 rounded-md px-2 transition-colors hover:bg-accent hover:text-paper sm:grid-cols-[14rem_7rem_1fr]"
                >
                  <span className="truncate text-ink group-hover:text-paper">{r.repo}</span>
                  <span className="text-ink-40 group-hover:text-paper">{r.lang}</span>
                  <span className="hidden text-ink-70 group-hover:text-paper sm:block">{r.what}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="prompt-2 whitespace-nowrap">
            <span className="text-accent">$ </span>
            <span className="cmd-2 text-ink">{CLONE_CMD}</span>
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" aria-hidden />
          </p>
          <p className="clone-out text-ink-40">Cloning into 'Tender-os'... done.</p>
        </div>
      </div>

      <div className="mt-12 flex justify-center px-4">
        <a ref={cta} href={GITHUB} target="_blank" rel="noreferrer" className="btn btn-primary">
          <GithubLogo size={18} weight="bold" /> Browse all {projects.length} repos <ArrowUpRight size={18} weight="bold" />
        </a>
      </div>
    </section>
  )
}
