import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './Navbar.css';

// Configuration des liens basée sur les rôles
const NAV_LINKS = {
  common: [
    { to: '/', label: 'Accueil', icon: 'bi-house-fill' },
    { to: '/about', label: 'À propos', icon: 'bi-info-circle-fill' },
  ],
  authenticated: {
    student: [
      { to: '/courses', label: 'Mes cours', icon: 'bi-book-fill' },
      { to: '/quizzes', label: 'Quiz', icon: 'bi-question-circle-fill' },
    ],
    teacher: [
      { to: '/courses', label: 'Mes cours', icon: 'bi-book-fill' },
      { to: '/quizzes/create', label: 'Créer un quiz', icon: 'bi-pencil-square' },
    ],
    admin: [
      { to: '/users', label: 'Utilisateurs', icon: 'bi-people-fill' },
      { to: '/courses/manage', label: 'Gérer les cours', icon: 'bi-gear-fill' },
    ],
  },
};

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Charger les infos utilisateur depuis localStorage au montage
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Fonction de déconnexion avec gestion d'erreurs
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Nettoyer localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Mettre à jour l'état
      setIsAuthenticated(false);
      setUser(null);

      // Notification avec react-toastify
      toast.success('Déconnexion réussie');

      // Rediriger
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Déterminer les liens en fonction du rôle
  const role = user?.role || 'student'; // Par défaut, étudiant
  const authLinks = isAuthenticated ? NAV_LINKS.authenticated[role] || [] : [];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top" aria-label="Barre de navigation principale">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" aria-label="Retour à l'accueil">
          <i className="bi bi-mortarboard-fill me-2 fs-4"></i>
          <span className="fw-bold">9arinii</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Ouvrir le menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {NAV_LINKS.common.map((link) => (
              <li key={link.to} className="nav-item">
                <Link
                  className={`nav-link d-flex align-items-center ${isActive(link.to) ? 'active fw-bold' : ''}`}
                  to={link.to}
                >
                  <i className={`bi ${link.icon} me-1`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
            {isAuthenticated &&
              authLinks.map((link) => (
                <li key={link.to} className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center ${isActive(link.to) ? 'active fw-bold' : ''}`}
                    to={link.to}
                  >
                    <i className={`bi ${link.icon} me-1`}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-label={`Menu de ${user?.name || user?.email || 'Mon compte'}`}
                >
                  <i className="bi bi-person-circle me-1 fs-5"></i>
                  <span>{user?.name || user?.email || 'Mon compte'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" to={`/users/${user?.id}`}>
                      <i className="bi bi-person-badge me-2"></i>
                      Mon profil
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center text-danger"
                      onClick={handleLogout}
                      disabled={isLoading}
                      aria-label="Se déconnecter"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Déconnexion...
                        </>
                      ) : 'Déconnexion'}
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link d-flex align-items-center ${isActive('/login') ? 'active fw-bold' : ''}`} to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link d-flex align-items-center ${isActive('/inscription') ? 'active fw-bold' : ''}`} to="/inscription">
                    <i className="bi bi-person-plus-fill me-1"></i>
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Navbar; 