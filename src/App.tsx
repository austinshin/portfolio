import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import About from './pages/About'
import Resume from './pages/Resume'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import GamingAchievements from './pages/GamingAchievements'
import Socials from './pages/Socials'

// Single-page scroller home
const HomePage = () => {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="timeline">
        <Timeline />
      </div>
      <div id="about">
        <About />
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
