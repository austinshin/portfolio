import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award, Download, ExternalLink } from 'lucide-react'
import './Pages.css'

const Resume = () => {
  const experiences = [
    {
      title: 'Self Development & Trading',
      company: 'Independent',
      period: 'Nov 2023 - Present',
      description: 'Developed trading automation scripts and tools. Building AI-powered applications. Focus on calisthenics, physical and mental health optimization.',
    },
    {
      title: 'Senior Software Engineer',
      company: 'GoDaddy',
      period: 'Jan 2021 - May 2023',
      description: 'Led development of enterprise web applications. Architected scalable solutions serving millions of users. Mentored junior engineers and drove technical initiatives.',
    },
    {
      title: 'Software Engineer',
      company: 'Poynt (Startup)',
      period: 'May 2018 - Jan 2021',
      description: 'Full-stack development for payment processing platform. Built features from concept to production. Worked in fast-paced startup environment.',
    },
    {
      title: 'Professional Esports Player (Mid)',
      company: 'Team Liquid',
      period: 'Jun 2016 - Aug 2017',
      description: 'Competed in League of Legends Championship Series (LCS). Represented Team Liquid at the highest level of competitive League of Legends.',
    },
    {
      title: 'Professional Esports Player (Mid)',
      company: 'Counter Logic Gaming (CLG)',
      period: 'Jan 2013 - May 2015',
      description: 'Competed professionally in League of Legends Championship Series. One of the pioneering NA LCS mid laners.',
    },
  ]

  const education = [
    {
      degree: 'Software Engineering Immersive',
      school: 'HackReactor Coding Bootcamp',
      period: 'Dec 2017 - Mar 2018',
      description: 'Intensive 3-month full-stack software engineering program. Advanced JavaScript, React, Node.js, and computer science fundamentals.',
    },
    {
      degree: 'Computer Science (Readmission)',
      school: 'UC Berkeley',
      period: 'Sep 2015 - May 2016',
      description: 'Returned to complete CS degree after professional esports career.',
    },
    {
      degree: 'Computer Science Studies',
      school: 'Berkeley City College',
      period: 'Jun 2015 - Aug 2015',
      description: 'Continued CS education during transition period.',
    },
    {
      degree: 'Computer Science (Initial Studies)',
      school: 'UC Berkeley',
      period: 'Sep 2011 - Dec 2012',
      description: 'Started Computer Science degree before pursuing professional esports.',
    },
  ]

  const achievements = [
    'Competed at the highest level of League of Legends (LCS) for CLG and Team Liquid',
    'Transitioned from professional esports to Senior Software Engineer',
    'Built enterprise applications serving millions of users at GoDaddy',
    'Developed payment processing features for Poynt startup',
    'Created trading automation tools and AI-powered applications',
    'Pioneered as one of the first generation NA LCS professional players',
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
        <div className="resume-actions">
          <motion.a
            href="https://docs.google.com/document/d/1ymPbw5Vk9lI6TSC7xU1gq7BXzcX22zJiqdWdqtFteeY/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink size={20} />
            View Full Resume
          </motion.a>
          <motion.a
            href="/resume.pdf"
            download="Austin_Link_Shin_Resume.pdf"
            className="download-btn secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={20} />
            Download PDF
          </motion.a>
        </div>
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
