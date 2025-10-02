import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import './Pages.css'

const GamingAchievements = () => {
  const games = [
    {
      title: 'League of Legends',
      period: '2011 - 2025',
      icon: '/icons/league-of-legends.jpg',
      color: '#C89B3C', // Official League of Legends gold
      achievements: [
        'Played on Counter Logic Gaming (CLG) and Team Liquid (TL), in North America LCS (League Championship Series), one of the most popular esports league in the world',
        'Primary shotcaller for team - led team meetings, handled draft and theorycrafting',
        'Traveled to international LANs representing North America',
        'Maintained Top 10 Challenger rank on the ladder (2011-2015)',
        'Content creation and sponsorships with Riot Games, Twitch, Razer, IBuyPower, Azubu, Alienware, Logitech,',
        'Held interviews, fan meets, public events to increase brand awareness and promote sales of sponorships and self merchandise',
        'Former Twitch streamer',
        '100k+ X followers and 50k+ Twitch followers',
      ],
    },
    {
      title: 'Dota',
      period: '2006 - 2025',
      icon: '/icons/dota.png',
      color: '#D32CE6', // Official Dota 2 magenta/pink
      achievements: [
        'Achieved Top 50 rank on ladder (2017)',
        'Commentator and content creator for Dota Commentaries (2009-2011) whiched helped expand awareness in the Western Dota Pro Scene',
        'Collaborated with TI casters and professional players',
        'Created YouTube content for the Dota community sharing tips, tricks, and guides',
        '1v1 practice and theorycrafting with professional TI players',
      ],
    },
    {
        title: 'Deadlock',
        period: '2024-2025',
        icon: '/icons/deadlock.png',
        color: '#E8B44F', // Deadlock gold
        achievements: [
          'Reached Ascendant rank during Closed Alpha',
        ],
      },
    {
      title: 'Path of Exile',
      period: '2018 - 2025',
      icon: '/icons/poe.png',
      color: '#AF6025', // Path of Exile bronze/orange
      achievements: [
        'Top 3 Hardcore (HC) on Class Ladders across multiple seasons',
        'Placed 5th in Zizaran\'s HC Race Gauntlet',
        'Theorycrafted and created various hipster meta builds',
        'Content creation on Youtube'
      ],
    },
    {
      title: 'Hearthstone',
      period: '2013-2017',
      icon: '/icons/hearthstone.jpg',
      color: '#FFB600', // Hearthstone gold
      achievements: [
        'Reached Top 10 Legend rank on ladder',
        'Created multiple self-made meta decks to dominate ladder',
      ],
    },
    {
      title: 'Valorant',
      period: '2021',
      icon: '/icons/valorant.png',
      color: '#ff4655',
      achievements: [
        'Achieved Immortal 3 rank in Beta/Season 1',
      ],
    },
    {
      title: 'Torchlight Infinite',
      period: '2025',
      icon: '/icons/torchlight.png',
      color: '#FF6B35', // Torchlight orange/red
      achievements: [
        'Rank 3 to first level 100 on Class Gemma 1/2',
      ],
    },

    {
      title: 'H1Z1',
      period: '2016 - 2017',
      icon: '/icons/h1z1.jpg',
      color: '#00A8E8', // H1Z1 blue
      achievements: [
        'Achieved Royalty rank',
      ],
    },
    {
      title: 'Teamfight Tactics',
      period: '2019-2025',
      icon: '/icons/tft.jpg',
      color: '#C89B3C', // Same as League of Legends gold (TFT is a League game mode)
      achievements: [
        'Top 200 Challenger rank in Season 12',
        'Peak 1000LP',
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
          I bring the same discipline and focus from professional gaming into engineering. Across every genre I’ve committed to, I’ve consistently ranked in the top 1% of players. This mastery reflects not only skill, but also dedication, rapid learning, and the ability to strategize which are all qualities I now apply towards my professional career. Here are some of my accolades.
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
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={game.icon} 
                  alt={`${game.title} icon`}
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    objectFit: 'contain',
                    filter: `drop-shadow(0 0 6px ${game.color})`,
                  }}
                />
              </motion.div>
              <div className="game-title-section">
                <h2 style={{ color: game.color }}>{game.title}</h2>
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
