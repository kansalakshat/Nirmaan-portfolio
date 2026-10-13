import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* Every hook here is pointer-driven, so every one asks the same two things:
   is there a real pointer, and has this person asked for less motion? */
const skipPointerMotion = () =>
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Element leans toward the cursor when you get close */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || skipPointerMotion()) return
    const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      qx((e.clientX - (r.left + r.width / 2)) * strength)
      qy((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      qx(0)
      qy(0)
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])
  return ref
}

/* 3D tilt toward the cursor, plus a --mx/--my pair CSS uses for the light spot */
export function useTilt(max = 8) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || skipPointerMotion()) return
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * 2 * max)
      rx((py - 0.5) * -2 * max)
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [max])
  return ref
}
