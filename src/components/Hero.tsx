import { motion } from 'framer-motion'
import { ArrowDown, Code, Palette, Zap } from 'lucide-react'
import './Hero.css'

const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
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
            BUILDING THE
            <br />
            <span className="highlight">FUTURE</span>
          </motion.h1>
          
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            I'm a creative developer passionate about crafting exceptional
            digital experiences. From elegant interfaces to robust systems,
            I bring ideas to life with precision and innovation.
          </motion.p>

          <motion.div
            className="hero-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="feature">
              <Code size={24} />
              <span>Clean Code</span>
            </div>
            <div className="feature">
              <Palette size={24} />
              <span>Beautiful Design</span>
            </div>
            <div className="feature">
              <Zap size={24} />
              <span>High Performance</span>
            </div>
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
          <div className="visual-grid">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="grid-item"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + i * 0.05,
                }}
                whileHover={{ scale: 1.1, backgroundColor: '#ff4444' }}
              />
            ))}
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
    </div>
  )
}

export default Hero
