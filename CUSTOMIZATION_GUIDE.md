# Customization Guide 🎨

Quick reference for customizing your portfolio.

## 🎨 Colors

### Changing the Accent Color

Edit `src/index.css`:
```css
:root {
  --accent: #your-color;        /* Main accent */
  --accent-hover: #your-hover;  /* Hover state */
  --accent-light: rgba(255, 68, 68, 0.1); /* Transparent version */
}
```

### Popular Color Schemes

**Valve Red (Current):**
```css
--accent: #ff4444;
--accent-hover: #ff6666;
```

**Steam Blue:**
```css
--accent: #1b2838;
--accent-hover: #2a475e;
```

**Portal Orange:**
```css
--accent: #ff8844;
--accent-hover: #ffaa66;
```

**Half-Life Green:**
```css
--accent: #44ff44;
--accent-hover: #66ff66;
```

**Cyberpunk Neon:**
```css
--accent: #00ffff;
--accent-hover: #00cccc;
```

---

## ✏️ Content Updates

### Hero Section
**File:** `src/components/Hero.tsx`

```typescript
// Line 27-29: Main Headline
<h1>
  YOUR HEADLINE
  <br />
  <span className="highlight">EMPHASIS WORD</span>
</h1>

// Lines 32-40: Description
<p className="hero-description">
  Your compelling description here...
</p>

// Lines 49-60: Features
<div className="feature">
  <Code size={24} />
  <span>Your Feature</span>
</div>
```

### Navigation Logo
**File:** `src/components/Navigation.tsx`

```typescript
// Line 41: Your name
<motion.span>YOUR NAME</motion.span>
```

### About Page
**File:** `src/pages/About.tsx`

Four sections to customize:
1. **Background** (lines 29-34)
2. **Mission** (lines 46-52)
3. **Passion** (lines 65-69)
4. **Expertise** (lines 83-87)

**Skills** (line 100):
```typescript
['React', 'TypeScript', 'Your', 'Skills', 'Here']
```

### Resume Page
**File:** `src/pages/Resume.tsx`

```typescript
// Lines 6-25: Work Experience
const experiences = [
  {
    title: 'Your Job Title',
    company: 'Company Name',
    period: '2020 - Present',
    description: 'What you did...',
  },
  // Add more...
]

// Lines 27-34: Education
const education = [
  {
    degree: 'Your Degree',
    school: 'Your School',
    period: '2014 - 2018',
    description: 'Focus areas...',
  },
]

// Lines 36-41: Achievements
const achievements = [
  'Achievement 1',
  'Achievement 2',
  // Add more...
]
```

### Portfolio Projects
**File:** `src/pages/Portfolio.tsx`

```typescript
// Lines 6-43: Projects Array
const projects = [
  {
    title: 'Project Name',
    description: 'Description...',
    tags: ['Tech', 'Stack'],
    image: 'https://your-image-url',
    // Optional:
    github_url: 'https://github.com/...',
    demo_url: 'https://demo-url...',
  },
  // Add more...
]
```

---

## 🖼️ Images

### Project Images

**Option 1: Use Unsplash (Free)**
```
https://source.unsplash.com/800x600/?keyword
```

**Option 2: Upload to Supabase Storage**
1. Go to Supabase Dashboard → Storage
2. Create bucket called "project-images"
3. Upload images
4. Get public URL
5. Use in projects

**Option 3: Use Public Folder**
1. Add images to `public/images/`
2. Reference as `/images/filename.jpg`

### Recommended Image Sizes
- Project cards: 800x600px
- OG image: 1200x630px
- Hero background: 1920x1080px

---

## 🎭 Animations

### Adjusting Animation Speed

**Framer Motion:**
```typescript
// Slower
transition={{ duration: 1.5 }}

// Faster
transition={{ duration: 0.3 }}

// With delay
transition={{ duration: 0.8, delay: 0.5 }}
```

### Animation Types

**Fade In:**
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
```

**Slide Up:**
```typescript
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
```

**Slide Left:**
```typescript
initial={{ opacity: 0, x: -50 }}
animate={{ opacity: 1, x: 0 }}
```

**Scale:**
```typescript
initial={{ opacity: 0, scale: 0.5 }}
animate={{ opacity: 1, scale: 1 }}
```

**Hover Effects:**
```typescript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## 📱 Responsive Design

### Breakpoints

Defined in CSS:
```css
/* Mobile */
@media (max-width: 768px) {
  /* styles */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1023px) {
  /* styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* styles */
}
```

### Common Responsive Changes

**Grid Columns:**
```css
/* Desktop: 3 columns */
grid-template-columns: repeat(3, 1fr);

/* Tablet: 2 columns */
@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile: 1 column */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

**Font Sizes:**
```css
/* Desktop */
font-size: 3rem;

/* Mobile */
@media (max-width: 768px) {
  font-size: 2rem;
}
```

---

## 🔤 Typography

### Changing Fonts

**Using Google Fonts:**

1. Go to https://fonts.google.com
2. Select font
3. Copy import link
4. Add to `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@400;700&display=swap');

body {
  font-family: 'Your Font', sans-serif;
}
```

### Popular Developer Fonts
- **Inter** (Current) - Modern, clean
- **Roboto** - Classic, readable
- **Montserrat** - Bold, stylish
- **Poppins** - Geometric, friendly
- **Space Grotesk** - Technical, unique
- **JetBrains Mono** - For code blocks

---

## 🎯 Navigation

### Adding New Pages

1. **Create page component:**
```typescript
// src/pages/NewPage.tsx
import { motion } from 'framer-motion'
import './Pages.css'

const NewPage = () => {
  return (
    <div className="page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>NEW PAGE</h1>
        <div className="header-line"></div>
      </motion.div>
      
      {/* Your content */}
    </div>
  )
}

export default NewPage
```

2. **Add route in App.tsx:**
```typescript
import NewPage from './pages/NewPage'

// In Routes:
<Route path="/newpage" element={<NewPage />} />
```

3. **Add to navigation:**
```typescript
// src/components/Navigation.tsx
const navItems = [
  // ...existing items
  { path: '/newpage', label: 'NEW PAGE' },
]
```

### Removing Pages

1. Remove route from `App.tsx`
2. Remove item from `navItems` in `Navigation.tsx`
3. Delete page file from `src/pages/`

---

## 💡 Pro Tips

### Performance
- Optimize images (use WebP)
- Lazy load images
- Minimize animations on mobile
- Use CSS transforms over position changes

### Accessibility
- Add `alt` text to images
- Use semantic HTML
- Ensure good color contrast
- Test with keyboard navigation

### SEO
- Update page titles
- Add meta descriptions
- Use proper heading hierarchy
- Add structured data

### Mobile First
- Design for mobile first
- Test on real devices
- Use touch-friendly sizes (min 44x44px)
- Avoid hover-only interactions

---

## 🎨 Design Inspiration

### Valve-Inspired Design Elements

1. **Dark Theme** - Keep it dark and mysterious
2. **Orange/Red Accents** - Use sparingly for emphasis
3. **Clean Typography** - Simple, readable fonts
4. **Subtle Animations** - Professional, not distracting
5. **Grid Layouts** - Organized, systematic
6. **Hover Effects** - Interactive feedback
7. **Loading States** - Smooth transitions

### Gaming Industry Colors

- **Valve Red:** #ff4444
- **Steam Blue:** #1b2838
- **Portal Orange:** #ff8844
- **Half-Life Green:** #44ff44
- **TF2 Red:** #ff6655
- **Dota 2 Gold:** #ffaa00

---

## 🔧 Advanced Customization

### Custom Cursor
```css
body {
  cursor: url('/custom-cursor.png'), auto;
}

a:hover, button:hover {
  cursor: url('/custom-cursor-hover.png'), pointer;
}
```

### Custom Scrollbar
```css
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 6px;
}
```

### Particle Background
```bash
npm install react-particles
```

### 3D Elements
```bash
npm install @react-three/fiber @react-three/drei
```

---

## 📝 Quick Reference

### File Locations
- Colors: `src/index.css`
- Hero: `src/components/Hero.tsx`
- Nav: `src/components/Navigation.tsx`
- About: `src/pages/About.tsx`
- Resume: `src/pages/Resume.tsx`
- Portfolio: `src/pages/Portfolio.tsx`
- Contact: `src/pages/More.tsx`

### Common Tasks
- **Change colors:** `src/index.css` line 10-16
- **Update name:** `src/components/Navigation.tsx` line 41
- **Change headline:** `src/components/Hero.tsx` line 27
- **Edit skills:** `src/pages/About.tsx` line 100
- **Update projects:** `src/pages/Portfolio.tsx` line 6

---

**Happy customizing! Make it uniquely yours! 🎨**
