import { Link } from 'react-router-dom'

const NotFound = () => (
  <>
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <p>
      <Link to="/">← Back home</Link>
    </p>
  </>
)

export default NotFound
