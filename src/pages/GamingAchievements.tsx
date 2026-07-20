interface Game {
  title: string
  period: string
  icon: string
  color: string
  achievements: string[]
}

const GAMES: Game[] = [
  {
    title: 'League of Legends',
    period: '2011 – 2025',
    icon: '/icons/league-of-legends.jpg',
    color: '#C89B3C',
    achievements: [
      'Played for Counter Logic Gaming (CLG) and Team Liquid (TL) in the NA LCS, one of the most popular esports leagues in the world',
      'Primary shotcaller — led team meetings, drafting, and theorycrafting',
      'Traveled to international LANs representing North America',
      'Maintained Top 10 Challenger rank on the ladder (2011–2015)',
      'Content creation and sponsorships with Riot Games, Twitch, Razer, iBuyPower, Azubu, Alienware, and Logitech',
      'Held interviews, fan meets, and public events promoting sponsors and personal merchandise',
      'Former Twitch streamer — 100k+ X followers and 50k+ Twitch followers',
    ],
  },
  {
    title: 'Dota',
    period: '2006 – 2025',
    icon: '/icons/dota.png',
    color: '#D32CE6',
    achievements: [
      'Achieved Top 50 rank on the ladder (2017)',
      'Commentator and content creator for Dota Commentaries (2009–2011), which helped expand awareness of the Western Dota pro scene',
      'Collaborated with TI casters and professional players',
      'Created YouTube content for the Dota community — tips, tricks, and guides',
      '1v1 practice and theorycrafting with professional TI players',
    ],
  },
  {
    title: 'Path of Exile',
    period: '2018 – 2025',
    icon: '/icons/poe.png',
    color: '#AF6025',
    achievements: [
      'Top 3 Hardcore on class ladders across multiple seasons',
      "Placed 5th in Zizaran's HC Race Gauntlet",
      'Theorycrafted and created various hipster meta builds',
      'Content creation on YouTube',
    ],
  },
  {
    title: 'Teamfight Tactics',
    period: '2019 – 2025',
    icon: '/icons/tft.jpg',
    color: '#C89B3C',
    achievements: ['Top 200 Challenger rank in Season 12', 'Peak 1000 LP'],
  },
  {
    title: 'Hearthstone',
    period: '2013 – 2017',
    icon: '/icons/hearthstone.jpg',
    color: '#FFB600',
    achievements: [
      'Reached Top 10 Legend rank on the ladder',
      'Created multiple self-made meta decks to dominate ladder',
    ],
  },
  {
    title: 'Deadlock',
    period: '2024 – 2025',
    icon: '/icons/deadlock.png',
    color: '#E8B44F',
    achievements: ['Reached Ascendant rank during Closed Alpha'],
  },
  {
    title: 'Torchlight Infinite',
    period: '2025',
    icon: '/icons/torchlight.png',
    color: '#FF6B35',
    achievements: ['Rank 3 to first level 100 on class Gemma 1/2'],
  },
  {
    title: 'Valorant',
    period: '2021',
    icon: '/icons/valorant.png',
    color: '#FF4655',
    achievements: ['Achieved Immortal 3 rank in Beta / Season 1'],
  },
  {
    title: 'H1Z1',
    period: '2016 – 2017',
    icon: '/icons/h1z1.jpg',
    color: '#00A8E8',
    achievements: ['Achieved Royalty rank'],
  },
]

const GamingAchievements = () => {
  return (
    <>
      <h1>Gaming Achievements</h1>
      <p>
        I bring the same discipline and focus from professional gaming into engineering.
        Across every genre I've committed to, I've consistently ranked in the top 1% of
        players — a reflection of dedication, rapid learning, and strategic thinking that
        I now apply to my professional career.
      </p>

      {GAMES.map((game) => (
        <div key={game.title} className="game-block" style={{ borderLeftColor: game.color }}>
          <div className="game-header">
            <img className="game-icon" src={game.icon} alt="" />
            <div className="item-header game-title-row">
              <h3>{game.title}</h3>
              <span className="item-period">{game.period}</span>
            </div>
          </div>
          <ul>
            {game.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

export default GamingAchievements
