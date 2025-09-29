import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Code } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Pages.css'
import { professionalProjects, personalProjects } from '../data/projects'

const Portfolio = () => {
  // Separate Poynt and GoDaddy projects
  const poyntProjects = professionalProjects.filter(p => p.company === 'Poynt')
  const godaddyProjects = professionalProjects.filter(p => p.company === 'GoDaddy')

  const renderProjectCard = (project: any, index: number) => (
    <motion.div
      key={project.id}
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <Link to={`/portfolio/${project.id}`} className="project-link">
        <div className="project-image">
          <img src={project.image} alt={project.title} />
          <div className="project-overlay">
            <motion.div
              className="view-details-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight size={24} />
              <span>View Details</span>
            </motion.div>
          </div>
        </div>
      </Link>

      <div className="project-info">
        <Link to={`/portfolio/${project.id}`} className="project-title-link">
          <h3>{project.title}</h3>
        </Link>
        {project.company && (
          <h4 style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem' 
          }}>
            {project.company}
          </h4>
        )}
        <ul className="project-description-list">
          {project.description.slice(0, 3).map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
          {project.description.length > 3 && (
            <li className="read-more">
              <Link to={`/portfolio/${project.id}`}>
                Read more →
              </Link>
            </li>
          )}
        </ul>
        <div className="project-tags">
          {project.tags.map((tag: string) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="page portfolio-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>MY WORK</h1>
        <div className="header-line"></div>
        <p className="subtitle">Professional experience at GoDaddy & Poynt + Personal AI/automation projects</p>
      </motion.div>

      {/* Professional Projects Section */}
      <motion.div
        className="portfolio-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="section-header">
          <Briefcase size={32} style={{ color: 'var(--accent)' }} />
          <h2>Professional Projects</h2>
        </div>

        {/* GoDaddy Subsection */}
        <div className="subsection">
          <h3 className="subsection-title">GoDaddy</h3>
          <p className="subsection-description">Jan 2021 - May 2023 | Senior Software Engineer</p>
          <div className="projects-grid">
            {godaddyProjects.map((project, i) => renderProjectCard(project, i))}
          </div>
        </div>

        {/* Poynt Subsection */}
        <div className="subsection">
          <h3 className="subsection-title">Poynt</h3>
          <p className="subsection-description">May 2018 - Jan 2021 | Software Engineer</p>
          <div className="projects-grid">
            {poyntProjects.map((project, i) => renderProjectCard(project, i))}
          </div>
        </div>
      </motion.div>

      {/* Personal Projects Section */}
      <motion.div
        className="portfolio-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="section-header">
          <Code size={32} style={{ color: 'var(--accent)' }} />
          <h2>Personal Projects</h2>
        </div>
        <p className="section-description">
          Side projects showcasing AI integration, automation, and full-stack development
        </p>
        <div className="projects-grid">
          {personalProjects.map((project, i) => renderProjectCard(project, i))}
        </div>
      </motion.div>
    </div>
  )
}

export default Portfolio