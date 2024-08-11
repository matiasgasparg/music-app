/**
 * SearchModalPlayList.js
 *
 * Este componente representa un modal para buscar y seleccionar listas de reproducción (playlists). Permite al
 * usuario buscar playlists por nombre y seleccionar una para agregar una canción a esa lista. La selección de la
 * playlist también envía una entrada a la API.
 *
 * Props:
 * - `showModal` (boolean): Determina si el modal debe estar visible o no.
 * - `handleModalToggle` (function): Función para alternar la visibilidad del modal.
 * - `handleSelectPlaylist` (function): Función que se llama cuando se selecciona una playlist.
 * - `songId` (number): ID de la canción que se desea agregar a la playlist.
 *
 * Estado:
 * - `playlists` (array): Lista de playlists cargadas desde la API.
 * - `allPlaylists` (array): Lista completa de playlists para realizar búsquedas.
 * - `searchTerm` (string): Término de búsqueda para filtrar las playlists.
 * - `selectedPlaylist` (object|null): Playlist actualmente seleccionada.
 * - `loading` (boolean): Estado que indica si se están cargando las playlists.
 *
 * Efectos secundarios:
 * - `useEffect`: Carga todas las playlists desde la API cuando el modal se muestra (`showModal` es `true`).
 *
 * Funciones:
 * - `fetchPlaylists`: Obtiene todas las playlists desde la API, manejando la paginación.
 * - `handleSearchChange`: Actualiza el término de búsqueda.
 * - `handleSelect`: Maneja la selección de una playlist, cierra el modal y envía la entrada a la API.
 * - `filteredPlaylists`: Filtra las playlists basadas en el término de búsqueda.
 *
 * Ejemplo de uso:
 * <SearchModalPlayList
 *   showModal={true}
 *   handleModalToggle={() => {}}
 *   handleSelectPlaylist={(playlist) => {}}
 *   songId={123}
 * />
 */

import React, { useState, useEffect } from 'react';
import api from '../api';

const SearchModalPlayList = ({ showModal, handleModalToggle, handleSelectPlaylist, songId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [allPlaylists, setAllPlaylists] = useState([]); // Almacena todas las playlists para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    if (showModal) {
      const fetchPlaylists = async () => {
        setLoading(true); // Inicia la carga
        console.log('ID DE LA CANCION DENTRO DEL MODAL:', songId); // Verifica que la ID se pasa correctamente

        let playlistsList = [];
        let page = 1;
        let response;

        // Obtén todas las playlists en todas las páginas
        do {
          try {
            response = await api.get(`/playlists/?page=${page}`);
            playlistsList = playlistsList.concat(response.data.results);
            page++;
          } catch (error) {
            console.error('Error fetching playlists:', error);
            break;
          }
        } while (response.data.next); // Continúa mientras haya más páginas

        setPlaylists(playlistsList);
        setAllPlaylists(playlistsList); // Almacena todas las playlists para búsqueda
        setLoading(false); // Termina la carga
      };

      fetchPlaylists();
    }
  }, [showModal]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = async (playlist) => {
    setSelectedPlaylist(playlist);
    handleModalToggle(); // Cierra el modal después de seleccionar la playlist
    alert('Canción agregada a la lista de reproducción correctamente.'); // Muestra la alerta

    // Envía la entrada a la API
    try {
      await api.post('/playlist-entries/', {
        order: 1, // Puedes ajustar esto según sea necesario
        playlist: playlist.id,
        song: songId,
      });
      handleSelectPlaylist(playlist); // Llama a la función de selección pasada como prop
    } catch (error) {
      console.error('Error al crear la entrada en la lista de reproducción:', error.response ? error.response.data : error.message);
    }
  };

  const filteredPlaylists = allPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buscar Playlist</h5>
            <button type="button" className="btn-close" onClick={handleModalToggle}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="form-control"
                  placeholder="Buscar playlist"
                />
                {searchTerm && (
                  <ul className="list-group mt-2">
                    {filteredPlaylists.length ? (
                      filteredPlaylists.map((playlist) => (
                        <li
                          key={playlist.id}
                          className={`list-group-item ${selectedPlaylist?.id === playlist.id ? 'active' : ''}`}
                          onClick={() => handleSelect(playlist)}
                        >
                          {playlist.name}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No se encontraron playlists</li>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalPlayList;
