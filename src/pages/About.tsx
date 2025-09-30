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
            31-year-old Californian Korean American. 
            Started at UC Berkeley studying Computer Science, then dropped out to chase my dreams in
            professional esports. After years of competing at the highest level in League of
            Legends, I returned to software engineering to experience the corporate side of the world.
            I took a break to focus on my mental and physical health and to travel the world. 
            I'm now looking to get back into work and build innovative cool products.
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
            My goal is to learn and stay knowledgeable about the world and its advances in technology. 
            I want to living a balanced and fulfilling life, while aiming to be the best at whatever I pursue.
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

      <motion.div
        className="skills-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          {['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'PostgreSQL', 'Vercel', 'CursorAI', 'AWS', 'Docker', 'Git', 'CI/CD', 'REST APIs', 'Jira', 'Trello', 'Figma', 'Obsidian', 'Notion'].map((skill, i) => (
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
