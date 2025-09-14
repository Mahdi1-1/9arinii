import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // fermer menu quand on change de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;
  const role = user?.role || 'student';
  const authLinks = isAuthenticated ? NAV_LINKS.authenticated[role] || [] : [];

  return (
    // nav fixé et full-width
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-r from-blue-500 to-green-500 shadow-md" aria-label="Barre de navigation principale">
      {/* zone centrée (le gradient reste full-width) */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link className="flex items-center text-white font-bold text-xl tracking-wide transition-transform hover:scale-105" to="/" aria-label="Retour à l'accueil">
            <i className="bi bi-mortarboard-fill mr-2 text-2xl" />
            <span>9arinii</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {NAV_LINKS.common.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 ${isActive(l.to) ? 'bg-white/20 font-semibold' : ''}`}
              >
                <i className={`bi ${l.icon} mr-2`} />
                {l.label}
              </Link>
            ))}

            {isAuthenticated &&
              authLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 ${isActive(l.to) ? 'bg-white/20 font-semibold' : ''}`}
                >
                  <i className={`bi ${l.icon} mr-2`} />
                  {l.label}
                </Link>
              ))}
          </div>

          {/* Right area: user / mobile button */}
          <div className="flex items-center space-x-2">
            {/* utilisateur (desktop) */}
            {isAuthenticated ? (
              <div className="hidden lg:block relative group">
                <button
                  className="flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                  aria-label={`Menu de ${user?.name || user?.email || 'Mon compte'}`}
                >
                  <i className="bi bi-person-circle mr-2 text-lg" />
                  <span className="max-w-[160px] truncate">{user?.name || user?.email || 'Mon compte'}</span>
                  <i className="bi bi-chevron-down ml-1 text-sm" />
                </button>

                <ul className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <li>
                    <Link className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to={`/users/${user?.id}`}>
                      <i className="bi bi-person-badge mr-2" />
                      Mon profil
                    </Link>
                  </li>
                  <li><hr className="my-1 border-gray-200" /></li>
                  <li>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      <i className="bi bi-box-arrow-right mr-2" />
                      {isLoading ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden lg:flex lg:items-center lg:space-x-2">
                <Link className={`flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors ${isActive('/login') ? 'bg-white/20' : ''}`} to="/login">
                  <i className="bi bi-box-arrow-in-right mr-1" /> Connexion
                </Link>
                <Link className={`flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors ${isActive('/inscription') ? 'bg-white/20' : ''}`} to="/inscription">
                  <i className="bi bi-person-plus-fill mr-1" /> Inscription
                </Link>
              </div>
            )}

            {/* bouton mobile (toujours affiché sur petit écrans) */}
            <button
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              type="button"
              aria-expanded={isMenuOpen}
              aria-label="Ouvrir le menu"
              onClick={() => setIsMenuOpen((s) => !s)}
            >
              <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`} />
            </button>
          </div>
        </div>

        {/* Mobile panel: full-width sous la barre (mais centré grâce au container) */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden pb-4`}>
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-b-md">
            <ul className="flex flex-col p-4 space-y-2">
              {NAV_LINKS.common.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 ${isActive(l.to) ? 'bg-white/20 font-semibold' : ''}`}
                  >
                    <i className={`bi ${l.icon} mr-2`} /> {l.label}
                  </Link>
                </li>
              ))}

              {isAuthenticated &&
                authLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={`block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 ${isActive(l.to) ? 'bg-white/20 font-semibold' : ''}`}
                    >
                      <i className={`bi ${l.icon} mr-2`} /> {l.label}
                    </Link>
                  </li>
                ))}

              <li className="pt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link className="text-white px-3 py-2 rounded-md bg-white/10" to={`/users/${user?.id}`}>
                      <i className="bi bi-person-badge mr-2" /> Mon profil
                    </Link>
                    <button onClick={handleLogout} disabled={isLoading} className="text-red-100 px-3 py-2 rounded-md bg-white/5">
                      {isLoading ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login" className="text-white px-3 py-2 rounded-md bg-white/10">Connexion</Link>
                    <Link to="/inscription" className="text-white px-3 py-2 rounded-md bg-white/10">Inscription</Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
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
