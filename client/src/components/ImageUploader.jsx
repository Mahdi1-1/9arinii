import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './ImageUploader.css';

function ImageUploader({ currentImage, onImageChange }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Fonction pour convertir l'image en base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Validation du type de fichier
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG ou GIF.');
      return false;
    }
    
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Taille maximale: 5MB');
      return false;
    }
    
    setError('');
    return true;
  };

  // Gestion du changement de fichier
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (validateFile(file)) {
      try {
        const base64 = await convertToBase64(file);
        setPreviewUrl(base64);
        onImageChange(base64);
      } catch (err) {
        setError('Erreur lors du traitement de l\'image');
        console.error('Erreur de conversion:', err);
      }
    }
  };

  // Gestion du clic sur le bouton
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Gestion du glisser-déposer
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (validateFile(file)) {
      try {
        const base64 = await convertToBase64(file);
        setPreviewUrl(base64);
        onImageChange(base64);
      } catch (err) {
        setError('Erreur lors du traitement de l\'image');
        console.error('Erreur de conversion:', err);
      }
    }
  };

  return (
    <div className="image-uploader-container">
      <div 
        className={`image-upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Aperçu" />
            <button 
              type="button" 
              className="change-image-btn"
              onClick={handleButtonClick}
            >
              <i className="bi bi-arrow-repeat"></i> Changer
            </button>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={handleButtonClick}>
            <i className="bi bi-cloud-arrow-up-fill"></i>
            <p>Cliquez ou glissez une image ici</p>
            <span>JPG, PNG ou GIF (max. 5MB)</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif"
          className="file-input"
        />
      </div>
      {error && <div className="image-upload-error">{error}</div>}
    </div>
  );
}

ImageUploader.propTypes = {
  currentImage: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
};

export default ImageUploader;
