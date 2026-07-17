import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import SectionPage from './pages/SectionPage'
import PostPage from './pages/PostPage'
import AiTools from './pages/AiTools'
import YtLectureSummary from './pages/YtLectureSummary'
import DocsSummary from './pages/DocsSummary'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import ArtFlow from './pages/ArtFlow'
import TcgDashboard from './pages/TcgDashboard'
import Dev from './pages/Dev'

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
          <Route path="/resume" element={<Resume />} />

          <Route path="/blog" element={<SectionPage section="blog" title="Blog" display="links" />} />
          <Route path="/blog/:slug" element={<PostPage section="blog" backLabel="Blog" />} />

          <Route path="/notes" element={<SectionPage section="notes" title="Notes" display="links" />} />
          <Route path="/notes/:slug" element={<PostPage section="notes" backLabel="Notes" />} />

          <Route
            path="/read"
            element={
              <SectionPage
                section="read"
                title="Read"
                display="inline"
                emptyMessage="Books I've finished will show up here."
              />
            }
          />
          <Route
            path="/reading"
            element={
              <SectionPage
                section="reading"
                title="Currently Reading"
                display="inline"
                emptyMessage="What I'm reading right now will show up here."
              />
            }
          />
          <Route
            path="/food"
            element={
              <SectionPage
                section="food"
                title="Food"
                display="inline"
                emptyMessage="Favorite spots and dishes will show up here."
              />
            }
          />

          <Route path="/ai-tools" element={<AiTools />} />
          <Route path="/yt-lecture-summary" element={<YtLectureSummary />} />
          <Route path="/docs-summary" element={<DocsSummary />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
