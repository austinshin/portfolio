import { motion } from 'framer-motion'
import { Trophy, Target, Users, TrendingUp, Award, Gamepad2 } from 'lucide-react'
import './Pages.css'

const GamingAchievements = () => {
  const games = [
    {
      title: 'League of Legends',
      period: '2011 - 2017',
      icon: <Trophy size={40} />,
      color: '#d4af37',
      achievements: [
        'Played on Counter Logic Gaming (CLG), a top 3 team in North America',
        'Primary shotcaller for team - led team meetings, handled draft and theorycrafting',
        'Traveled to international LANs representing North America',
        'Maintained Top 10 Challenger rank on the ladder (2011-2015)',
        'Content creation and sponsorships with Razer, IBuyPower, Azubu, Twitch, and Riot Games',
        'Held fan meets and public events to increase brand awareness',
        'Active Twitch streamer building gaming community',
        '100k+ Twitter followers and 50k+ Twitch followers',
      ],
    },
    {
      title: 'Dota',
      period: '2009 - 2011, 2017',
      icon: <Gamepad2 size={40} />,
      color: '#ff6b6b',
      achievements: [
        'Commentator and content creator for Dota Commentaries (2009-2011)',
        'Helped expand awareness in the Western Dota scene',
        'Collaborated with future TI casters and professional players',
        'Achieved Top 50 rank on ladder (2017)',
        'Created YouTube content for the Dota community',
        '1v1 practice and theorycrafting with professional TI players',
      ],
    },
    {
      title: 'Path of Exile',
      period: '2018 - 2024',
      icon: <Target size={40} />,
      color: '#8b4513',
      achievements: [
        'Top 3 Hardcore (HC) on Class Ladders across multiple seasons',
        'Placed 5th in Zizaran\'s HC Race Gauntlet',
        'Demonstrated mastery of complex game mechanics and build theory',
        'Competed at highest level in hardcore competitive environment',
      ],
    },
    {
      title: 'Hearthstone',
      period: '2016',
      icon: <Award size={40} />,
      color: '#ffd700',
      achievements: [
        'Reached Top 10 Legend rank on ladder',
        'Created multiple self-made meta decks to dominate ladder',
        'Pioneered deck strategies that influenced the meta',
      ],
    },
    {
      title: 'Valorant',
      period: '2021',
      icon: <TrendingUp size={40} />,
      color: '#ff4655',
      achievements: [
        'Achieved Immortal 3 rank in Beta/Season 1',
        'Top 0.1% of all players globally',
        'Mastered tactical FPS mechanics and team coordination',
      ],
    },
    {
      title: 'Torchlight Infinite',
      period: '2025',
      icon: <Trophy size={40} />,
      color: '#ff8c00',
      achievements: [
        'Rank 3 to first level 100 on Class Gemma 1/2',
        'Speed-leveling optimization and efficiency mastery',
      ],
    },
    {
      title: 'Deadlock',
      period: '2024',
      icon: <Target size={40} />,
      color: '#9370db',
      achievements: [
        'Reached Ascendant rank',
        'Early adopter and quick learner of new competitive title',
      ],
    },
    {
      title: 'H1Z1',
      period: '2016 - 2017',
      icon: <Award size={40} />,
      color: '#ff6347',
      achievements: [
        'Achieved Royalty rank (top tier)',
        'Battle royale mechanics mastery',
      ],
    },
  ]

  return (
    <div className="page gaming-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>GAMING ACHIEVEMENTS</h1>
        <div className="header-line"></div>
        <p className="subtitle">
          Professional esports career + consistent top-tier performance across multiple competitive titles
        </p>
      </motion.div>

      <motion.div
        className="gaming-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="intro-card">
          <Users size={30} style={{ color: 'var(--accent)' }} />
          <h3>Multi-Game Mastery</h3>
          <p>
            I'm highly proficient and excel at every game I invest time and effort into.
            From professional League of Legends to hardcore Path of Exile, I consistently
            reach top-tier ranks through strategic thinking, rapid learning, and competitive drive.
          </p>
        </div>
      </motion.div>

      <div className="games-grid">
        {games.map((game, i) => (
          <motion.div
            key={game.title}
            className="game-achievement-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * i }}
            whileHover={{ y: -10, boxShadow: `0 10px 40px ${game.color}40` }}
          >
            <div className="game-header">
              <motion.div
                className="game-icon"
                style={{ color: game.color }}
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                {game.icon}
              </motion.div>
              <div className="game-title-section">
                <h2>{game.title}</h2>
                <span className="game-period" style={{ color: game.color }}>
                  {game.period}
                </span>
              </div>
            </div>

            <ul className="achievements-list">
              {game.achievements.map((achievement, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                >
                  <span className="bullet" style={{ backgroundColor: game.color }}>•</span>
                  {achievement}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="gaming-footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="footer-stats">
          <div className="stat-item">
            <Trophy size={40} style={{ color: 'var(--accent)' }} />
            <h3>6+ Years</h3>
            <p>Professional Esports</p>
          </div>
          <div className="stat-item">
            <Target size={40} style={{ color: 'var(--accent)' }} />
            <h3>8 Games</h3>
            <p>Top-Tier Rankings</p>
          </div>
          <div className="stat-item">
            <Users size={40} style={{ color: 'var(--accent)' }} />
            <h3>150k+</h3>
            <p>Community Following</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default GamingAchievements
