import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import LookDate from './components/LookDate'
import BridalBouquet from './components/BridalBouquet'
import Works from './components/Works'

function App() {
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

export default App
