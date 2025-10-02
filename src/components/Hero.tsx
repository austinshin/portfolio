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
            Professional League of Legends player turned Software Engineer. I love to learn, travel, read, write, and play games. I want to create and leave a legacy. I want to experience everything the world has to offer while having fun!
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
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '800' }}>WHO I AM</h2>
        <div className="about-grid">
          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Background</h3>
            <p>
              31-year-old Californian Korean American. Studied Computer Science at UC Berkeley before pursuing professional esports. After competing at the highest level in League of Legends with Counter Logic Gaming and Team Liquid, I returned to software engineering to build innovative products and contribute to the tech industry.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Mission</h3>
            <p>
              My current goal is to enter the game development industry and build innovative cool products.
              I want to living a balanced and fulfilling life, while aiming to be the absolute best at whatever I pursue.
              I'm very competitive and driven. I love sharing ideas and teaching others and just in general, being a good friend.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Passion</h3>
            <p>
              Competitive gaming shaped who I am—it taught me strategic thinking, rapid
              decision-making, and how to perform under pressure. Today, I channel that same
              intensity into software engineering, building tools and systems to make my life and the others around me a bit easier.
              I'm a big advocate on health and wellness, constantly self-reflecting on how I can make my life 1% better everyday. 
              I strongly believe that I can accomplish anything I put my mind to.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>Expertise</h3>
            <p>
              Senior Software Engineer with experience at GoDaddy and Poynt startup.
              Full-stack development specializing in React, TypeScript, Node.js. 
              Recent focus on trading automation, scripting, and AI tools. Strong foundation
              in system architecture, performance optimization, and building scalable applications.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        className="timeline-in-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: '800' }}>My Journey</h2>
        <div className="visual-timeline">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              className={`timeline-node ${item.type}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + i * 0.1 }}
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

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        onClick={() => {
          const resumeSection = document.getElementById('resume')
          if (resumeSection) {
            const offsetTop = resumeSection.offsetTop - 80
            window.scrollTo({ top: offsetTop, behavior: 'smooth' })
          }
        }}
      >
        <ArrowDown className="bounce" size={32} />
      </motion.div>
    </div>
  )
}

export default Hero
