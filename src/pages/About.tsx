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
          <p>
            I'm a passionate developer and designer with a love for creating
            exceptional digital experiences. My journey in tech began with a
            curiosity for how things work and evolved into a career dedicated
            to crafting innovative solutions.
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
            To push the boundaries of what's possible in interactive
            entertainment and create experiences that inspire and connect
            people around the world. I believe in the power of technology
            to tell stories and bring communities together.
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
            Gaming, design, and cutting-edge technology drive everything I do.
            I'm fascinated by immersive worlds, innovative gameplay mechanics,
            and the intersection of art and technology in creating memorable
            experiences.
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
            Full-stack development, UI/UX design, game development, and
            system architecture. I specialize in React, TypeScript, C++,
            and modern web technologies, with a focus on performance and
            user experience.
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
          {['React', 'TypeScript', 'Node.js', 'C++', 'Python', 'Unity', 'Unreal Engine', 'WebGL', 'Three.js', 'PostgreSQL', 'AWS', 'Docker'].map((skill, i) => (
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
