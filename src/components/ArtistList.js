/**
 * ArtistList.js
 *
 * Este componente muestra una lista paginada de artistas obtenidos de la API. Incluye la funcionalidad para 
 * agregar nuevos artistas mediante un modal. También maneja la carga de datos, errores y la paginación de los 
 * resultados.
 * 
 * Props:
 * (No recibe props directamente, pero utiliza componentes hijos como `AddArtistModal` para manejar la adición de nuevos artistas)
 * 
 * State:
 * - artists (array): Lista de artistas obtenida de la API y mostrada en el componente.
 * - loading (boolean): Indica si los datos están en proceso de carga.
 * - error (string|null): Mensaje de error en caso de fallo al obtener los datos.
 * - currentPage (number): Página actual de artistas mostrada en la lista.
 * - totalPages (number): Total de páginas disponibles para la paginación.
 * - showModal (boolean): Controla la visibilidad del modal para agregar un nuevo artista.
 * 
 * Efectos secundarios:
 * - useEffect para obtener la lista de artistas cuando se monta el componente o cambia la página actual.
 * 
 * Funciones principales:
 * - fetchArtists: Obtiene la lista de artistas desde la API y maneja el estado de carga y errores.
 * - handlePageChange: Cambia la página actual en la paginación.
 * - handleModalToggle: Alterna la visibilidad del modal para agregar un nuevo artista.
 * - handleArtistAdded: Actualiza la lista de artistas después de agregar un nuevo artista.
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import AddArtistModal from './AddArtistModal'; // Ajusta la ruta según tu estructura de carpetas
import defaultArtistImg from '../Resources/assets/images/default-artist.jpg'; // Imagen predeterminada para artistas

const ArtistList = () => {
  // Estado para almacenar la lista de artistas
  const [artists, setArtists] = useState([]);
  
  // Estado para indicar si los datos están en carga
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores durante la carga de datos
  const [error, setError] = useState(null);
  
  // Estado para manejar la página actual en la paginación
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para manejar el total de páginas disponibles en la paginación
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado para controlar la visibilidad del modal de agregar artista
  const [showModal, setShowModal] = useState(false);

  // useEffect para obtener la lista de artistas al montar el componente o cambiar la página actual
  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true); // Establece el estado de carga
      setError(null);   // Resetea el estado de error
      
      try {
        // Solicita la lista de artistas de la API
        const response = await api.get(`/artists/?page=${currentPage}`);
        setArtists(response.data.results); // Actualiza la lista de artistas
        setTotalPages(Math.ceil(response.data.count / 10)); // Calcula el total de páginas
        setLoading(false); // Finaliza el estado de carga
      } catch (error) {
        console.error('Error fetching artists:', error); // Manejo de errores en la consola
        setError('Failed to fetch artists.'); // Establece el mensaje de error
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchArtists(); // Llama a la función para obtener los artistas
  }, [currentPage]); // Dependencia de `currentPage` para ejecutar el efecto cuando cambia la página

  /**
   * Maneja el cambio de página en la paginación.
   * 
   * @param {number} newPage - Número de la nueva página a la que cambiar.
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Cambia la página actual si está en el rango válido
    }
  };

  /**
   * Alterna la visibilidad del modal para agregar un nuevo artista.
   */
  const handleModalToggle = () => {
    setShowModal(!showModal); // Cambia el estado de visibilidad del modal
  };

  /**
   * Actualiza la lista de artistas después de agregar un nuevo artista.
   * 
   * @async
   */
  const handleArtistAdded = async () => {
    try {
      // Solicita la lista de artistas actualizada de la API
      const response = await api.get(`/artists/?page=${currentPage}`);
      setArtists(response.data.results); // Actualiza la lista de artistas
      setTotalPages(Math.ceil(response.data.count / 10)); // Recalcula el total de páginas
    } catch (error) {
      console.error('Error fetching artists after adding new artist:', error); // Manejo de errores en la consola
      setError('Failed to update artist list.'); // Establece el mensaje de error
    }
  };

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Muestra un mensaje de error si ocurre un problema al obtener los datos
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Artist List</h1>
          <button className="btn btn-primary" onClick={handleModalToggle}>Agregar</button>
        </div>
        <ul className="list-group">
          {artists.map((artist) => (
            <li key={artist.id} className="list-group-item">
              <div className="d-flex align-items-center">
                <img
                  src={artist.image ? artist.image : defaultArtistImg}
                  alt={artist.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{artist.name}</h5>
                  <small className="text-muted">{artist.bio || 'No bio available'}</small>
                </div>
              </div>
            </li>
          ))}
        </ul>

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

      {/* Modal para agregar artista */}
      {showModal && (
        <AddArtistModal
          showModal={showModal}
          handleModalToggle={handleModalToggle}
          handleArtistAdded={handleArtistAdded} // Pasar la función para actualizar la lista
        />
      )}
    </div>
  );
};

export default ArtistList;
