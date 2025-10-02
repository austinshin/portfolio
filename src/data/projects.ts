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
    title: 'GoDaddy Merchant HQ Migration',
    company: 'GoDaddy',
    period: 'Jan 2021 - May 2023',
    description: [
      'Helped refactor entire codebase from Ember to React/Redux/TypeScript',
      'Updated routing system to React Router',
      'Integrated with GoDaddy\'s design system and component library',
    ],
    tags: ['React', 'Redux', 'TypeScript', 'React Router'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
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
    company: 'GoDaddy',
    period: 'May 2018 - Jan 2021',
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
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
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
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    type: 'professional',
    demoUrl: 'https://support.poynt.com/hc/en-us/articles/1500001772841-Online-Pay-Links',
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
    title: 'Poynt Merchant HQ Dashboard',
    company: 'Poynt',
    period: 'May 2018 - Jan 2021',
    description: [
      'Built comprehensive merchant dashboard for transaction data',
      'Collaborated with design team for intuitive interface',
      'Created reporting tools for daily sales aggregation',
      'Enabled customer data management and support features',
    ],
    tags: ['Ember', 'React', 'Data Visualization', 'Dashboard', 'UI/UX'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    type: 'professional',
  },
  {
    id: 'poynt-api',
    title: 'Poynt API Service',
    company: 'Poynt',
    period: 'May 2018 - Jan 2021',
    description: [
      'Created secure API endpoints for transaction processing',
      'Handled data flow between Android devices and banking systems',
      'Implemented monitoring infrastructure with Kibana',
      'Built streaming services for error tracking and analytics',
    ],
    tags: ['Node.js', 'API', 'Redis', 'Kibana', 'Banking Integration'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
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
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
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
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    type: 'professional',
  },
]

export const personalProjects: Project[] = [
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
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
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
        caption: 'ProductivityHub dashboard interface',
      },
      {
        url: 'https://i.imgur.com/Bn7UvPB.png',
        caption: 'ProductivityHub features and widgets',
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
    tags: ['Python', 'AI', 'Automation', 'Web Scraping', 'Cron Jobs'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
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
    id: 'portfolio-site',
    title: 'Portfolio Website',
    period: 'Feb 2025',
    description: [
      'Built this professional portfolio in 1-2 days',
      'Used Cursor, Claude, and Obsidian for AI-assisted development',
      'React and TypeScript for type-safe development',
      'Framer Motion for smooth animations',
      'Supabase for backend and database',
      'Deployed on Vercel with CI/CD',
      'Demonstrates rapid AI-powered development',
    ],
    tags: ['React', 'TypeScript', 'AI-Assisted', 'Framer Motion', 'Supabase', 'Vercel'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
    type: 'personal',
    githubUrl: 'https://github.com/austinshin/portfolio',
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
]

export const allProjects = [...professionalProjects, ...personalProjects]
