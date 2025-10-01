import { motion } from 'framer-motion'
import './Timeline.css'

const Timeline = () => {
  const timeline = [
    { year: '2011', type: 'education', title: 'Started UC Berkeley', subtitle: 'Computer Science' },
    { year: '2013', type: 'esports', title: 'Counter Logic Gaming', subtitle: 'Professional League of Legends' },
    { year: '2015', type: 'education', title: 'Returned to UC Berkeley', subtitle: 'Computer Science' },
    { year: '2016', type: 'esports', title: 'Team Liquid', subtitle: 'Professional League of Legends' },
    { year: '2018', type: 'education', title: 'HackReactor Bootcamp', subtitle: 'Software Engineering' },
    { year: '2018', type: 'work', title: 'Poynt', subtitle: 'Software Engineer' },
    { year: '2021', type: 'work', title: 'GoDaddy', subtitle: 'Senior Software Engineer' },
    { year: '2023', type: 'work', title: 'Self Development', subtitle: 'Trading & AI Applications' },
    { year: '2025', type: 'future', title: 'Present Day', subtitle: 'Building & Learning' },
  ]

  return (
    <motion.section
      className="visual-timeline-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: '800' }}>My Journey</h2>
      <div className="visual-timeline">
        {timeline.map((item, i) => (
          <motion.div
            key={i}
            className={`timeline-node ${item.type}`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-node-content">
              <div className="timeline-dot"></div>
              <div className="timeline-info">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default Timeline

