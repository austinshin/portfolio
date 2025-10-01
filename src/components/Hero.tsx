import { motion } from 'framer-motion'
import { ArrowDown, Github, Twitter, Instagram, BookOpen, Youtube, Mail, Code, Trophy, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              FROM ESPORTS
              <br />
              TO <span className="highlight">SOFTWARE</span>
            </motion.h1>
            
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Formerj professional League of Legends player turned
              Software Engineer. I love to learn, travel, read, write. I am always excited to build cool stuff.
              I want to experience everything the world has to offer.
            </motion.p>

            <motion.div
              className="hero-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
            </motion.div>

            <motion.button
              className="cta-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/portfolio'}
            >
              VIEW MY WORK
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-images">
              <motion.div
                className="hero-image-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -10, boxShadow: '0 15px 40px rgba(255, 68, 68, 0.4)' }}
              >
                <div className="image-wrapper">
                  <img src="/icons/headshot.jpg" alt="Austin and girlfriend" />
                </div>
                <p className="image-caption">Me and Megan</p>
              </motion.div>

              <motion.div
                className="hero-image-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ y: -10, boxShadow: '0 15px 40px rgba(255, 68, 68, 0.4)' }}
              >
                <div className="image-wrapper">
                  <img src="/icons/mew.jpg" alt="Mew the cat" />
                </div>
                <p className="image-caption">Mew</p>
              </motion.div>

              <motion.div
                className="hero-image-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                whileHover={{ y: -10, boxShadow: '0 15px 40px rgba(255, 68, 68, 0.4)' }}
              >
                <div className="image-wrapper">
                  <img src="/icons/zuli.png" alt="Zuli" />
                </div>
                <p className="image-caption">Zuli</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={scrollToContent}
        >
          <ArrowDown className="bounce" size={32} />
        </motion.div>

        <motion.div
          className="hero-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <div className="social-links">
            <motion.a
              href="https://github.com/austinshin"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="https://twitter.com/link115_"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter size={24} />
            </motion.a>
            <motion.a
              href="https://instagram.com/link115"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram size={24} />
            </motion.a>
            <motion.a
              href="https://substack.com/@link115"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <BookOpen size={24} />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@Link115_"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Youtube size={24} />
            </motion.a>
            <motion.a
              href="mailto:shinaustin@gmail.com"
              className="social-icon-link"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div className="hero-content-section">
        <motion.div
          className="content-preview"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2>What I Do</h2>
          <div className="preview-grid">
            <Link to="/portfolio" className="preview-card">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 10px 40px rgba(255, 68, 68, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                <Code size={40} style={{ color: 'var(--accent)' }} />
                <h3>Software Engineering</h3>
                <p>Built enterprise applications at GoDaddy and Poynt. Full-stack development with React, TypeScript, and Node.js.</p>
              </motion.div>
            </Link>

            <Link to="/gaming" className="preview-card">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 10px 40px rgba(255, 68, 68, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                <Trophy size={40} style={{ color: 'var(--accent)' }} />
                <h3>Professional Esports</h3>
                <p>Competed for CLG and Team Liquid in League of Legends. Top-tier rankings across 9+ competitive titles.</p>
              </motion.div>
            </Link>

            <Link to="/portfolio" className="preview-card">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 10px 40px rgba(255, 68, 68, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                <Briefcase size={40} style={{ color: 'var(--accent)' }} />
                <h3>AI & Automation</h3>
                <p>Building productivity tools, trading automation, and AI-powered applications.</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Hero
