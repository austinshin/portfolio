import { motion } from 'framer-motion'
import { User, Target, Heart, Briefcase } from 'lucide-react'
import './Pages.css'

const About = () => {
  return (
    <div className="page about-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>WHO I AM</h1>
        <div className="header-line"></div>
      </motion.div>

      <div className="content-grid">
        <motion.div
          className="content-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="section-icon">
            <User size={40} />
          </div>
          <h2>Background</h2>
          <p className="intro-text">
            31-year-old Californian Korean American. Studied Computer Science at UC Berkeley before pursuing professional esports. After competing at the highest level in League of Legends with Counter Logic Gaming and Team Liquid, I returned to software engineering to build innovative products and contribute to the tech industry.
          </p>
        </motion.div>

        <motion.div
          className="content-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="section-icon">
            <Target size={40} />
          </div>
          <h2>Mission</h2>
          <p>
            My current goal is to enter the game development industry and build innovative cool products.
            I want to living a balanced and fulfilling life, while aiming to be the absolute best at whatever I pursue.
            I'm very competitive and driven. I love sharing ideas and teaching others and just in general, being a good friend.
          </p>
        </motion.div>

        <motion.div
          className="content-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="section-icon">
            <Heart size={40} />
          </div>
          <h2>Passion</h2>
          <p>
            Competitive gaming shaped who I am—it taught me strategic thinking, rapid
            decision-making, and how to perform under pressure. Today, I channel that same
            intensity into software engineering, building tools and systems to make my life and the others around me a bit easier.
            I'm a big advocate on health and wellness, constantly self-reflecting on how I can make my life 1% better everyday. 
            I strongly believe that I can accomplish anything I put my mind to.
          </p>
        </motion.div>

        <motion.div
          className="content-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="section-icon">
            <Briefcase size={40} />
          </div>
          <h2>Expertise</h2>
          <p>
            Senior Software Engineer with experience at GoDaddy and Poynt startup.
            Full-stack development specializing in React, TypeScript, Node.js. 
            Recent focus on trading automation, scripting, and AI tools. Strong foundation
            in system architecture, performance optimization, and building scalable applications.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default About
