import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award, Download } from 'lucide-react'
import './Pages.css'

const Resume = () => {
  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading development of cutting-edge web applications and mentoring junior developers.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup Inc',
      period: '2020 - 2022',
      description: 'Built scalable backend systems and modern frontend interfaces.',
    },
    {
      title: 'Junior Developer',
      company: 'Digital Agency',
      period: '2018 - 2020',
      description: 'Developed responsive websites and collaborated with design teams.',
    },
  ]

  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University Name',
      period: '2014 - 2018',
      description: 'Focus on software engineering and game development.',
    },
  ]

  const achievements = [
    'Led team that shipped 5+ major features',
    'Reduced load time by 60% through optimization',
    'Spoke at 3 tech conferences',
    'Published 10+ open source projects',
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
        <motion.button
          className="download-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={20} />
          Download PDF
        </motion.button>
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
                <h3>{exp.title}</h3>
                <h4>{exp.company}</h4>
                <span className="period">{exp.period}</span>
                <p>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="resume-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="section-title">
            <GraduationCap size={30} />
            <h2>Education</h2>
          </div>
          {education.map((edu, i) => (
            <motion.div
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>{edu.degree}</h3>
                <h4>{edu.school}</h4>
                <span className="period">{edu.period}</span>
                <p>{edu.description}</p>
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
          <div className="section-title">
            <Award size={30} />
            <h2>Key Achievements</h2>
          </div>
          <div className="achievements-grid">
            {achievements.map((achievement, i) => (
              <motion.div
                key={i}
                className="achievement-item"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="achievement-icon">✓</div>
                <p>{achievement}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Resume
