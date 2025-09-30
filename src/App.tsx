import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './pages/About'
import Resume from './pages/Resume'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import GamingAchievements from './pages/GamingAchievements'
import Socials from './pages/Socials'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
          <Route path="/gaming" element={<GamingAchievements />} />
          <Route path="/socials" element={<Socials />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
