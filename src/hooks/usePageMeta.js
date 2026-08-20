import { useEffect } from 'react'

const DEFAULT_TITLE = 'WedBuket — флористика на свадьбу'
const DEFAULT_DESCRIPTION =
  'Портфолио-проект свадебной флористики: букет невесты, оформление церемонии и банкета в одном стиле.'

/**
 * Устанавливает document.title и meta description на время жизни страницы.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDescription = meta?.getAttribute('content') ?? ''

    document.title = title || DEFAULT_TITLE
    if (meta) {
      meta.setAttribute('content', description || DEFAULT_DESCRIPTION)
    }

    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDescription)
    }
  }, [title, description])
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION }
