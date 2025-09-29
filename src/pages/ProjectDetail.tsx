import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import './Pages.css'

// Import project data (we'll centralize this)
import { allProjects } from '../data/projects'

const ProjectDetail = () => {
  const { projectId } = useParams()
  const project = allProjects.find(p => p.id === projectId)

  if (!project) {
    return (
      <div className="page">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="project-not-found"
        >
          <h1>Project Not Found</h1>
          <Link to="/portfolio" className="back-link">
            <ArrowLeft size={20} />
            Back to Portfolio
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page project-detail-page">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/portfolio" className="back-link">
          <ArrowLeft size={20} />
          Back to Portfolio
        </Link>

        <div className="project-detail-header">
          <div className="project-detail-title">
            <h1>{project.title}</h1>
            {project.company && (
              <h2 className="project-company">{project.company}</h2>
            )}
            <div className="project-meta">
              <span className="project-type-badge">{project.type}</span>
              {project.period && (
                <span className="project-period">{project.period}</span>
              )}
            </div>
          </div>

          <div className="project-detail-actions">
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={20} />
                Live Demo
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} />
                View Code
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="project-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="project-detail-image">
          <img src={project.image} alt={project.title} />
        </div>

        <div className="project-detail-info">
          <h3>Overview</h3>
          <ul className="project-detail-list">
            {project.description.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="project-detail-tech">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              {project.tags.map((tag, idx) => (
                <motion.span
                  key={tag}
                  className="tag"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>

          {project.detailedInfo && (
            <div className="project-additional-info">
              <h3>Additional Details</h3>
              <div className="additional-content">
                {project.detailedInfo.howItWorks && (
                  <div className="info-section">
                    <h4>How It Works</h4>
                    <div className="how-it-works-content">
                      {project.detailedInfo.howItWorks.map((step, idx) => (
                        <div key={idx} className="workflow-step">
                          <div className="step-number">{idx + 1}</div>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.detailedInfo.challenges && (
                  <div className="info-section">
                    <h4>Challenges & Solutions</h4>
                    <ul>
                      {project.detailedInfo.challenges.map((challenge, idx) => (
                        <li key={idx}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.detailedInfo.impact && (
                  <div className="info-section">
                    <h4>Impact & Results</h4>
                    <ul>
                      {project.detailedInfo.impact.map((impact, idx) => (
                        <li key={idx}>{impact}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.detailedInfo.learnings && (
                  <div className="info-section">
                    <h4>Key Learnings</h4>
                    <ul>
                      {project.detailedInfo.learnings.map((learning, idx) => (
                        <li key={idx}>{learning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="project-gallery">
              <h3>Gallery</h3>
              <div className="gallery-grid">
                {project.gallery.map((image, idx) => (
                  <motion.div
                    key={idx}
                    className="gallery-item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={image.url} alt={image.caption || `Screenshot ${idx + 1}`} />
                    {image.caption && <p className="gallery-caption">{image.caption}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectDetail
