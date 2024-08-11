import React, { useState } from 'react';
import api from '../api';

const CreatePlaylistModal = ({ showModal, handleModalToggle }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleCreatePlaylist = async () => {
    try {
      await api.post('/playlists/', { name, description });
      handleModalToggle(); // Cierra el modal después de la creación exitosa
    } catch (error) {
      setError('Failed to create playlist.');
    }
  };

  // Evita que el clic en el contenido del modal cierre el modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} onClick={handleModalToggle}>
      <div className="modal-dialog" onClick={handleModalContentClick}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Playlist</h5>
            <button type="button" className="btn-close" onClick={handleModalToggle}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="playlistName" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="playlistName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="playlistDescription" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="playlistDescription"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleModalToggle}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleCreatePlaylist}>Crear</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
