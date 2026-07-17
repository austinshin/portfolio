export interface Project {
  id: string
  title: string
  company?: string
  description: string[]
  tags: string[]
  image?: string
  type: 'professional' | 'personal'
  period?: string
  demoUrl?: string
  githubUrl?: string
  docsUrl?: string
  detailedInfo?: {
    howItWorks?: string[]
    challenges?: string[]
    impact?: string[]
    learnings?: string[]
  }
  gallery?: Array<{
    url: string
    caption?: string
  }>
}

export const professionalProjects: Project[] = [
  {
    id: 'godaddy-migration',
    title: 'Merchant HQ Migration',
    company: 'GoDaddy',
    period: 'Jan 2021 - May 2023',
    description: [
      'Helped refactor entire codebase from Ember to React/Redux/TypeScript',
      'Updated routing system to React Router',
      'Integrated with GoDaddy\'s design system and component library',
    ],
    tags: ['React', 'Redux', 'TypeScript', 'React Router'],
    type: 'professional',
    detailedInfo: {
      challenges: [
        'Refactoring large legacy Ember codebase while maintaining functionality',
        'Coordinating with design team to adopt new component library',
        'Ensuring seamless transition from existing merchant use cases to new ones',
      ],
      impact: [
        'Improved developer productivity with modern tooling',
        'Helped improve code quality and maintainability',
        'Better type safety reduced bugs in production',
        'Faster feature development with React ecosystem',
      ],
    },
  },
  {
    id: 'poynt-pay-links',
    title: 'Poynt Collect Pay Links',
    company: 'Poynt (acquired by GoDaddy)',
    period: 'May 2018 - Jan 2021',
    demoUrl: 'https://support.poynt.com/hc/en-us/articles/1500001772841-Online-Pay-Links',
    docsUrl: 'https://docs.poynt.com/api-reference/index.html#head-merchants',
    description: [
      'Led implementation of shareable payment links for social media commerce',
      'Designed security process using credit card tokenization with double-layer security',
      'Created comprehensive payment processing solution from simple form to enterprise-grade system',
      'Protected customer data through secure nonce and multi-use token system',
      'Enabled merchants to receive payments online without accessing customer data',
      'Implemented recurring customer recognition for easier transaction processing',
      'Successfully generated significant revenue for the company',
    ],
    tags: ['React', 'Node.js', 'Security', 'Tokenization', 'Payment Processing', 'PCI Compliance', 'JavaScript'],
    type: 'professional',
    detailedInfo: {
      howItWorks: [
        'Developers mount the Poynt Collect JavaScript block on their payment page',
        'Customers enter sensitive card information using the Poynt Collect JavaScript form',
        'The sensitive data is sent directly to the GoDaddy Poynt server (bypassing merchant server)',
        'GoDaddy Poynt returns a unique nonce back to the browser',
        'The page passes the nonce back to the developer server',
        'The developer server calls the GoDaddy Poynt server and obtains a multi-use token using the initial nonce',
        'The token is used to charge the customer without merchant ever accessing raw card data',
      ],
      challenges: [
        'Implementing PCI-compliant payment security with double-layer protection',
        'Creating user-friendly shareable links for non-technical merchants',
        'Designing secure nonce-to-token conversion system',
        'Handling payment processing errors gracefully across multiple payment flows',
        'Building recurring customer recognition without storing sensitive data',
        'Centralizing payment processing services across GoDaddy Poynt ecosystem',
      ],
      impact: [
        'Generated significant revenue through social commerce channels',
        'Zero security breaches with tokenization implementation',
        'Merchants could accept payments without physical terminals',
        'Eliminated need for merchants to handle sensitive customer data',
        'Enabled seamless recurring payments while maintaining security',
        'Became comprehensive payment processing solution for GoDaddy Poynt merchants',
      ],
      learnings: [
        'Payment processing and services are crucial for merchant operations',
        'Every transaction contains confidential information subject to numerous regulations',
        'Nonce-based tokenization provides secure payment processing',
        'Recurring customer recognition improves merchant workflow efficiency',
        'Separating sensitive data flow from merchant servers ensures PCI compliance',
      ],
    },
    gallery: [
      {
        url: 'https://i.imgur.com/ePtSNaD.png',
        caption: 'Poynt Collect payment form with secure customer data entry',
      },
      {
        url: 'https://i.imgur.com/jUvksFQ.png',
        caption: 'Poynt Collect architecture - JavaScript block flow with nonce and token system',
      },
    ],
  },
  {
    id: 'in-person-selling',
    title: 'In Person Selling (IPS)',
    company: 'GoDaddy',
    period: 'May 2018 - May 2023',
    description: [
      'Built end-to-end device fulfillment system for Poynt payment terminals',
      'Implemented catalog management system for Smart Terminals and payment devices',
      'Created device shipping and order management workflow',
      'Developed RMA (Return Merchandise Authorization) process for device returns',
      'Integrated with Payments Hub for seamless merchant experience',
    ],
    tags: ['React', 'TypeScript', 'E-commerce', 'Order Management', 'Fulfillment', 'REST API'],
    type: 'professional',
    detailedInfo: {
      howItWorks: [
        'IPS page displays catalog of available Poynt payment devices on Payments Hub',
        'Device catalog is stored on a dedicated Poynt business and manually updated via API',
        'Catalog includes Smart Terminals with specifications, images, SKUs, and pricing',
        'Merchants select devices, create orders, and initiate shipping through the workflow',
        'System creates Poynt orders and manages device fulfillment end-to-end',
        'RMA process handles device returns and replacements',
      ],
      challenges: [
        'Managing static catalog that required careful manual updates via API calls',
        'Ensuring catalog consistency across production environment',
        'Building robust order management system integrated with fulfillment',
        'Implementing reliable device shipping and tracking workflow',
        'Creating seamless RMA process for device returns',
      ],
      impact: [
        'Enabled merchants to easily purchase Poynt payment terminals online',
        'Streamlined device fulfillment reducing manual processing time',
        'Provided clear product catalog with detailed specifications and images',
        'Improved merchant onboarding experience with self-service device ordering',
        'Reduced support overhead with automated order and shipping management',
      ],
      learnings: [
        'E-commerce fulfillment requires careful integration between catalog, orders, and shipping',
        'Static catalog management needs clear documentation and update procedures',
        'Device fulfillment systems must handle edge cases like returns and replacements',
        'REST API design for product management requires versioning and careful endpoints',
      ],
    },
  },
  {
    id: 'poynt-dashboard',
    title: 'Merchant HQ Dashboard',
    company: 'Poynt',
    period: 'May 2018 - Jan 2021',
    description: [
      'Built comprehensive merchant dashboard for transaction data',
      'Collaborated with design team for intuitive interface',
      'Created reporting tools for daily sales aggregation',
      'Enabled customer data management and support features',
    ],
    tags: ['Ember', 'React', 'Data Visualization', 'Dashboard', 'UI/UX'],
    type: 'professional',
  },
  {
    id: 'poynt-api',
    title: 'API Service',
    company: 'Poynt',
    period: 'May 2018 - Jan 2021',
    description: [
      'Created secure API endpoints for transaction processing',
      'Handled data flow between Android devices and banking systems',
      'Implemented monitoring infrastructure with Kibana',
      'Built streaming services for error tracking and analytics',
    ],
    tags: ['Node.js', 'API', 'Redis', 'Kibana', 'Banking Integration'],
    type: 'professional',
  },
  {
    id: 'poynt-catalog',
    title: 'Catalog App',
    company: 'Poynt',
    period: 'May 2018 - Jan 2021',
    description: [
      'Designed and built full-stack catalog webview application',
      'Enabled merchants to create visual product menus',
      'Created API endpoints for catalog data management',
      'Integrated with Poynt terminal hardware',
    ],
    tags: ['Full Stack', 'React', 'Node.js', 'API', 'E-commerce'],
    type: 'professional',
  },
  {
    id: 'godaddy-hermes',
    title: 'Hermes Backend Service',
    company: 'GoDaddy',
    period: 'Jan 2021 - May 2023',
    description: [
      'Enhanced internal API service for settlement reporting',
      'Automated data streams for payment processing',
      'Implemented error monitoring with Slack integration',
      'Provided real-time team alerts for critical bugs',
    ],
    tags: ['Node.js', 'API', 'Automation', 'Monitoring', 'Slack Integration'],
    type: 'professional',
  },
]

export const personalProjects: Project[] = [
  {
    id: 'billable',
    title: 'Billable — iOS Time-Capture App',
    period: 'Apr 2026 - Present',
    demoUrl: 'https://ihatebillables.com',
    description: [
      'Native iOS app (SwiftUI, iOS 17+) that auto-generates timesheets for hourly-billing professionals (lawyers, CPAs, consultants)',
      'Passively captures calendar events, phone calls, and email metadata to reconstruct a billable workweek in under 5 minutes',
      'Co-founded as CTO with a product/design partner; built the entire iOS codebase end-to-end',
      'Architected capture pipeline across EventKit, CallKit, and the Gmail API behind a single confirmation flow',
      'Heuristic email-to-client matching (domain validator, address parser, time-gap clusterer, keyword classifier) with confidence scoring',
      'Free tier: client totals; Pro tier: day-by-day breakdown via StoreKit 2 subscriptions',
      'PDF + CSV report export with a custom PDFKit renderer',
      'XcodeGen-managed project, Google Sign-In via SPM, comprehensive XCTest coverage across all services',
    ],
    tags: ['Swift', 'SwiftUI', 'iOS', 'EventKit', 'CallKit', 'Gmail API', 'StoreKit 2', 'SwiftData', 'XCTest', 'XcodeGen'],
    type: 'personal',
    detailedInfo: {
      howItWorks: [
        'Onboarding flow walks users through calendar permission, call detection setup, OAuth account connection, and initial client list',
        'EventKitCaptureService observes the system calendar and turns events into CapturedEvent records pre-classified by client',
        'CallDetectionService + CallEventProcessor surface a missed-call prompt to log post-call billable time',
        'GmailAPIClient pulls message metadata (never bodies) and EmailCaptureMapper deduplicates threads into per-client time blocks',
        'ClientMatcher fuses domain resolution, keyword classification, and email clustering to attribute events with a confidence score',
        'WeekView presents pre-classified events in a confirmation sheet; user approves/edits in bulk',
        'ReportGenerator aggregates approved events into client totals (free) or day-by-day breakdowns (Pro), exported via PDFExporter or CSV',
      ],
      challenges: [
        'Designing a privacy-first capture story: never reading email bodies, scoping calendar access, surfacing data flow in UI',
        'Tuning email inference heuristics to be useful without being noisy — gap thresholds, domain confidence, keyword weighting',
        'Coordinating EventKit, CallKit, and Gmail OAuth into a single coherent SwiftData model without duplication',
        'Preparing for App Store review with CallKit + Gmail OAuth (high-friction permissions that frequently get rejected)',
        'Building a delete-all-data path that fully wipes the local SwiftData store + revokes OAuth tokens for compliance',
      ],
      impact: [
        'Cuts a 30–45 minute weekly timesheet reconstruction down to under 5 minutes',
        '~1,500 LOC of service-layer Swift with 16 dedicated XCTest suites — high test coverage from day one',
        'On track for TestFlight in 12 weeks with a path to App Store launch and $900+ MRR target',
      ],
      learnings: [
        'Native iOS architecture: SwiftUI + SwiftData + actor-based services for background capture',
        'Apple permission UX: building flows that survive App Store review for sensitive entitlements',
        'OAuth and Gmail API integration with refresh-token storage in the iOS Keychain',
        'StoreKit 2 subscription verification with offline grace periods',
        'Founder/CTO role: product trade-offs, equity contracts, sprint planning with a non-technical partner',
      ],
    },
  },
  {
    id: 'csreplays',
    title: 'csreplays.com — AI Coach for CS2 Demos',
    period: 'May 2026 - Present',
    demoUrl: 'https://csreplays.com',
    description: [
      'AI demo coach for Counter-Strike 2: user uploads a .dem replay and gets a coaching report grounded in specific rounds and timestamps',
      'Differentiator vs. Leetify/Scope.gg: natural-language coaching ("round 14, you peeked A-long without smoke after losing the same duel in round 11") instead of stat dashboards',
      'Demo parsing built on top of ValveResourceFormat to extract entity ticks, grenade trajectories, and round events directly from the CS2 demo binary',
      'Inngest orchestrates the full async pipeline — durable retries, fan-out steps, and webhook delivery from upload through report generation',
      'Modal runs the Python demo-parsing worker as a scale-to-zero serverless function, billed per second of actual parse time',
      'Claude (Sonnet 4.6) consumes a structured per-match digest and produces the coaching report; a hallucination guard rejects any output that cites a round, timestamp, or lineup not present in the digest',
      'Stripe integration for subscriptions: free tier (1 demo/week) + Pro at $9.99/mo, with idempotent webhook handlers and a credits ledger in Postgres',
      'Per-map smoke/molotov/flash lineup catalog so coaching output cites exact, real callouts the player can practice',
      'Roadmap: PyTorch model trained on pro-level demos to classify play patterns and tactical mistakes, surfaced through a RAG pipeline that retrieves matching pro-player examples to ground and sharpen Claude\'s coaching output',
    ],
    tags: ['Next.js 15', 'TypeScript', 'Python', 'Claude API', 'ValveResourceFormat', 'Modal', 'Inngest', 'Stripe', 'PyTorch', 'RAG', 'Supabase', 'Postgres', 'Cloudflare R2', 'Steam OpenID', 'Fly.io'],
    type: 'personal',
    detailedInfo: {
      howItWorks: [
        'User signs in via Steam OpenID 2.0 and uploads a .dem file directly to Cloudflare R2 with a signed multipart PUT',
        'Next.js API route writes an analyses row to Supabase Postgres and emits an Inngest event',
        'Inngest orchestrates the pipeline as durable steps — download, parse, digest, coach, persist — with automatic retries on each step',
        'Modal worker pulls the .dem from R2 and runs the ValveResourceFormat-based parser to extract per-round events, player ticks, and grenade trajectories',
        'A digest builder compresses raw events into a structured per-match summary: metadata, per-player stats, per-round events, cross-round patterns, available lineups',
        'Claude Sonnet 4.6 receives the digest plus a versioned coaching system prompt; output passes through a hallucination guard before storage',
        'Stripe Checkout handles Pro upgrades; webhooks update the user\'s subscription state and credit balance with idempotency keys',
        'A separate Node service on Fly.io holds a long-lived Steam Network session to resolve sharecodes into Valve-CDN demo URLs',
      ],
      challenges: [
        'Wrapping ValveResourceFormat\'s low-level demo APIs into a deterministic, testable Python parser usable inside Modal\'s short-lived container model',
        'Designing the Inngest step graph so each phase (parse, digest, coach, notify) can retry independently without re-parsing the whole demo',
        'Splitting the long-lived Steam Game Coordinator connection out of the serverless stack into its own dedicated host without coupling the webapp to Fly.io',
        'Designing a digest compact enough for the model context window but rich enough to ground specific coaching claims',
        'Preventing model hallucinations of fake rounds/lineups via a post-generation verifier against the digest',
        'Stripe webhook idempotency — handling duplicate `checkout.session.completed` events without double-crediting the user',
      ],
      impact: [
        'Cost target ~$0.20–0.30 per analysis (Modal compute + Claude tokens + R2 egress) → 30–55% gross margin at $9.99/mo Pro',
        'North-star metric: $10k MRR within 12 months (~1,000 paying users)',
        'Modal\'s scale-to-zero model means $0 idle infra cost — pay only for actual parses',
      ],
      learnings: [
        'When to use a serverless worker (Modal) vs. a long-lived host (Fly) — connection model dictates the answer, not preference',
        'Inngest as a way to model multi-step async work as durable functions instead of hand-rolled queue + retry plumbing',
        'Pre-LLM data shaping is where the real engineering value lives; the digest format is the moat',
        'RAG and PyTorch as a roadmap to move from "Claude with a great prompt" to "Claude grounded in a vector store of pro-level play patterns"',
        'End-to-end SaaS plumbing: Stripe subscriptions with webhook idempotency, Inngest durable steps, R2 signed uploads, Steam OpenID auth, Resend transactional email',
      ],
    },
  },
  {
    id: 'artflow',
    title: 'ArtFlow AI Studio',
    period: '2026',
    description: [
      'Generate artwork, mockups, and listings in a guided workflow',
      'Batch variations with a pick-the-best flow',
      'Optimized for quick Etsy listing creation',
    ],
    tags: ['Gemini', 'Veo', 'Etsy', 'React', 'AI'],
    type: 'personal',
    demoUrl: '/artflow',
  },
  {
    id: 'productivity-hub',
    title: 'ProductivityHub',
    period: 'Feb 2025 - Present',
    description: [
      'AI-powered productivity platform built with Cursor and Claude',
      'Google Auth login and user authentication',
      'Dashboard with customizable widgets',
      'Journal, todos, and calendar integration (Google Calendar API)',
      'Nutrition and workout tracking',
      'Photo storage (replica of Google Photos)',
      'AI voice agents using Natural Language Processing',
      'Deployed on Vercel with Supabase and Redis',
      'Android app bundle for mobile access',
    ],
    tags: ['React', 'TypeScript', 'AI', 'Supabase', 'Redis', 'Vercel', 'Android'],
    type: 'personal',
    detailedInfo: {
      challenges: [
        'Integrating multiple AI APIs and models',
        'Building cross-platform mobile and web experience',
        'Implementing voice command natural language processing',
        'Managing complex state across multiple productivity apps',
      ],
      impact: [
        'Replaced 5+ separate productivity apps',
        'Voice commands saved hours of manual data entry',
        'Complete control over personal data and privacy',
        'Learned modern AI integration patterns',
      ],
      learnings: [
        'AI-assisted development with Cursor and Claude',
        'Building complex full-stack applications rapidly',
        'Mobile app development with React Native',
        'Voice recognition and NLP integration',
      ],
    },
    gallery: [
      {
        url: 'https://i.imgur.com/minxhwU.png',
        caption: 'ProductivityHub Journal',
      },
      {
        url: 'https://i.imgur.com/Bn7UvPB.png',
        caption: 'ProductivityHub Dashboard Interface',
      },
      {
        url: 'https://i.imgur.com/k0tJrSn.png',
        caption: 'Android app mobile view of TODO',
      },
      {
        url: 'https://i.imgur.com/POTONri.png',
        caption: 'Android app mobile view of Journal',
      },
    ],
  },
  {
    id: 'trading-journal',
    title: 'Daytrading Journal',
    period: 'Nov 2023 - Feb 2025',
    description: [
      'Custom trading journal tailored for personal use cases',
      'Automated screenshot capture with ShareX integration',
      'AI-generated daily reports and trade analysis',
      'News aggregation from Benzinga, Twitter, DilutionTracker',
      'Web scraping from Discord channels and financial sites',
      'Cron jobs for automated report generation',
      'Built to avoid paying for third-party services',
    ],
    tags: ['Python', 'AI', 'Automation', 'Web Scraping', 'Cronjobs'],
    type: 'personal',
    detailedInfo: {
      challenges: [
        'Scraping data from multiple sources with different formats',
        'Processing and analyzing large amounts of trading data',
        'Creating automated screenshot workflows',
        'Generating actionable insights from AI analysis',
      ],
      impact: [
        'Saved $100+/month on trading journal subscriptions',
        'Improved trading performance with detailed analytics',
        'Custom reporting tailored to personal trading style',
        'Automated time-consuming manual processes',
      ],
    },
  },
  {
    id: 'chore-bot',
    title: 'ChoreBot',
    period: '2024',
    description: [
      'Discord bot using Python for household automation',
      'Manages daily chores for household of 4 friends',
      'Automated reminder notifications using Discord API and cronjob',
    ],
    tags: ['Python', 'Discord Bot', 'Automation', 'Notifications'],
    image: '',
    type: 'personal',
  },
  {
    id: 'playful-parents',
    title: 'PlayfulParents',
    period: '2026',
    description: [
      'Educational app concept for parents and kids',
      'Repository includes startup planning docs and product strategy',
      'Built with Next.js and Supabase tooling for rapid iteration',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind'],
    type: 'personal',
    githubUrl: 'https://github.com/austinshin/PlayfulParents',
  },
  {
    id: 'league-library',
    title: 'LeagueLibrary',
    period: '2026',
    description: [
      'League of Legends learning resource platform inspired by curated gaming libraries',
      'Content-focused MVP with markdown-driven authoring workflow',
      'Web app built with React, Vite, and mobile packaging via Capacitor',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'Supabase', 'Capacitor'],
    type: 'personal',
    githubUrl: 'https://github.com/austinshin/LeagueLibrary',
  },
  {
    id: 'chase-budget-dashboard',
    title: 'Chase Budget Dashboard',
    period: '2026',
    description: [
      'Personal finance dashboard for budgeting workflows',
      'Built with React + TypeScript on Vite',
      'Prepared for Plaid credential integration via environment configuration',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'Finance', 'Plaid'],
    type: 'personal',
    githubUrl: 'https://github.com/austinshin/chase-budget-dashboard',
  },
  {
    id: 'handy',
    title: 'Handy (Fork)',
    period: '2026',
    description: [
      'Fork of Handy, an offline speech-to-text desktop application',
      'Cross-platform app architecture using Tauri with Rust and React/TypeScript',
      'Privacy-first transcription workflow designed to run locally',
    ],
    tags: ['Tauri', 'Rust', 'React', 'TypeScript', 'Speech-to-Text'],
    type: 'personal',
    githubUrl: 'https://github.com/austinshin/Handy',
  },
]

export const allProjects = [...professionalProjects, ...personalProjects]
