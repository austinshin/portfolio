# 🎮 Austin Shin Portfolio Website

> A professional, sleek, minimalistic portfolio website for Valve Gaming Company application

## 🚀 Tech Stack

- **React 18** + **TypeScript** - Modern UI development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Supabase** - Backend & Database
- **Vercel** - Deployment platform
- **Lucide React** - Modern icons

---

## ✨ Features

- 🎨 Minimalistic dark theme design
- ✨ Smooth Framer Motion animations
- 📱 Fully responsive
- 🚀 Optimized performance
- 🎯 TypeScript type safety
- 📊 Dynamic portfolio
- 📝 Contact form with Supabase
- 🔗 Social media integration

---

## 📋 STEP-BY-STEP TODO LIST

Use this checklist to track your progress. Work through each phase sequentially.

---

### ✅ PHASE 1: Environment Setup (START HERE)

#### Task 1.1: Install Dependencies
```bash
npm install
```

#### Task 1.2: Install Additional Packages
```bash
# Form handling & validation
npm install react-hook-form zod @hookform/resolvers

# Notifications
npm install react-hot-toast

# SEO
npm install react-helmet-async

# Optional: Tailwind CSS (Highly Recommended)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Task 1.3: Create Environment Files

Create `.env` in root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=http://localhost:5173
```

Create `.env.example`:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_URL=
```

**Action:** Create these files and add `.env` to `.gitignore`

---

### 🗄️ PHASE 2: Supabase Setup

#### Task 2.1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy URL and Anon Key to `.env`

#### Task 2.2: Create Database Tables

Run in Supabase SQL Editor:

**Contact Submissions:**
```sql
create table contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table contact_submissions enable row level security;

create policy "Enable insert for all users"
on contact_submissions for insert
with check (true);
```

**Projects (Dynamic Portfolio):**
```sql
create table projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  tags text[],
  image_url text,
  github_url text,
  demo_url text,
  order_index integer default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table projects enable row level security;

create policy "Enable read access for all"
on projects for select
using (true);
```

**Analytics:**
```sql
create table page_views (
  id uuid default uuid_generate_v4() primary key,
  page_path text not null,
  referrer text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table page_views enable row level security;

create policy "Enable insert for analytics"
on page_views for insert
with check (true);
```

#### Task 2.3: Insert Sample Data
```sql
insert into projects (title, description, tags, image_url, order_index, is_featured) values
  ('Game Engine', 'Custom C++ game engine with OpenGL', ARRAY['C++', 'OpenGL', 'Graphics'], 'https://images.unsplash.com/photo-1511512578047-dfb367046420', 1, true),
  ('Multiplayer FPS', 'Competitive shooter with netcode', ARRAY['Unity', 'C#', 'Networking'], 'https://images.unsplash.com/photo-1542751371-adc38448a05e', 2, true);
```

---

### 📝 PHASE 3: Content Customization

#### Task 3.1: Personal Information

**Update Navigation (src/components/Navigation.tsx line 41):**
```typescript
YOUR NAME  →  Your Actual Name
```

**Update Hero (src/components/Hero.tsx lines 27-40):**
- Change headline
- Update description
- Modify CTA button text

**Update About Page (src/pages/About.tsx):**
- Lines 30-34: Background
- Lines 46-52: Mission  
- Lines 65-69: Passion
- Lines 83-87: Expertise
- Line 100: Your tech skills

**Update Resume (src/pages/Resume.tsx):**
- Lines 6-25: Work experience
- Lines 27-34: Education
- Lines 36-41: Achievements

#### Task 3.2: Add Resume PDF

1. Create `public` folder if needed
2. Add `public/resume.pdf`
3. Update Resume.tsx download button:
```typescript
<a href="/resume.pdf" download="YourName_Resume.pdf">
  <motion.button className="download-btn" ...>
</a>
```

#### Task 3.3: Update Portfolio Projects
Replace placeholder content in `src/pages/Portfolio.tsx` with real projects

---

### 🧩 PHASE 4: Enhanced Components

#### Task 4.1: Contact Form Hook

Create `src/hooks/useContactForm.ts`:
```typescript
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([data])

      if (error) throw error

      toast.success('Message sent! I\'ll get back to you soon.')
      return { success: true }
    } catch (error) {
      toast.error('Failed to send message. Try again.')
      return { success: false, error }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitForm, isSubmitting }
}
```

#### Task 4.2: Update More.tsx with Form Logic

Add form handling to `src/pages/More.tsx`:
```typescript
import { useContactForm } from '../hooks/useContactForm'
import { Toaster } from 'react-hot-toast'

const More = () => {
  const { submitForm, isSubmitting } = useContactForm()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    await submitForm({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    })
    
    e.currentTarget.reset()
  }

  return (
    <div className="page more-page">
      <Toaster position="top-right" />
      {/* Rest of component */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="subject" placeholder="Subject" required />
        <textarea name="message" placeholder="Message" rows={6} required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
```

#### Task 4.3: Loading Component

Create `src/components/LoadingSpinner.tsx`:
```typescript
import { motion } from 'framer-motion'

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    <motion.div
      style={{
        width: 50,
        height: 50,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%'
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

export default LoadingSpinner
```

#### Task 4.4: Analytics Hook

Create `src/hooks/usePageView.ts`:
```typescript
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export const usePageView = () => {
  const location = useLocation()

  useEffect(() => {
    supabase.from('page_views').insert([{
      page_path: location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    }])
  }, [location])
}
```

Add to App.tsx:
```typescript
import { usePageView } from './hooks/usePageView'

function App() {
  usePageView()
  // ... rest of component
}
```

#### Task 4.5: Scroll Progress Bar

Create `src/components/ScrollProgress.tsx`:
```typescript
import { motion, useScroll } from 'framer-motion'

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--accent)',
        transformOrigin: '0%',
        zIndex: 9999,
        scaleX: scrollYProgress
      }}
    />
  )
}

export default ScrollProgress
```

Add to App.tsx:
```typescript
import ScrollProgress from './components/ScrollProgress'

function App() {
  return (
    <>
      <ScrollProgress />
      <Router>...</Router>
    </>
  )
}
```

---

### 🎨 PHASE 5: Styling Enhancements

#### Task 5.1: Extended CSS Variables

Add to `src/index.css`:
```css
:root {
  --bg-primary: #0d0d0d;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #262626;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-tertiary: #707070;
  --accent: #ff4444;
  --accent-hover: #ff6666;
  --accent-light: rgba(255, 68, 68, 0.1);
  --success: #44ff44;
  --error: #ff4444;
  --border: rgba(255, 255, 255, 0.1);
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

#### Task 5.2: Custom Animations

Add to `src/index.css`:
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 68, 68, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 68, 68, 0.6); }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.gradient-text {
  background: linear-gradient(135deg, #ff4444, #ff8844);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

#### Task 5.3: Glassmorphism Effects

Create `src/styles/effects.css`:
```css
.glass-card {
  background: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.glow-on-hover {
  transition: all 0.3s ease;
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
}
```

Import in `src/main.tsx`:
```typescript
import './styles/effects.css'
```

---

### 🚀 PHASE 6: Dynamic Features

#### Task 6.1: Dynamic Portfolio Loading

Update `src/pages/Portfolio.tsx`:
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

const Portfolio = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })

    if (!error && data) {
      setProjects(data)
    }
    setLoading(false)
  }

  if (loading) return <LoadingSpinner />

  // Rest of component with dynamic projects...
}
```

#### Task 6.2: Add Valve Easter Egg (Fun Feature!)

Create `src/components/ValveEasterEgg.tsx`:
```typescript
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ValveEasterEgg = () => {
  const [show, setShow] = useState(false)
  const [sequence, setSequence] = useState('')

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setSequence(prev => (prev + e.key).slice(-5))
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    if (sequence === 'valve') {
      setShow(true)
      setTimeout(() => setShow(false), 3000)
    }
  }, [sequence])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'var(--accent)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          🎮 Half-Life 3 Confirmed? 🎮
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ValveEasterEgg
```

Add to App.tsx:
```typescript
import ValveEasterEgg from './components/ValveEasterEgg'

function App() {
  return (
    <>
      <ValveEasterEgg />
      {/* rest of app */}
    </>
  )
}
```

---

### ⚡ PHASE 7: Testing & Optimization

#### Task 7.1: Functionality Testing
- [ ] Navigate to all pages (About, Resume, Portfolio, More)
- [ ] Test mobile menu toggle
- [ ] Test navigation active states
- [ ] Submit contact form and verify in Supabase
- [ ] Test all animations

#### Task 7.2: Responsive Testing
Test on different screen sizes:
- [ ] Mobile (375px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px - 1440px)
- [ ] Large Desktop (1440px+)

#### Task 7.3: Performance Optimization
```bash
# Build and check bundle size
npm run build

# Preview production build
npm run preview
```

- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Optimize images (use WebP format)
- [ ] Check for console errors
- [ ] Test load time

#### Task 7.4: Content Review
- [ ] Check for typos and grammar
- [ ] Verify all links work
- [ ] Ensure contact info is correct
- [ ] Review project descriptions

---

### 🚢 PHASE 8: Deployment

#### Task 8.1: Prepare for Production

1. **Create production build:**
```bash
npm run build
```

2. **Test locally:**
```bash
npm run preview
```

3. **Verify everything works**

#### Task 8.2: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: GitHub + Vercel (Recommended)**
1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Valve portfolio website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (your vercel domain)
6. Click "Deploy"

#### Task 8.3: Post-Deployment
- [ ] Test deployed site
- [ ] Check all features work in production
- [ ] Verify contact form submissions
- [ ] Test on multiple devices

---

### 📈 PHASE 9: Final Polish

#### Task 9.1: SEO & Meta Tags

Add to `index.html`:
```html
<head>
  <meta name="description" content="Your Name - Portfolio for Valve Gaming Company" />
  <meta name="keywords" content="game developer, software engineer, valve, portfolio" />
  <meta property="og:title" content="Your Name - Game Developer Portfolio" />
  <meta property="og:description" content="Professional portfolio for Valve application" />
  <meta property="og:image" content="/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

#### Task 9.2: Create OG Image
- Create a 1200x630px image for social sharing
- Save as `public/og-image.png`

#### Task 9.3: Final Checklist
- [ ] All personal info updated
- [ ] Resume PDF uploaded
- [ ] All links work
- [ ] No console errors
- [ ] Mobile-friendly
- [ ] Fast load times
- [ ] Professional appearance
- [ ] Unique to you!

---

## 💡 ADDITIONAL RECOMMENDATIONS

### Must-Have Improvements:
1. **Add Image Optimization**
   - Use next-gen formats (WebP)
   - Implement lazy loading
   - Compress images

2. **Form Validation**
   - Use react-hook-form + zod
   - Add client-side validation
   - Show helpful error messages

3. **Loading States**
   - Add skeletons for loading content
   - Smooth transitions

4. **Error Boundaries**
   - Catch React errors gracefully
   - Show friendly error pages

### Nice-to-Have Features:
1. **Blog Section** - Share your dev journey
2. **Project Filters** - Filter by technology
3. **Testimonials** - Add recommendations
4. **Skills Visualization** - Interactive charts
5. **3D Elements** - Using Three.js
6. **Particle Effects** - Enhanced visuals
7. **Achievement Counter** - Animated stats
8. **Dark/Light Toggle** - (optional, dark is good for Valve)

### Modern CSS Libraries:
1. **Tailwind CSS** ⭐ Highly Recommended
2. **shadcn/ui** - Beautiful components
3. **Styled Components** - CSS-in-JS
4. **CSS Modules** - Scoped CSS (Vite supports by default)

### Security:
- Never commit `.env` file
- Use Supabase RLS properly
- Add rate limiting
- Consider adding CAPTCHA
- Enable HTTPS only

---

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development
npm run dev

# Open browser
# http://localhost:5173
```

---

## 🗂️ Project Structure

```
portfolio-website/
├── public/
│   └── resume.pdf          # Add your resume
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── LoadingSpinner.tsx   # TODO
│   │   ├── ScrollProgress.tsx    # TODO
│   │   └── ValveEasterEgg.tsx    # TODO
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Resume.tsx
│   │   ├── Portfolio.tsx
│   │   ├── More.tsx
│   │   └── Socials.tsx
│   ├── hooks/
│   │   ├── useContactForm.ts    # TODO
│   │   └── usePageView.ts       # TODO
│   ├── lib/
│   │   └── supabase.ts
│   ├── styles/
│   │   └── effects.css          # TODO
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                    # TODO: Create
├── .env.example           # TODO: Create
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

---

## 🎨 Design System

### Colors
```css
Primary:   #0d0d0d (Dark background)
Secondary: #1a1a1a (Card background)
Accent:    #ff4444 (Red - Valve inspired)
Text:      #ffffff (White)
Muted:     #a0a0a0 (Gray)
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 800 weight, tight letter-spacing
- **Body**: 400 weight, 1.6 line-height

### Spacing
- Small: 0.5rem (8px)
- Medium: 1rem (16px)
- Large: 2rem (32px)
- XL: 4rem (64px)

---

## 🔧 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🐛 Troubleshooting

### Supabase connection fails
- Verify `.env` variables
- Check Supabase project status
- Ensure RLS policies are correct

### Build errors
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check TypeScript errors

### Animations laggy
- Check browser performance
- Reduce motion complexity
- Use `will-change` CSS property

---

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Valve Developer Community](https://developer.valvesoftware.com)

---

## 📧 Next Steps

1. **Complete Phase 1-3** to get the basics running
2. **Prompt me with specific questions** as you work through each phase
3. **Test frequently** after each phase
4. **Deploy early** and iterate

### When to ask for help:
- "Help me with Task X.X"
- "I'm stuck on [specific issue]"
- "Show me code for [feature]"
- "How do I customize [component]?"

---

**Built with ❤️ for Valve Gaming Company**

*Good luck with your application! 🎮*

---

## Quick Reference

### Essential Files to Edit:
1. `.env` - Add Supabase credentials
2. `src/components/Navigation.tsx` - Your name
3. `src/components/Hero.tsx` - Headline & description
4. `src/pages/About.tsx` - Your background
5. `src/pages/Resume.tsx` - Work experience
6. `src/pages/Portfolio.tsx` - Your projects
7. `public/resume.pdf` - Your resume file

### Key Tasks:
- [ ] Phase 1: Setup environment
- [ ] Phase 2: Configure Supabase
- [ ] Phase 3: Customize content
- [ ] Phase 4: Add components
- [ ] Phase 5: Enhance styling
- [ ] Phase 6: Add features
- [ ] Phase 7: Test everything
- [ ] Phase 8: Deploy to Vercel
- [ ] Phase 9: Final polish

**You're ready to build! Start with Phase 1 and work your way through.** 🚀
