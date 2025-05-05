import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Accueil</Link>
      <Link to="/about">À propos</Link>
    </nav>
  )
}

export default Navbar
