/**
 * SearchSongModal.js
 *
 * Este componente representa un modal para buscar canciones y seleccionar una para agregarla a una lista de reproducción. 
 * Permite al usuario buscar canciones por título, seleccionar una canción, reproducirla, y luego abrir un modal para 
 * seleccionar una lista de reproducción a la cual agregar la canción seleccionada.
 *
 * Props:
 * - `showModal` (boolean): Determina si el modal debe estar visible o no.
 * - `handleModalToggle` (function): Función para alternar la visibilidad del modal.
 *
 * Estado:
 * - `searchTerm` (string): Término de búsqueda para filtrar las canciones.
 * - `songs` (array): Lista de canciones cargadas desde la API.
 * - `allSongs` (array): Lista completa de canciones para realizar búsquedas.
 * - `selectedSong` (object|null): Canción actualmente seleccionada.
 * - `loading` (boolean): Estado que indica si se están cargando las canciones.
 * - `showPlaylistModal` (boolean): Determina si el modal de listas de reproducción debe estar visible o no.
 *
 * Efectos secundarios:
 * - `useEffect`: Carga todas las canciones desde la API cuando el modal se muestra (`showModal` es `true`).
 *
 * Funciones:
 * - `fetchSongs`: Obtiene todas las canciones desde la API, manejando la paginación.
 * - `handleSearchChange`: Actualiza el término de búsqueda.
 * - `onSongSelect`: Maneja la selección de una canción y muestra el botón para agregar a la lista de reproducción.
 * - `handleOpenPlaylistModal`: Abre el modal de listas de reproducción si se ha seleccionado una canción.
 * - `handleClosePlaylistModal`: Cierra el modal de listas de reproducción.
 * - `handleSelectPlaylist`: Función que se llama cuando se selecciona una lista de reproducción.
 * - `filteredSongs`: Filtra las canciones basadas en el término de búsqueda.
 *
 * Ejemplo de uso:
 * <SearchSongModal
 *   showModal={true}
 *   handleModalToggle={() => {}}
 * />
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import SearchModalPlaylist from './SearchModalPlayList'; // Importa el modal de playlists

const SearchSongModal = ({ showModal, handleModalToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      const fetchSongs = async () => {
        setLoading(true); // Inicia la carga
        let songsList = [];
        let page = 1;
        let response;

        try {
          do {
            response = await api.get(`/songs/?page=${page}`);
            console.log('API response:', response.data); // Verifica que la API devuelve la ID de la canción
            songsList = songsList.concat(response.data.results);
            page++;
          } while (response.data.next);
        } catch (error) {
          console.error('Error fetching songs:', error);
        } finally {
          setSongs(songsList);
          setAllSongs(songsList);
          setLoading(false); // Termina la carga
        }
      };

      fetchSongs();
    }
  }, [showModal]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSongSelect = (song) => {
    console.log('Selected song:', song); // Verifica que el objeto canción tiene la ID
    setSelectedSong(song); // Almacena toda la información de la canción seleccionada, incluyendo el ID
    setSearchTerm(''); // Borra el término de búsqueda
  };

  const handleOpenPlaylistModal = () => {
    if (selectedSong && selectedSong.id) {
      console.log('Opening playlist modal with selected song ID:', selectedSong.id); // Verifica el ID
      setShowPlaylistModal(true);
    } else {
      console.error('No se ha seleccionado una canción o la canción no tiene un ID.');
    }
  };

  const handleClosePlaylistModal = () => {
    setShowPlaylistModal(false); // Cierra el modal de playlists
  };

  const handleSelectPlaylist = (playlist) => {
    console.log('Playlist seleccionada:', playlist);
    // Aquí puedes añadir la lógica para manejar la playlist seleccionada
  };

  const filteredSongs = allSongs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buscar Canción</h5>
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
              <div className="mb-3">
                <label className="form-label">Buscar canción</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="form-control"
                  placeholder="Ingresar título de la canción"
                />
                {searchTerm && (
                  <ul className="list-group mt-2">
                    {filteredSongs.length ? (
                      filteredSongs.map((song) => (
                        <li
                          key={song.id}
                          className="list-group-item"
                          onClick={() => onSongSelect(song)}
                        >
                          {song.title}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No se encontraron canciones</li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {/* Reproductor de audio que se muestra cuando se selecciona una canción */}
            {selectedSong && (
              <div className="mt-3 d-flex align-items-center">
                <div>
                  <h6>Reproduciendo: {selectedSong.title}</h6>
                  <audio controls src={selectedSong.song_file}>
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
                <button
                  type="button"
                  className="btn btn-primary ms-3"
                  onClick={handleOpenPlaylistModal}
                >
                  Agregar a Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para buscar y seleccionar playlist */}
      {showPlaylistModal && (
        <SearchModalPlaylist
          showModal={showPlaylistModal}
          handleModalToggle={handleClosePlaylistModal}
          handleSelectPlaylist={handleSelectPlaylist}
          songId={selectedSong?.id} // Solo pasar la ID
        />
      )}
    </div>
  );
};

export default SearchSongModal;
