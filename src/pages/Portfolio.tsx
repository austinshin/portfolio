import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import './Pages.css'

const Portfolio = () => {
  const professionalProjects = [
    {
      title: 'GoDaddy Merchant HQ Migration',
      company: 'GoDaddy',
      description: 'Led massive refactor after GoDaddy acquired Poynt. Migrated entire codebase from Ember to React/Redux/TypeScript. Updated routing system to React Router and integrated with GoDaddy\'s design system.',
      tags: ['React', 'Redux', 'TypeScript', 'React Router', 'Migration'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      type: 'professional',
    },
    {
      title: 'Poynt Collect Pay Links',
      company: 'Poynt',
      description: 'Led implementation of shareable payment links for social media commerce. Designed security process using credit card tokenization to protect customer data. Successfully generated significant revenue.',
      tags: ['React', 'Node.js', 'Security', 'Tokenization', 'Payment Processing'],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      type: 'professional',
    },
    {
      title: 'Poynt Merchant HQ Dashboard',
      company: 'Poynt',
      description: 'Built comprehensive merchant dashboard for viewing and aggregating daily transaction data. Collaborated with design team to create intuitive interface for generating reports and managing customer data.',
      tags: ['Ember', 'React', 'Data Visualization', 'Dashboard', 'UI/UX'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      type: 'professional',
    },
    {
      title: 'Poynt API Service',
      company: 'Poynt',
      description: 'Created secure API endpoints handling transaction data between Android devices and banking systems. Implemented monitoring and streaming infrastructure for error tracking and analytics.',
      tags: ['Node.js', 'API', 'Redis', 'Kibana', 'Banking Integration'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      type: 'professional',
    },
    {
      title: 'Catalog App',
      company: 'Poynt',
      description: 'Designed and built full-stack catalog webview app for merchants to create product menus. Created API endpoints for data processing and management.',
      tags: ['Full Stack', 'React', 'Node.js', 'API', 'E-commerce'],
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
      type: 'professional',
    },
    {
      title: 'Hermes Backend Service',
      company: 'GoDaddy',
      description: 'Enhanced internal API service for settlement reporting and data automation. Implemented error monitoring with Slack integration for real-time team alerts.',
      tags: ['Node.js', 'API', 'Automation', 'Monitoring', 'Slack Integration'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      type: 'professional',
    },
  ]

  const personalProjects = [
    {
      title: 'ProductivityHub',
      description: 'AI-powered productivity platform built with Cursor and Claude. Features Google Auth, dashboard widgets, journal, todos, calendar integration, nutrition tracking, workout logging, photo storage, and AI voice agents using NLP.',
      tags: ['React', 'TypeScript', 'AI', 'Supabase', 'Redis', 'Vercel', 'Android'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      type: 'personal',
    },
    {
      title: 'Daytrading Journal',
      company: 'Personal',
      description: 'Custom trading journal with automated screenshot capture, AI-generated reports, and news aggregation. Web-scrapes financial data from multiple sources including Twitter, Discord, and market trackers.',
      tags: ['Python', 'AI', 'Automation', 'Web Scraping', 'Cron Jobs'],
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      type: 'personal',
    },
    {
      title: 'Portfolio Website',
      description: 'Built this professional portfolio in 1-2 days using Cursor, Claude, and Obsidian. Demonstrates the power of AI-assisted development with React, TypeScript, Framer Motion, Supabase, and Vercel deployment.',
      tags: ['React', 'TypeScript', 'AI-Assisted', 'Framer Motion', 'Supabase', 'Vercel'],
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
      type: 'personal',
    },
    {
      title: 'ChoreBot',
      description: 'Discord bot using Python for household automation. Manages daily chores and sends reminders for a household of 4 friends. Simple but effective automation solution.',
      tags: ['Python', 'Discord Bot', 'Automation', 'Notifications'],
      image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800',
      type: 'personal',
    },
  ]

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
