import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import './Hero.css'

const Hero = () => {
  const timeline = [
    { year: '2011', type: 'education', title: 'Started UC Berkeley', subtitle: 'Computer Science' },
    { year: '2013', type: 'esports', title: 'Counter Logic Gaming', subtitle: 'Professional League of Legends' },
    { year: '2015', type: 'education', title: 'Returned to UC Berkeley', subtitle: 'Computer Science' },
    { year: '2016', type: 'esports', title: 'Team Liquid', subtitle: 'Professional League of Legends' },
    { year: '2018', type: 'education', title: 'HackReactor Bootcamp', subtitle: 'Software Engineering' },
    { year: '2018', type: 'work', title: 'Poynt', subtitle: 'Software Engineer' },
    { year: '2021', type: 'work', title: 'GoDaddy', subtitle: 'Senior Software Engineer' },
    { year: '2023', type: 'work', title: 'Self Development', subtitle: 'Trading & AI Applications' },
    { year: '2025', type: 'future', title: 'Present Day', subtitle: 'Building & Learning' },
  ]

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
            <span className="lol-text">PRO LEAGUE OF LEGENDS PLAYER</span> TO <span className="highlight">SOFTWARE ENGINEER</span>
          </motion.h1>
          
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
          </motion.p>

          <motion.button
            className="cta-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const portfolioSection = document.getElementById('portfolio')
              if (portfolioSection) {
                const offsetTop = portfolioSection.offsetTop - 80
                window.scrollTo({ top: offsetTop, behavior: 'smooth' })
              }
            }}
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

      {/* Who I Am Section */}
      <motion.section
        className="about-in-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: '800' }}>WHO I AM</h2>
        <div className="about-grid">
          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Background</h3>
            <ul>
              <li>Californian Korean American</li>
              <li>Studied Computer Science at UC Berkeley</li>
              <li>Former Professional League of Legends player (Counter Logic Gaming 2011-2015, Team Liquid 2017)</li>
              <li>Returned to software engineering to build innovative products</li>
            </ul>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Mission</h3>
            <ul>
              <li>Enter the field of game development industry</li>
              <li>Live a balanced and fulfilling life</li>
              <li>Be the absolute best at anything I pursue</li>
              <li>Share ideas and teach others</li>
            </ul>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Passion</h3>
            <ul>
              <li>Gaming and competing</li>
              <li>Building tools to make life easier for myself and others</li>
              <li>Advocating for health and wellness</li>
              <li>Improving at life by 1% every day</li>
            </ul>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Expertise</h3>
            <ul>
              <li>Senior Software Engineer, Competitive Gamer, Day Trader, Entrepreneur</li>
              <li>Full-stack: React, TypeScript, Node.js</li>
              <li>Recent focus: Trading automation, scripting, AI tools</li>
              <li>Building scalable applications</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        onClick={() => {
          const timelineSection = document.getElementById('timeline')
          if (timelineSection) {
            const offsetTop = timelineSection.offsetTop - 80
            window.scrollTo({ top: offsetTop, behavior: 'smooth' })
          }
        }}
      >
        <ArrowDown className="bounce" size={32} />
      </motion.div>

      {/* Timeline Section */}
      <motion.section
        id="timeline"
        className="timeline-in-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: '800' }}>My Journey</h2>
        
        {/* Timeline Legend */}
        <div className="timeline-legend">
          <div className="legend-item">
            <div className="legend-dot education"></div>
            <span>School</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot esports"></div>
            <span>Professional Gaming</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot work"></div>
            <span>Professional Experience</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot future"></div>
            <span>Other</span>
          </div>
        </div>

        <div className="visual-timeline">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              className={`timeline-node ${item.type}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2 + i * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-node-content">
                <div className="timeline-dot"></div>
                <div className="timeline-info">
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Hero
