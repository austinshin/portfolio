import { motion } from 'framer-motion'
import { Trophy, Target, Users, TrendingUp, Award, Gamepad2 } from 'lucide-react'
import './Pages.css'

const GamingAchievements = () => {
  const games = [
    {
      title: 'League of Legends',
      period: '2011 - 2025',
      icon: <Trophy size={40} />,
      color: '#d4af37',
      achievements: [
        'Played on Counter Logic Gaming (CLG), a top 3 team in North America in LCS (League Championship Series), the most popular esports league in the world',
        'Primary shotcaller for team - led team meetings, handled draft and theorycrafting',
        'Traveled to international LANs representing North America',
        'Maintained Top 10 Challenger rank on the ladder (2011-2015)',
        'Played on Team Liquid (TL)',
        'Content creation and sponsorships with Riot Games, Twitch, Razer, IBuyPower, Azubu, Alienware, Logitech,',
        'Held interviews, fan meets, public events to increase brand awareness and promote sales of sponorships and self merchandise',
        'Active Twitch streamer building gaming community',
        '100k+ Twitter followers and 50k+ Twitch followers',
      ],
    },
    {
      title: 'Dota',
      period: '2009 - 2025',
      icon: <Gamepad2 size={40} />,
      color: '#ff6b6b',
      achievements: [
        'Commentator and content creator for Dota Commentaries (2009-2011) whiched helped expand awareness in the Western Dota Pro Scene',
        'Collaborated with future TI casters and professional players',
        'Achieved Top 50 rank on ladder (2017)',
        'Created YouTube content for the Dota community sharing tips, tricks, and guides',
        '1v1 practice and theorycrafting with professional TI players',
        'I also played Hon actively too when it first came out',
      ],
    },
    {
        title: 'Deadlock',
        period: '2024-2025',
        icon: <Target size={40} />,
        color: '#9370db',
        achievements: [
          'Reached Ascendant rank during Closed Alpha',
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
        'Theorycrafted and created various hipster meta builds',
        'Content creation on Youtube'
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
      ],
    },
    {
      title: 'Valorant',
      period: '2021',
      icon: <TrendingUp size={40} />,
      color: '#ff4655',
      achievements: [
        'Achieved Immortal 3 rank in Beta/Season 1',
      ],
    },
    {
      title: 'Torchlight Infinite',
      period: '2025',
      icon: <Trophy size={40} />,
      color: '#ff8c00',
      achievements: [
        'Rank 3 to first level 100 on Class Gemma 1/2',
      ],
    },

    {
      title: 'H1Z1',
      period: '2016 - 2017',
      icon: <Award size={40} />,
      color: '#ff6347',
      achievements: [
        'Achieved Royalty rank (top tier)',
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
            In any game I have played, I have acheived top 1% mastery. Below are some of my achievements throughout my gaming career.
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
    </div>
  )
}

export default GamingAchievements
