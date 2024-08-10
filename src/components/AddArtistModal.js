import React, { useState } from 'react';
import api from '../api'; // Asegúrate de que esta ruta sea correcta

const AddArtistModal = ({ showModal, handleModalToggle, handleArtistAdded }) => {
  const [artist, setArtist] = useState({
    name: '',
    bio: '',
    website: '',
    image: null,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Agrega un estado para el mensaje de éxito

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtist({ ...artist, [name]: value });
  };

  const handleFileChange = (e) => {
    setArtist({ ...artist, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('bio', artist.bio || ''); 
    formData.append('website', artist.website || ''); 
    if (artist.image) {
      formData.append('image', artist.image);
    }

    try {
      await api.post('/artists/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Artista agregado con éxito'); // Establece el mensaje de éxito
      setError(null); // Limpia cualquier error previo
      handleArtistAdded(); 
      // Espera un momento antes de cerrar el modal para que el usuario pueda ver el mensaje
      setTimeout(() => {
        handleModalToggle(); 
      }, 1000);
    } catch (error) {
      console.error('Error adding artist:', error);
      setError('Error agregando artista'); 
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Artista</h5>
            <button type="button" className="btn-close" onClick={handleModalToggle}></button>
          </div>
          <div className="modal-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Muestra el mensaje de éxito si existe */}
            {error && <div className="alert alert-danger">{error}</div>} 
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={artist.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Biografía</label>
                <textarea
                  name="bio"
                  value={artist.bio}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Página Web</label>
                <input
                  type="url"
                  name="website"
                  value={artist.website}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Imagen</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArtistModal;
