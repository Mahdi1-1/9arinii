import { Link } from 'react-router-dom';

function Home({ message }) {
  return (
    <div>
      <h1>Accueil</h1>
      <p>Bienvenue sur notre application MERN Stack!</p>
      {message && <p>Message du serveur: {message}</p>}
      
      <div className="mt-4">
        <h2>Navigation rapide</h2>
        <div className="d-flex flex-column gap-2 mt-3">
          <Link to="/users" className="btn btn-primary">
            Gestion des utilisateurs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

