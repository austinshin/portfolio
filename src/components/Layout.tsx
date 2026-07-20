import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { Github, Twitter, Linkedin, Moon, Sun } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/resume', label: 'Resume' },
  { to: '/gaming', label: 'Gaming Achievements' },
  { to: '/read', label: 'Read' },
  { to: '/reading', label: 'Currently Reading' },
  { to: '/food', label: 'Food' },
  { to: '/shows', label: 'Shows & Movies' },
  // AI Tools tab hidden for now — pages still reachable at /ai-tools
]

const SOCIAL_LINKS = [
  { href: 'https://github.com/austinshin', label: 'GitHub', icon: Github },
  { href: 'https://twitter.com/link115_', label: 'Twitter', icon: Twitter },
  { href: 'https://www.linkedin.com/in/austin-s-5704693a4/', label: 'LinkedIn', icon: Linkedin },
]

const PAGE_TITLES: Record<string, string> = {
  '/': 'Austin Shin',
  '/portfolio': 'Portfolio',
  '/resume': 'Resume',
  '/gaming': 'Gaming Achievements',
  '/blog': 'Blog',
  '/read': 'Read',
  '/reading': 'Currently Reading',
  '/food': 'Food',
  '/shows': 'Shows & Movies',
  '/ai-tools': 'AI Tools',
  '/yt-lecture-summary': 'YouTube Lecture Summary',
  '/docs-summary': 'Repo Docs Summary',
  '/login': 'Login',
  '/admin': 'Admin',
}

const Layout = () => {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  )

  useEffect(() => {
    const title = PAGE_TITLES[pathname]
    document.title = title && title !== 'Austin Shin' ? `${title} — Austin Shin` : 'Austin Shin'
  }, [pathname])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // private browsing — theme just won't persist
    }
  }

  return (
    <div className="site">
      <aside className="sidebar">
        <div className="sidebar-inner">
          <img
            className="sidebar-avatar"
            src="https://i.imgur.com/Gbv96Hk.jpeg"
            alt="Austin Shin"
          />
          <Link to="/" className="sidebar-name">
            Austin Shin
          </Link>
          <nav>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-socials">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                <link.icon size={20} />
              </a>
            ))}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
