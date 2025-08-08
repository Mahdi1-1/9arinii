import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Composant pour le bouton de soumission avec état de chargement
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      className="btn btn-primary w-100" 
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Envoi en cours...
        </>
      ) : 'Réinitialiser le mot de passe'}
    </button>
  );
}

function ForgotPassword() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setSuccess(false);
      
      // Validation basique
      if (!email) {
        setError('Veuillez entrer votre adresse email');
        return;
      }
      
      // Appel API pour demander la réinitialisation
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      
      // Afficher le message de succès
      setSuccess(true);
      toast.success(response.data.message || 'Instructions envoyées! Vérifiez votre boîte de réception.');
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      
      if (err.response && err.response.status === 404) {
        setError('Aucun compte associé à cette adresse email');
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue');
      }
      
      toast.error(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center py-3" 
                 style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)' }}>
              <h2 className="mb-0">Mot de passe oublié</h2>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              {success ? (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <p>Un email contenant les instructions pour réinitialiser votre mot de passe a été envoyé à l'adresse indiquée.</p>
                  <p className="mb-0">Veuillez vérifier votre boîte de réception et suivre les instructions.</p>
                  <p className="mt-3">Redirection vers la page de connexion...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <p>Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope-fill"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2 mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                    >
                      Réinitialiser le mot de passe
                    </button>
                  </div>
                </form>
              )}
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  <Link to="/login" className="text-primary">
                    <i className="bi bi-arrow-left me-1"></i> Retour à la connexion
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
