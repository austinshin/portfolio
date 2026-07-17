const EXPERIENCES = [
  {
    title: 'csreplays.com — AI Coach for CS2 Demos',
    company: 'Independent (Founder / Engineer)',
    period: 'May 2026 – Present',
    description: [
      'Built end-to-end SaaS that turns a Counter-Strike 2 .dem replay into a coaching report grounded in specific rounds and timestamps',
      'Stack: Next.js 15 + TypeScript webapp, Python parsing worker on Modal (scale-to-zero), Inngest for durable async pipeline orchestration, Supabase Postgres + Cloudflare R2 storage',
      'Demo parsing built on ValveResourceFormat to extract per-round events, player ticks, and grenade trajectories from the CS2 binary format',
      'Claude Sonnet 4.6 generates the coaching report from a structured digest; hallucination guard rejects any output citing rounds or lineups not in the digest',
      'Stripe subscriptions ($9.99/mo Pro tier) with idempotent webhook handlers and a Postgres credits ledger',
    ],
  },
  {
    title: 'Billable — iOS Time-Capture App (CTO)',
    company: 'Co-founder / iOS Engineer',
    period: 'Apr 2026 – Present',
    description: [
      'Co-founded as CTO; building a native iOS app (SwiftUI, iOS 17+, SwiftData) that auto-generates timesheets for hourly-billing professionals (lawyers, CPAs, consultants)',
      'Architected passive-capture pipeline across EventKit (calendar), CallKit (calls), and the Gmail API (email metadata only — never message bodies)',
      'StoreKit 2 subscriptions for Pro tier, PDFKit-based report exporter, full delete-all-data compliance flow',
      '~1,500 LOC of service-layer Swift with 16 dedicated XCTest suites covering capture, classification, reporting, and OAuth flows',
    ],
  },
  {
    title: 'Day Trading & AI Learning',
    company: 'Independent',
    period: 'Nov 2023 – Present',
    description: [
      'Developed trading scripts using Python, Obsidian, and Claude for journaling, news scraping, and algorithmic trading strategies',
      'Built AI-powered applications to automate repetitive tasks',
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'GoDaddy',
    period: 'Jan 2021 – May 2023',
    description: [
      'Led development of enterprise web applications serving millions of merchants',
      'Led sprints on the In-Person Selling team and helped maintain apps on the Payments Hub team',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Poynt (Startup)',
    period: 'May 2018 – Jan 2021',
    description: [
      'Full-stack development on the Merchant team',
      'Built features from concept to production working with design, Android, and product',
    ],
  },
  {
    title: 'Professional Esports Player (Mid Laner)',
    company: 'Counter Logic Gaming & Team Liquid',
    period: 'Nov 2011 – May 2015, 2017',
    description: [
      'Shotcaller and drafter for professional League of Legends teams',
      'Competed in the League of Legends Championship Series (LCS)',
      'One of the pioneering NA LCS mid laners',
    ],
  },
]

const SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Swift / SwiftUI',
  'PostgreSQL',
  'Supabase',
  'Vercel',
  'AWS',
  'Docker',
  'Git',
  'CI/CD',
]

const Resume = () => {
  return (
    <>
      <h1>Resume</h1>
      <p>
        <a
          href="https://drive.google.com/file/d/1depxhrLL9jSSTUO5R3BaoXAzjic6GnvH/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          Formal resume (PDF)
        </a>
      </p>

      <h2>Experience</h2>
      {EXPERIENCES.map((exp) => (
        <div key={exp.title} className="item-block">
          <div className="item-header">
            <h3>{exp.title}</h3>
            <span className="item-period">{exp.period}</span>
          </div>
          <div className="item-sub">{exp.company}</div>
          <ul>
            {exp.description.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Skills</h2>
      <div className="tag-row">
        {SKILLS.map((skill) => (
          <span key={skill} className="tag">
            {skill}
          </span>
        ))}
      </div>

      <h2>Education</h2>
      <div className="item-block">
        <div className="item-header">
          <h3>UC Berkeley</h3>
        </div>
        <div className="item-sub">Computer Science</div>
      </div>
      <div className="item-block">
        <div className="item-header">
          <h3>HackReactor</h3>
          <span className="item-period">2018</span>
        </div>
        <div className="item-sub">Software Engineering Bootcamp</div>
      </div>
    </>
  )
}

export default Resume
