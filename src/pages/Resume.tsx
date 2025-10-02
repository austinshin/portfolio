import { motion } from 'framer-motion'
import { Briefcase, ExternalLink } from 'lucide-react'
import './Pages.css'

const Resume = () => {
  const experiences = [
    {
      title: 'Day trading & AI Learning',
      company: 'Independent',
      period: 'Nov 2023 - Present',
      description: [
        'Developed trading automation scripts and tools',
        'Building AI-powered applications for personal efficiency',
        'Improved day to day systems and productivity'
      ],
    },
    {
      title: 'Senior Software Engineer',
      company: 'GoDaddy',
      period: 'Jan 2021 - May 2023',
      description: [
        'Led development of enterprise web applications',
        'Architected scalable solutions serving millions of merchants and customers',
        'Led sprints on In person selling team and helped maintain apps on Payments Hub team'
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Poynt (Startup)',
      period: 'May 2018 - Jan 2021',
      description: [
        'Full-stack development on Merchant team with 3 others',
        'Built features from concept to production working with design, android, and product',
        'Worked in fast-paced startup environment'
      ],
    },
    {
      title: 'Professional Esports Player (Mid Laner)',
      company: 'Counter Logic Gaming (CLG) & Team Liquid (TL)',
      period: 'Jan 2013 - May 2015',
      description: [
        'Shotcaller and Drafter for professional League of Legends teams',
        'Competed in League of Legends Championship Series (LCS)',
        'One of the pioneering NA LCS mid laners'
      ],
    },
  ]

  return (
    <div className="page resume-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>RESUME</h1>
        <div className="header-line"></div>
        <motion.a
          href="https://docs.google.com/document/d/1ymPbw5Vk9lI6TSC7xU1gq7BXzcX22zJiqdWdqtFteeY/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ExternalLink size={20} />
          View Full Resume
        </motion.a>
      </motion.div>

      <div className="resume-content">
        <motion.section
          className="resume-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="section-title">
            <Briefcase size={30} />
            <h2>Experience</h2>
          </div>
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title-section">
                    <h3>{exp.title}</h3>
                    <h4>{exp.company}</h4>
                  </div>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <ul className="timeline-bullets">
                  {exp.description.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="resume-section full-width"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Technical Skills</h2>
          <div className="skills-grid">
            {['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'PostgreSQL', 'Vercel', 'CursorAI', 'AWS', 'Docker', 'Git', 'CI/CD', 'REST', 'Jira', 'Trello', 'Figma', 'Obsidian', 'Notion'].map((skill, i) => (
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
        </motion.section>
      </div>
    </div>
  )
}

export default Resume
