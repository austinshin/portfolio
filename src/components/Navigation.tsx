import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import './Navigation.css'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Account for fixed nav height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  const navItems = [
    { id: 'resume', label: 'RESUME' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'gaming', label: 'GAMING' },
    { id: 'socials', label: 'SOCIALS' },
    { id: 'contact', label: 'CONTACT', isEmail: true, url: 'mailto:shinaustin@gmail.com' },
  ]

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
              {item.isEmail ? (
                <a
                  href={item.url}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <div
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
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
