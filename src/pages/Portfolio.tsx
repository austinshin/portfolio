import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Pages.css'
import { professionalProjects, personalProjects } from '../data/projects'

const Portfolio = () => {
  const projects = [...professionalProjects, ...personalProjects]

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

      <div className="projects-grid">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
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
                {project.description.slice(0, 3).map((item, idx) => (
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
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Portfolio