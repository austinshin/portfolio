const About = () => {
  return (
    <>
      <h1>About</h1>
      <p>
        Hi! I'm Austin. I'm a software engineer and former professional League of Legends
        player. I spent my early career competing at the highest level of esports, then
        returned to building software — and these days I split my time between shipping
        products, day trading, and learning everything I can about AI.
      </p>
      <p>
        The best way to reach me is via{' '}
        <a href="https://twitter.com/link115_" target="_blank" rel="noopener noreferrer">
          Twitter DM
        </a>{' '}
        or <a href="mailto:shinaustin@gmail.com">email</a>.
      </p>

      <h3>Current work</h3>
      <p>
        Building{' '}
        <a href="https://csreplays.com" target="_blank" rel="noopener noreferrer">
          csreplays.com
        </a>{' '}
        — a CS2 replay analyzer that utilizes trained AI models via machine learning in
        order to:
      </p>
      <ol>
        <li>Analyze pro replays and output grenade lineups</li>
        <li>Give statistical reports to players based on their match history</li>
        <li>
          Build an AI coach trained on thousands of demos to provide insight at a
          holistic level
        </li>
        <li>Automated content generation pipeline via shortform content</li>
      </ol>

      <h3>Past work</h3>
      <ul>
        <li>
          Senior Software Engineer at <strong>GoDaddy</strong>, where I helped refactor
          Merchant HQ from Ember to React/TypeScript and led sprints on the in-person
          selling team.
        </li>
        <li>
          Software Engineer at <strong>Poynt</strong>, where I led the implementation of
          shareable payment links and PCI-compliant card tokenization.
        </li>
        <li>
          Professional League of Legends player — mid laner for{' '}
          <strong>Counter Logic Gaming</strong> (2011–2015) and <strong>Team Liquid</strong>{' '}
          (2017). Shotcaller, drafter, and one of the pioneering NA LCS mid laners.
        </li>
        <li>Studied Computer Science at UC Berkeley.</li>
      </ul>

      <h3>Interests</h3>
      <ul>
        <li>Gaming and competing</li>
        <li>Building tools that make life easier for myself and others</li>
        <li>Trading and markets</li>
        <li>Health and wellness</li>
        <li>Improving at life by 1% every day</li>
      </ul>
    </>
  )
}

export default About
