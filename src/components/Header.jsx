import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 716) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <header className="header">
      <nav
        className="nav container container--landing"
        aria-label="Основная навигация"
      >
        <div className="nav-start">
          <button
            type="button"
            className={`nav-burger${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            <img
              className="nav-burger-icon nav-burger-icon--menu"
              src="/images/menu-burger.svg"
              alt=""
              aria-hidden="true"
            />
            <img
              className="nav-burger-icon nav-burger-icon--close"
              src="/images/menu-close.svg"
              alt=""
              aria-hidden="true"
            />
          </button>

          <ul
            id="nav-menu"
            className={`nav-list${open ? ' is-open' : ''}`}
          >
            <li className="nav-item">
              <Link
                to="/#about"
                className="nav-link"
                onClick={closeMenu}
              >
                О нас
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/#works"
                className="nav-link"
                onClick={closeMenu}
              >
                Как мы работаем
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/#bridal-bouquet"
                className="nav-link"
                onClick={closeMenu}
              >
                Букет невесты 360°
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/#portfolio"
                className="nav-link"
                onClick={closeMenu}
              >
                Фото с событий
              </Link>
            </li>
          </ul>
        </div>

        <Link to="/#look-date" className="nav-look-date">
          Просмотреть свободные&nbsp;даты
        </Link>
      </nav>
    </header>
  )
}

export default Header
