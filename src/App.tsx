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
import TcgDashboard from './pages/TcgDashboard'

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
  const hideChrome = ['/artflow', '/tcg'].some((path) => location.pathname.startsWith(path))

  return (
    <div className="app">
      {!hideChrome && <Navigation />}
      {!hideChrome && <QuickLinks />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
        <Route path="/artflow" element={<ArtFlow />} />
        <Route path="/tcg" element={<TcgDashboard />} />
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
