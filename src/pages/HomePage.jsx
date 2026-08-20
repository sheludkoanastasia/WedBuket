import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import About from '../components/About'
import Portfolio from '../components/Portfolio'
import LookDate from '../components/LookDate'
import BridalBouquet from '../components/BridalBouquet'
import Works from '../components/Works'
import { getGsap, prefersReducedMotion } from '../lib/gsap'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  usePageMeta,
} from '../hooks/usePageMeta'

function lockPageScroll() {
  const html = document.documentElement
  html.classList.add('site-scroll-lock')

  const block = (event) => {
    event.preventDefault()
  }

  const blockKeys = (event) => {
    const keys = [
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' ',
      'Spacebar',
    ]
    if (keys.includes(event.key)) event.preventDefault()
  }

  window.addEventListener('wheel', block, { passive: false })
  window.addEventListener('touchmove', block, { passive: false })
  window.addEventListener('keydown', blockKeys)

  return () => {
    html.classList.remove('site-scroll-lock')
    window.removeEventListener('wheel', block)
    window.removeEventListener('touchmove', block)
    window.removeEventListener('keydown', blockKeys)
  }
}

function HomePage() {
  const location = useLocation()
  const [heroReady, setHeroReady] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const headerRef = useRef(null)
  const heroWrapRef = useRef(null)
  const restRef = useRef(null)
  const introStarted = useRef(false)

  usePageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION)

  const onHeroReady = useCallback(() => setHeroReady(true), [])

  useLayoutEffect(() => {
    document.documentElement.classList.add('site-booting')
    return () => {
      document.documentElement.classList.remove(
        'site-booting',
        'site-intro',
        'site-scroll-lock'
      )
    }
  }, [])

  /* Блокируем скролл без overflow:hidden — иначе пропадает скроллбар и дёргается layout */
  useLayoutEffect(() => {
    if (introDone) return undefined
    return lockPageScroll()
  }, [introDone])

  useLayoutEffect(() => {
    if (!heroReady || introStarted.current) return undefined
    introStarted.current = true

    const header = headerRef.current
    const hero = heroWrapRef.current
    const rest = restRef.current
    if (!header || !hero) return undefined

    const { gsap, ScrollTrigger } = getGsap()
    document.documentElement.classList.remove('site-booting')
    document.documentElement.classList.add('site-intro')

    const finish = () => {
      document.documentElement.classList.remove('site-intro')
      gsap.set([header, hero, rest].filter(Boolean), {
        clearProps: 'opacity,transform',
      })
      setIntroDone(true)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    if (prefersReducedMotion()) {
      finish()
      return undefined
    }

    gsap.set(header, { opacity: 0, y: 28 })
    gsap.set(hero, { opacity: 0, y: 28 })
    if (rest) gsap.set(rest, { opacity: 0 })

    const tl = gsap.timeline({ onComplete: finish })
    tl.to([header, hero], {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: 'power3.out',
      stagger: 0.08,
    })
    if (rest) {
      tl.to(
        rest,
        {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        },
        '-=0.45'
      )
    }

    return () => {
      tl.kill()
    }
  }, [heroReady])

  useEffect(() => {
    if (!introDone) return undefined

    if (location.hash) {
      const id = location.hash.slice(1)
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      return () => window.clearTimeout(timer)
    }

    return undefined
  }, [introDone, location.pathname, location.hash])

  return (
    <>
      <Header ref={headerRef} />
      <main>
        <div ref={heroWrapRef}>
          <Hero onReady={onHeroReady} />
        </div>
        <div className="home-rest" ref={restRef}>
          <About />
          <Works />
          <BridalBouquet />
          <Portfolio />
          <LookDate />
          <Footer />
        </div>
      </main>
    </>
  )
}

export default HomePage
