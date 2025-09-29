import { motion } from 'framer-motion'
import { Mail, MessageSquare, FileText, Calendar } from 'lucide-react'
import './Pages.css'

const More = () => {
  return (
    <div className="page more-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>MORE INFO</h1>
        <div className="header-line"></div>
      </motion.div>

      <div className="more-grid">
        <motion.div
          className="more-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="more-icon">
            <Mail size={40} />
          </div>
          <h3>Get In Touch</h3>
          <p>Let's discuss your next project or potential collaboration opportunities.</p>
          <motion.button
            className="more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.button>
        </motion.div>

        <motion.div
          className="more-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="more-icon">
            <FileText size={40} />
          </div>
          <h3>Blog & Articles</h3>
          <p>Read my thoughts on technology, game development, and industry trends.</p>
          <motion.button
            className="more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Blog
          </motion.button>
        </motion.div>

        <motion.div
          className="more-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="more-icon">
            <MessageSquare size={40} />
          </div>
          <h3>Testimonials</h3>
          <p>See what colleagues and clients have to say about working with me.</p>
          <motion.button
            className="more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Reviews
          </motion.button>
        </motion.div>

        <motion.div
          className="more-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="more-icon">
            <Calendar size={40} />
          </div>
          <h3>Schedule Meeting</h3>
          <p>Book a time to chat about opportunities, projects, or just to connect.</p>
          <motion.button
            className="more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule Call
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="contact-form-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2>Send Me a Message</h2>
        <form className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
          </div>
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Message" rows={6} required></textarea>
          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default More
