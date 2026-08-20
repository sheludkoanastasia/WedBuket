import { useLayoutEffect, useRef } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

/** Киношный scroll-reveal для `.reveal-child` внутри секции (один раз). */
export function useReveal() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const children = el.querySelectorAll('.reveal-child')
    if (!children.length) return undefined

    const { gsap } = getGsap()

    if (prefersReducedMotion()) {
      gsap.set(children, { clearProps: 'all' })
      return undefined
    }

    gsap.set(children, { opacity: 0, y: 56, force3D: true })

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 1.15,
      stagger: 0.16,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return ref
}
