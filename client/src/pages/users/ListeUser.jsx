import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

function ListeUser({ isAuthenticated }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = roleFilter ? `${API_URL}/role/${roleFilter}` : API_URL;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users || response.data);
      } catch (err) {
        toast.error('Erreur lors du chargement des utilisateurs');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, isAuthenticated, navigate]);

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      toast.success('Utilisateur supprimé avec succès');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="user-list-header">
          <h2 className="user-list-title">Liste des utilisateurs</h2>
        </div>
        <div className="user-filter-container">
          <div className="form-group">
            <label htmlFor="roleFilter" className="form-label">
              Filtrer par rôle
            </label>
            <select
              id="roleFilter"
              className="form-select"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <option value="">Tous</option>
              <option value="student">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="admin">Administrateur</option>
              <option value="parent">Parent</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="user-table">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="user-actions">
                      <button
                        className="btn btn-info"
                        onClick={() => navigate(`/users/${user._id}`)}
                      >
                        Voir
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => navigate(`/users/edit/${user._id}`)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeUser;