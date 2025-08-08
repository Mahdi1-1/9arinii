import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

function ResetPassword() {
  // Récupérer uniquement l'ID utilisateur depuis l'URL
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    console.log("Paramètre URL userId:", userId);
    
    // Vérifier si le paramètre est valide
    if (!userId || userId === ':userId') {
      setError('Lien de réinitialisation invalide ou expiré');
      setTokenValid(false);
      toast.error('Lien de réinitialisation invalide ou expiré');
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      toast.error('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      // Utiliser la route avec uniquement userId
      await axios.post(`${API_URL}/reset-password/${userId}`, {
        password: formData.password,
      });
      toast.success('Mot de passe réinitialisé avec succès');
      navigate('/login');
    } catch (err) {
      console.error('Erreur détaillée:', err);
      const message = err.response?.data?.message || 'Erreur lors de la réinitialisation';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center py-3" 
                 style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)' }}>
              <h2 className="mb-0">Réinitialiser le mot de passe</h2>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              {!tokenValid ? (
                <div className="text-center">
                  <p>Le lien de réinitialisation est invalide ou a expiré.</p>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Demander un nouveau lien
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                    </div>
                    <small className="form-text text-muted">
                      Le mot de passe doit contenir au moins 6 caractères.
                    </small>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Réinitialisation en cours...
                        </>
                      ) : 'Réinitialiser le mot de passe'}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/login')}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
