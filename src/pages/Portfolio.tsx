import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import './Pages.css'

const Portfolio = () => {
  const projects = [
    {
      title: 'Game Engine',
      description: 'Custom game engine built with C++ and OpenGL, featuring advanced rendering and physics.',
      tags: ['C++', 'OpenGL', 'Physics'],
      image: 'https://via.placeholder.com/400x300/1a1a1a/ff4444?text=Game+Engine',
    },
    {
      title: 'Multiplayer FPS',
      description: 'Fast-paced competitive shooter with advanced networking and anti-cheat systems.',
      tags: ['Unity', 'C#', 'Networking'],
      image: 'https://via.placeholder.com/400x300/1a1a1a/4444ff?text=Multiplayer+FPS',
    },
    {
      title: 'VR Experience',
      description: 'Immersive virtual reality application showcasing innovative interaction mechanics.',
      tags: ['Unreal', 'VR', 'Blueprint'],
      image: 'https://via.placeholder.com/400x300/1a1a1a/44ff44?text=VR+Experience',
    },
    {
      title: 'Web Platform',
      description: 'Modern web application with real-time features and beautiful UI.',
      tags: ['React', 'TypeScript', 'WebSocket'],
      image: 'https://via.placeholder.com/400x300/1a1a1a/ff44ff?text=Web+Platform',
    },
    {
      title: 'AI System',
      description: 'Machine learning pipeline for game AI with behavior trees and neural networks.',
      tags: ['Python', 'TensorFlow', 'AI'],
      image: 'https://via.placeholder.com/400x300/1a1a1a/ffff44?text=AI+System',
    },
    {
      title: 'Mobile Game',
      description: 'Cross-platform mobile game with engaging gameplay and monetization.',
      tags: ['Unity', 'Mobile', 'Monetization'],
      image: 'https://via.placeholder.com/400x300/1a1a1a/44ffff?text=Mobile+Game',
    },
  ]

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
        <p className="subtitle">A selection of projects I've worked on</p>
      </motion.div>

      <div className="projects-grid">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            className="project-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -10 }}
          >
            <div className="project-image">
              <img src={project.image} alt={project.title} />
              <div className="project-overlay">
                <motion.button
                  className="icon-btn"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink size={20} />
                </motion.button>
                <motion.button
                  className="icon-btn"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github size={20} />
                </motion.button>
              </div>
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
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
