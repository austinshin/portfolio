import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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

const AppLayout = () => {
  const location = useLocation()
  const isArtFlow = location.pathname.startsWith('/artflow')

  return (
    <div className="app">
      {!isArtFlow && <Navigation />}
      {!isArtFlow && <QuickLinks />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
        <Route path="/artflow" element={<ArtFlow />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
