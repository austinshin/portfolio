import { motion } from 'framer-motion'
import { Github, Twitter, Mail, Instagram, BookOpen, Youtube } from 'lucide-react'
import './Pages.css'

const Socials = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github size={40} />,
      url: 'https://github.com/austinshin',
      username: '@austinshin',
      color: '#ffffff',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={40} />,
      url: 'https://twitter.com/link115_',
      username: '@link115_',
      color: '#1da1f2',
    },
    {
      name: 'Instagram',
      icon: <Instagram size={40} />,
      url: 'https://instagram.com/link115',
      username: '@link115',
      color: '#e4405f',
    },
    {
      name: 'Substack',
      icon: <BookOpen size={40} />,
      url: 'https://substack.com/@link115',
      username: '@link115',
      color: '#ff6719',
    },
    {
      name: 'YouTube',
      icon: <Youtube size={40} />,
      url: 'https://www.youtube.com/@Link115_',
      username: '@Link115_',
      color: '#ff0000',
    },
    {
      name: 'Email',
      icon: <Mail size={40} />,
      url: 'mailto:shinaustin@gmail.com',
      username: 'shinaustin@gmail.com',
      color: '#ea4335',
    },
  ]

  return (
    <div className="page socials-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
    </div>
  )
}

export default Socials
