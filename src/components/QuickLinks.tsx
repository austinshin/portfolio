import { motion } from 'framer-motion'
import { FileText, Mail, Users } from 'lucide-react'
import { useState } from 'react'
import './QuickLinks.css'

const QuickLinks = () => {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  return (
    <div className={`quicklinks-sidebar ${isOpen ? 'open' : ''}`}>
      <button 
        className="quicklinks-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Quick Links"
      >
        {isOpen ? '×' : 'Quick Links'}
      </button>
      
      <motion.div 
        className="quicklinks-content"
        initial={false}
        animate={{ x: isOpen ? 0 : 300 }}
        transition={{ duration: 0.3 }}
      >
        <h3>Quick Links</h3>
        
        <a
          href="https://docs.google.com/document/d/1ymPbw5Vk9lI6TSC7xU1gq7BXzcX22zJiqdWdqtFteeY/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="quicklink-item"
        >
          <FileText size={20} />
          <span>Formal Resume</span>
        </a>

        <a
          href="mailto:shinaustin@gmail.com"
          className="quicklink-item"
        >
          <Mail size={20} />
          <span>Contact</span>
        </a>

        <div
          className="quicklink-item"
          onClick={() => scrollToSection('socials')}
        >
          <Users size={20} />
          <span>Socials</span>
        </div>
      </motion.div>
    </div>
  )
}

export default QuickLinks

