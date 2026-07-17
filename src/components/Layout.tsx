import { NavLink, Link, Outlet } from 'react-router-dom'
import { Github, Twitter, Linkedin } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'About' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/resume', label: 'Resume' },
  { to: '/blog', label: 'Blog' },
  { to: '/notes', label: 'Notes' },
  { to: '/read', label: 'Read' },
  { to: '/reading', label: 'Currently Reading' },
  { to: '/food', label: 'Food' },
  { to: '/ai-tools', label: 'AI Tools' },
]

const SOCIAL_LINKS = [
  { href: 'https://github.com/austinshin', label: 'GitHub', icon: Github },
  { href: 'https://twitter.com/link115_', label: 'Twitter', icon: Twitter },
  { href: 'https://www.linkedin.com/in/austin-s-5704693a4/', label: 'LinkedIn', icon: Linkedin },
]

const Layout = () => {
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
