import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import './Navigation.css'

interface NavItem {
  id: string
  label: string
  kind: 'scroll' | 'route' | 'email'
  url?: string
}

const navItems: NavItem[] = [
  { id: 'resume', label: 'RESUME', kind: 'scroll' },
  { id: 'portfolio', label: 'PORTFOLIO', kind: 'scroll' },
  { id: 'gaming', label: 'GAMING', kind: 'scroll' },
  { id: 'socials', label: 'SOCIALS', kind: 'scroll' },
  { id: 'uses', label: 'USES', kind: 'route', url: '/uses' },
  { id: 'contact', label: 'CONTACT', kind: 'email', url: 'mailto:shinaustin@gmail.com' },
]

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()
  const onHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Detect which section is in view
      const sections = ['home', 'resume', 'portfolio', 'gaming', 'socials']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollWithinPage = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Account for fixed nav height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  const scrollToSection = (sectionId: string) => {
    if (onHome) {
      scrollWithinPage(sectionId)
    } else {
      // Coming from a routed page (e.g. /uses): go home first, then scroll once it renders.
      navigate('/')
      setTimeout(() => scrollWithinPage(sectionId), 80)
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      className={`navigation ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="logo" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            AUSTIN "LINK" SHIN
          </motion.span>
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.kind === 'email' ? (
                <a
                  href={item.url}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ) : item.kind === 'route' ? (
                <Link
                  to={item.url ?? '/'}
                  className={`nav-link ${location.pathname === item.url ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  className={`nav-link ${onHome && activeSection === item.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.nav>
  )
}

export default Navigation
