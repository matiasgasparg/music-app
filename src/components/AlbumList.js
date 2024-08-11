import React, { useState, useEffect } from 'react';
import { fetchAlbums } from '../api'; // Importamos la función desde api.js para obtener los álbumes con paginación
import AddAlbumModal from './AddAlbumModal'; // Modal para agregar nuevos álbumes (asegurate que la ruta sea correcta)
import defaultAlbumCover from '../Resources/assets/images/default-album.jpg'; // Imagen por defecto para álbumes sin cover
import api from '../api'; // Importamos la instancia de la API para hacer peticiones

/**
 * AlbumList
 * 
 * Este componente maneja la visualización de la lista de álbumes con soporte para paginación.
 * Además, permite agregar nuevos álbumes a través de un modal.
 * 
 * @returns {JSX.Element} Renderiza la lista de álbumes junto con la paginación y un botón para agregar nuevos álbumes.
 */
const AlbumList = () => {
  const [albums, setAlbums] = useState([]); // Estado para almacenar los álbumes cargados
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar un spinner o mensaje de "Loading..."
  const [error, setError] = useState(null); // Estado para manejar errores al cargar los álbumes
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la paginación
  const [totalPages, setTotalPages] = useState(1); // Estado para el total de páginas disponibles
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal para agregar álbumes

  /**
   * useEffect
   * 
   * Efecto que se ejecuta cada vez que cambia la página actual (`currentPage`).
   * Se encarga de cargar los álbumes correspondientes a esa página.
   */
  useEffect(() => {
    const loadAlbums = async () => {
      setLoading(true);
      setError(null); // Reiniciamos el error antes de intentar cargar los datos
      try {
        const data = await fetchAlbums(currentPage); // Llamamos a la función `fetchAlbums` de `api.js` para obtener los álbumes
        setAlbums(data.results); // Guardamos los álbumes obtenidos en el estado
        setTotalPages(Math.ceil(data.count / 10)); // Calculamos el número total de páginas basado en el número total de álbumes
      } catch (error) {
        setError('Failed to fetch albums.'); // Si ocurre un error, lo guardamos en el estado
      } finally {
        setLoading(false); // Desactivamos el estado de carga al finalizar la petición, ya sea con éxito o error
      }
    };

    loadAlbums(); // Ejecutamos la función para cargar los álbumes
  }, [currentPage]); // La dependencia es `currentPage`, así que se ejecuta cada vez que cambie la página actual

  /**
   * handlePageChange
   * 
   * Maneja el cambio de página cuando se navega por la paginación.
   * Actualiza el estado de `currentPage` solo si la nueva página es válida.
   * 
   * @param {number} newPage - Número de la nueva página a cargar.
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Actualizamos la página actual solo si está dentro del rango válido
    }
  };

  /**
   * handleModalToggle
   * 
   * Alterna la visibilidad del modal para agregar álbumes.
   */
  const handleModalToggle = () => {
    setShowModal(!showModal); // Cambiamos el estado de visibilidad del modal (true/false)
  };

  /**
   * handleAddAlbum
   * 
   * Envía los datos del nuevo álbum al servidor y actualiza la lista de álbumes.
   * 
   * @param {FormData} formData - Datos del formulario con la información del nuevo álbum.
   */
  const handleAddAlbum = async (formData) => {
    try {
      await api.post('/albums/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchAlbums(currentPage); // Volvemos a cargar los álbumes de la página actual después de agregar uno nuevo
      handleModalToggle(); // Cerramos el modal después de agregar el álbum
      alert('Álbum agregado con éxito'); // Notificamos al usuario que el álbum se agregó correctamente
    } catch (error) {
      console.error('Error agregando álbum:', error); // Mostramos el error en la consola si algo sale mal
      alert('Error agregando álbum'); // Notificamos al usuario que ocurrió un error
    }
  };

  /**
   * Renderizado Condicional
   * 
   * Muestra un mensaje de carga o un mensaje de error si es necesario.
   */
  if (loading) {
    return <div className="text-center">Loading...</div>; // Mostrar mensaje de "Loading..." mientras se cargan los álbumes
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Mostrar mensaje de error si hubo un problema al cargar los álbumes
  }

  /**
   * Render
   * 
   * Renderiza la lista de álbumes, la paginación y el botón para agregar un nuevo álbum.
   */
  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Album List</h1>
          <button className="btn btn-primary" onClick={handleModalToggle}>Agregar</button> {/* Botón para abrir el modal de agregar álbum */}
        </div>
        <ul className="list-group">
          {albums.map((album) => (
            <li key={album.id} className="list-group-item">
              <div className="d-flex align-items-center">
                <img
                  src={album.cover ? album.cover : defaultAlbumCover} // Si el álbum no tiene cover, usamos la imagen por defecto
                  alt={album.title}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{album.title}</h5> {/* Título del álbum */}
                  <small className="text-muted">Año: {album.year || 'No year available'}</small> {/* Año del álbum o mensaje por defecto */}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Paginación */}
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal para agregar álbum */}
      {showModal && (
        <AddAlbumModal
          showModal={showModal}
          handleModalToggle={handleModalToggle}
          handleAddAlbum={handleAddAlbum}
        />
      )}
    </div>
  );
};

export default AlbumList;
