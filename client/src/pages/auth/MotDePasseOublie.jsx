import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

function MotDePasseOublie() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      toast.success(response.data.message);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la demande';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="user-form-container">
        <h2 className="user-form-title">Mot de passe oublié</h2>
        <p className="text-muted">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby="email-error"
            />
            {error && <div id="email-error" className="form-error">{error}</div>}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MotDePasseOublie;