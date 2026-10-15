import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import AiTools from './pages/AiTools'
import YtLectureSummary from './pages/YtLectureSummary'
import DocsSummary from './pages/DocsSummary'
import Login from './pages/Login'
import Interview from './pages/Interview'
import NotFound from './pages/NotFound'
import GamingAchievements from './pages/GamingAchievements'
import ArtFlow from './pages/ArtFlow'
import TcgDashboard from './pages/TcgDashboard'
import Dev from './pages/Dev'
import SideProjects from './pages/SideProjects'
import SideProjectPost from './pages/SideProjectPost'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Standalone tools keep their own chrome */}
        <Route path="/artflow" element={<ArtFlow />} />
        <Route path="/tcg" element={<TcgDashboard />} />
        <Route path="/dev" element={<Dev />} />

        {/* Main site inside the sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/side-projects" element={<SideProjects />} />
          <Route path="/side-projects/:slug" element={<SideProjectPost />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/gaming" element={<GamingAchievements />} />

          <Route path="/ai-tools" element={<AiTools />} />
          <Route path="/yt-lecture-summary" element={<YtLectureSummary />} />
          <Route path="/docs-summary" element={<DocsSummary />} />

          <Route path="/login" element={<Login />} />

          {/* Hidden — reachable only by direct URL */}
          <Route path="/interview" element={<Interview />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
