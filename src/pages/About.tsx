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

      <motion.div
        className="about-images"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="profile-image-container"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/icons/headshot.jpg" alt="Austin 'Link' Shin" className="profile-image" />
        </motion.div>
        <motion.div
          className="companion-image-container"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/icons/mew.jpg" alt="Mew" className="companion-image" />
        </motion.div>
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
          <p>
            31-year-old Korean American with an unconventional path to software engineering.
            Started at UC Berkeley studying Computer Science, then took a leap into
            professional esports. After years competing at the highest level in League of
            Legends, I returned to my roots in software engineering through HackReactor,
            combining my analytical gaming mindset with technical expertise.
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
            To bridge the gap between gaming and software engineering. Having experienced
            both worlds at the highest level—competing in professional esports and building
            enterprise software—I understand what makes great interactive experiences.
            I'm driven to create technology that empowers gamers and developers alike.
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
            intensity into software engineering, building tools and systems with the precision
            of a professional athlete. I'm also dedicated to continuous improvement through
            calisthenics and mental health practices.
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
            Full-stack development specializing in React, TypeScript, Node.js, and Python.
            Recent focus on trading automation, scripting, and AI tools. Strong foundation
            in system architecture, performance optimization, and building scalable applications.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="skills-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          {['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'CI/CD', 'REST APIs'].map((skill, i) => (
            <motion.div
              key={skill}
              className="skill-tag"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              whileHover={{ scale: 1.1, backgroundColor: '#ff4444' }}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default About
