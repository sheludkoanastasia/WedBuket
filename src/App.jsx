import { useLayoutEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SitemapPage from './pages/SitemapPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'

function ClearBootOnInnerPages() {
  const location = useLocation()

  useLayoutEffect(() => {
    if (location.pathname === '/') return
    document.documentElement.classList.remove(
      'site-booting',
      'site-intro',
      'site-scroll-lock'
    )
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ClearBootOnInnerPages />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
