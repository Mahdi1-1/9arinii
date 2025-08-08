import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Inscription from './pages/auth/Inscription';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ListeUser from './pages/users/ListeUser';
import Profil from './pages/users/Profil';
import EditProfil from './pages/users/EditProfil';

function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="container mt-4" style={{ minHeight: "80vh", position: "relative", zIndex: "1" }}>
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:userId" element={<ResetPassword />} />
          <Route
            path="/users"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ListeUser isAuthenticated={isAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profil isAuthenticated={isAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProfil isAuthenticated={isAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<div>Accueil</div>} />
          <Route path="/about" element={<div>À propos</div>} />
        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;




