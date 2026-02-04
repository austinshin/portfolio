import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Resume from './pages/Resume'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import GamingAchievements from './pages/GamingAchievements'
import Socials from './pages/Socials'
import QuickLinks from './components/QuickLinks'
import ArtFlow from './pages/ArtFlow'

// Single-page scroller home
const HomePage = () => {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="resume">
        <Resume />
      </div>
      <div id="portfolio">
        <Portfolio />
      </div>
      <div id="gaming">
        <GamingAchievements />
      </div>
      <div id="socials">
        <Socials />
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <QuickLinks />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
          <Route path="/artflow" element={<ArtFlow />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
