import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import About from '../components/About'
import Portfolio from '../components/Portfolio'
import LookDate from '../components/LookDate'
import BridalBouquet from '../components/BridalBouquet'
import Works from '../components/Works'

function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo(0, 0)
    return undefined
  }, [location.pathname, location.hash])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Works />
        <BridalBouquet />
        <Portfolio />
        <LookDate />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
