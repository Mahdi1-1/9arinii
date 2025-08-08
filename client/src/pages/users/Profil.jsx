import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Profil.css';

const API_URL = 'http://localhost:5000/api/users';

function Profil({ isAuthenticated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        toast.error('Erreur lors du chargement du profil');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, isAuthenticated, navigate]);

  if (isLoading) return <div className="page-content">Chargement...</div>;
  if (!user) return <div className="page-content">Utilisateur non trouvé</div>;

  return (
    <div className="page-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            {user.image ? (
              <img src={user.image} alt={user.name} className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-title">
            <h2 className="profile-name">{user.name}</h2>
            <span className={`profile-role role-${user.role}`}>{user.role}</span>
          </div>
        </div>
        
        <div className="profile-body">
          <div className="profile-section">
            <h3 className="section-title">Informations personnelles</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="profile-info-item">
                <div className="info-label">Date de naissance</div>
                <div className="info-value">
                  {new Date(user.date_naissance).toLocaleDateString()}
                </div>
              </div>
              <div className="profile-info-item">
                <div className="info-label">Téléphone</div>
                <div className="info-value">{user.telephone}</div>
              </div>
              <div className="profile-info-item">
                <div className="info-label">Adresse</div>
                <div className="info-value">{user.adresse}</div>
              </div>
              <div className="profile-info-item">
                <div className="info-label">Sexe</div>
                <div className="info-value">{user.sexe === 'homme' ? 'Homme' : 'Femme'}</div>
              </div>
            </div>
          </div>
          
          {(user.role === 'enseignant' || user.role === 'parent') && (
            <div className="profile-section">
              <h3 className="section-title">Informations supplémentaires</h3>
              <div className="profile-info-grid">
                {user.role === 'enseignant' && (
                  <>
                    <div className="profile-info-item">
                      <div className="info-label">Diplôme</div>
                      <div className="info-value">{user.diplome}</div>
                    </div>
                    <div className="profile-info-item">
                      <div className="info-label">Spécialité</div>
                      <div className="info-value">{user.specialite}</div>
                    </div>
                  </>
                )}
                {(user.role === 'enseignant' || user.role === 'parent') && (
                  <div className="profile-info-item">
                    <div className="info-label">Statut</div>
                    <div className="info-value">{user.status}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="profile-actions">
            <button
              className="btn-edit-profile"
              onClick={() => navigate(`/users/edit/${user._id}`)}
            >
              Modifier le profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
