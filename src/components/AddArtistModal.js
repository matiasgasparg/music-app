/**
 * AddArtistModal
 * 
 * Este componente renderiza un modal para agregar un nuevo artista. Permite al usuario 
 * ingresar los detalles del artista, como nombre, biografía, página web e imagen. 
 * Al enviar el formulario, los datos se envían a la API para crear un nuevo artista.
 * 
 * Props:
 * - showModal (boolean): Controla la visibilidad del modal.
 * - handleModalToggle (function): Función que se llama para abrir o cerrar el modal.
 * - handleArtistAdded (function): Función que se llama después de agregar un artista 
 *   exitosamente para actualizar la lista de artistas o realizar cualquier otra acción.
 * 
 * Estados:
 * - artist (object): Contiene los campos del formulario que representan los detalles 
 *   del artista a agregar. Incluye `name`, `bio`, `website`, e `image`.
 * - error (string|null): Contiene un mensaje de error si ocurre algún problema al agregar el artista.
 * - successMessage (string|null): Contiene un mensaje de éxito si el artista se agrega correctamente.
 * 
 * Métodos:
 * - handleChange: Maneja los cambios en los campos de texto y actualiza el estado `artist`.
 * - handleFileChange: Maneja la selección de archivos y actualiza el campo `image` en el estado `artist`.
 * - handleSubmit: Envía el formulario para agregar un nuevo artista. Maneja la solicitud 
 *   a la API y actualiza los estados `error` y `successMessage` según el resultado.
 * 
 * Consideraciones:
 * - El modal se muestra solo si `showModal` es true.
 * - Después de agregar un artista con éxito, se muestra un mensaje de éxito durante un breve período antes de cerrar el modal.
 * - Si hay un error al agregar el artista, se muestra un mensaje de error.
 * - Asegúrate de que la ruta para importar `api` sea correcta y que la estructura de la API se ajuste a la implementación.
 */

import React, { useState } from 'react';
import api from '../api'; // Asegúrate de que esta ruta sea correcta

const AddArtistModal = ({ showModal, handleModalToggle, handleArtistAdded }) => {
  // Definimos el estado inicial del formulario para el artista
  const [artist, setArtist] = useState({
    name: '', // Nombre del artista
    bio: '', // Biografía del artista
    website: '', // Página web del artista
    image: null, // Imagen del artista
  });

  const [error, setError] = useState(null); // Estado para manejar los errores
  const [successMessage, setSuccessMessage] = useState(null); // Estado para manejar el mensaje de éxito

  // Función para manejar los cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtist({ ...artist, [name]: value });
  };

  // Función para manejar la selección de archivos (imagen)
  const handleFileChange = (e) => {
    setArtist({ ...artist, image: e.target.files[0] });
  };

  // Función para manejar el envío del formulario
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
      setSuccessMessage('Artista agregado con éxito'); // Mensaje de éxito
      setError(null); // Limpiamos errores previos
      handleArtistAdded(); // Actualizamos la lista de artistas
      setTimeout(() => {
        handleModalToggle(); // Cerramos el modal después de un breve momento
      }, 1000);
    } catch (error) {
      console.error('Error adding artist:', error);
      setError('Error agregando artista'); // Manejamos errores
    }
  };

  // Si el modal no debe mostrarse, retornamos null
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
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Muestra el mensaje de éxito */}
            {error && <div className="alert alert-danger">{error}</div>} {/* Muestra el mensaje de error */}
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
