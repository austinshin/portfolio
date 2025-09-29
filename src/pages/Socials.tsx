import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Youtube, Instagram } from 'lucide-react'
import './Pages.css'

const Socials = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github size={40} />,
      url: 'https://github.com/yourusername',
      username: '@yourusername',
      color: '#ffffff',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={40} />,
      url: 'https://linkedin.com/in/yourusername',
      username: 'Your Name',
      color: '#0077b5',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={40} />,
      url: 'https://twitter.com/yourusername',
      username: '@yourusername',
      color: '#1da1f2',
    },
    {
      name: 'Email',
      icon: <Mail size={40} />,
      url: 'mailto:your.email@example.com',
      username: 'your.email@example.com',
      color: '#ea4335',
    },
    {
      name: 'YouTube',
      icon: <Youtube size={40} />,
      url: 'https://youtube.com/@yourusername',
      username: '@yourusername',
      color: '#ff0000',
    },
    {
      name: 'Instagram',
      icon: <Instagram size={40} />,
      url: 'https://instagram.com/yourusername',
      username: '@yourusername',
      color: '#e4405f',
    },
  ]

  return (
    <div className="page socials-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>CONNECT WITH ME</h1>
        <div className="header-line"></div>
        <p className="subtitle">Let's stay in touch</p>
      </motion.div>

      <div className="socials-grid">
        {socialLinks.map((social, i) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ 
              y: -10, 
              boxShadow: `0 10px 40px ${social.color}40`
            }}
          >
            <motion.div
              className="social-icon"
              style={{ color: social.color }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {social.icon}
            </motion.div>
            <h3>{social.name}</h3>
            <p>{social.username}</p>
          </motion.a>
        ))}
      </div>

      <motion.div
        className="social-cta"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2>Let's Build Something Amazing</h2>
        <p>I'm always open to discussing new projects, creative ideas, or opportunities.</p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = 'mailto:your.email@example.com'}
        >
          Start a Conversation
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Socials
