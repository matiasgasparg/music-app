/**
 * CreatePlaylistModal.js
 *
 * Este componente representa un modal para crear una nueva lista de reproducción. Permite al usuario ingresar 
 * el nombre y la descripción de la lista de reproducción, y maneja la creación de la lista a través de una 
 * solicitud POST a la API. El modal se controla mediante el estado `showModal`, que determina si debe ser visible o no.
 * 
 * Props:
 * - showModal (boolean): Determina si el modal debe ser visible o no.
 * - handleModalToggle (function): Función para alternar la visibilidad del modal.
 * 
 * Estado:
 * - name (string): Nombre de la lista de reproducción que el usuario ingresa.
 * - description (string): Descripción de la lista de reproducción que el usuario ingresa.
 * - error (string|null): Mensaje de error en caso de que falle la creación de la lista de reproducción.
 * 
 * Funciones principales:
 * - handleCreatePlaylist: Envía una solicitud POST a la API para crear una nueva lista de reproducción y maneja
 *   el estado del modal en función del resultado de la solicitud.
 * - handleModalContentClick: Evita que el clic en el contenido del modal cierre el modal.
 * 
 * Ejemplo de uso:
 * <CreatePlaylistModal
 *   showModal={showModal}
 *   handleModalToggle={handleModalToggle}
 * />
 */

import React, { useState } from 'react';
import api from '../api'; // Importa el cliente API configurado

const CreatePlaylistModal = ({ showModal, handleModalToggle }) => {
  // Estado para el nombre de la lista de reproducción
  const [name, setName] = useState('');
  
  // Estado para la descripción de la lista de reproducción
  const [description, setDescription] = useState('');
  
  // Estado para manejar errores durante la creación de la lista de reproducción
  const [error, setError] = useState(null);

  /**
   * Maneja la creación de la lista de reproducción.
   * Envía una solicitud POST a la API para crear la lista con el nombre y descripción proporcionados.
   * 
   * @async
   */
  const handleCreatePlaylist = async () => {
    try {
      await api.post('/playlists/', { name, description }); // Envía la solicitud a la API
      handleModalToggle(); // Cierra el modal después de una creación exitosa
    } catch (error) {
      setError('Failed to create playlist.'); // Establece el mensaje de error si la solicitud falla
    }
  };

  /**
   * Evita que el clic en el contenido del modal cierre el modal.
   * 
   * @param {React.MouseEvent} e - Evento de clic.
   */
  const handleModalContentClick = (e) => {
    e.stopPropagation(); // Previene el cierre del modal al hacer clic en su contenido
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
