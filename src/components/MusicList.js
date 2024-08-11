/**
 * MusicList.js
 *
 * Este componente maneja la visualización y la reproducción de una lista de canciones. Incluye la capacidad de 
 * cargar canciones desde una API, controlar la reproducción de audio, y gestionar modales para subir canciones, 
 * buscar canciones, crear listas de reproducción y agregar canciones a listas de reproducción.
 * 
 * Estados:
 * - loading (boolean): Indica si las canciones están en proceso de carga.
 * - error (string|null): Mensaje de error en caso de fallo al cargar las canciones.
 * - songs (array): Lista de canciones cargadas desde la API.
 * - currentPage (number): Página actual para la paginación de canciones.
 * - totalPages (number): Total de páginas de canciones disponibles.
 * - showUploadModal (boolean): Determina si el modal para subir canciones debe estar visible.
 * - showSearchModal (boolean): Determina si el modal para buscar canciones debe estar visible.
 * - showPlayListModal (boolean): Determina si el modal para seleccionar una lista de reproducción debe estar visible.
 * - showCreatePlayList (boolean): Determina si el modal para crear una nueva lista de reproducción debe estar visible.
 * - searchResults (array): Resultados de búsqueda de canciones.
 * - selectedSongId (number|null): ID de la canción seleccionada para agregar a una lista de reproducción.
 * - audioRef (React.RefObject): Referencia al elemento `<audio>` para controlar la reproducción.
 * - isPlaying (boolean): Indica si la canción está en reproducción.
 * - currentTime (number): Tiempo actual de la canción en reproducción.
 * - volume (number): Volumen de la reproducción de audio.
 * 
 * Funciones:
 * - fetchSongs: Carga las canciones de la API para la página actual y maneja la paginación.
 * - handlePlayPause: Controla la reproducción de la canción actual, alternando entre play y pause.
 * - handleSeekChange: Cambia el tiempo de reproducción de la canción.
 * - handleVolumeChange: Cambia el volumen de la reproducción de audio.
 * - handlePageChange: Cambia la página actual para la paginación de canciones.
 * - handleUploadModalToggle: Alterna la visibilidad del modal para subir canciones.
 * - handleSearchModalToggle: Alterna la visibilidad del modal para buscar canciones.
 * - handlePlayListModalToggle: Alterna la visibilidad del modal para seleccionar una lista de reproducción.
 * - handleCreatePlaylistToggle: Alterna la visibilidad del modal para crear una lista de reproducción.
 * - handleSearchResults: Establece los resultados de búsqueda de canciones.
 * - handleRewind: Rebobina la canción en reproducción 10 segundos.
 * - handleForward: Avanza la canción en reproducción 10 segundos.
 * - handleSelectPlaylist: Maneja la selección de una lista de reproducción.
 * - handleOpenPlayListModal: Abre el modal para agregar una canción a una lista de reproducción.
 * 
 * Ejemplo de uso:
 * <MusicList />
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UploadSongModal from './UploadSongModal';
import SearchSongModal from './SearchSongModal';
import SearchModalPlayList from './SearchModalPlayList';
import CreatePlaylistModal from './CreatePlaylist'
import api from '../api';

const MusicList = () => {
  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores durante la carga
  const [error, setError] = useState(null);
  
  // Estado para almacenar la lista de canciones
  const [songs, setSongs] = useState([]);
  
  // Estado para la página actual de canciones
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para el total de páginas de canciones
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado para controlar la visibilidad del modal de carga de canciones
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Estado para controlar la visibilidad del modal de búsqueda de canciones
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Estado para controlar la visibilidad del modal de lista de reproducción
  const [showPlayListModal, setShowPlayListModal] = useState(false);
  
  // Estado para controlar la visibilidad del modal de creación de lista de reproducción
  const [showCreatePlayList, setShowCreatePlayList] = useState(false);
  
  // Estado para almacenar los resultados de búsqueda de canciones
  const [searchResults, setSearchResults] = useState([]);
  
  // Estado para almacenar el ID de la canción seleccionada para agregar a una lista de reproducción
  const [selectedSongId, setSelectedSongId] = useState(null);
  
  // Referencia al elemento de audio para controlar la reproducción
  const audioRef = useRef(null);
  
  // Estado para controlar si una canción está en reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Estado para el tiempo actual de la canción en reproducción
  const [currentTime, setCurrentTime] = useState(0);
  
  // Estado para el volumen de la reproducción
  const [volume, setVolume] = useState(1);

  const fetchSongs = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/songs/?page=${page}`); // Solicita las canciones desde la API
      const validSongs = response.data.results.filter(song => song && song.song_file); // Filtra canciones válidas
      setSongs(validSongs); // Actualiza la lista de canciones
      setTotalPages(Math.ceil(response.data.count / 10)); // Calcula el total de páginas
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Songs:', error);
      setError('Failed to fetch Songs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs(currentPage); // Carga canciones al montar el componente o cambiar la página actual
  }, [currentPage]);

  /**
   * Controla la reproducción o pausa de una canción.
   * 
   */

  const handlePlayPause = (song) => {
    if (isPlaying && audioRef.current.src === song.song_file) {
      setIsPlaying(false);
      audioRef.current.pause(); // Pausa la canción si ya está en reproducción
    } else {
      setIsPlaying(true);
      audioRef.current.src = song.song_file; // Establece la fuente de la canción
      audioRef.current.play(); // Reproduce la canción
    }
  };
  /**
   * Maneja el cambio en el tiempo de reproducción de la canción.
   * 
   */
  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  /**
   * Maneja el cambio en el volumen de la reproducción de audio.
   * 
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  /**
   * Cambia la página actual para la paginación de canciones.
   * 
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  /**
   * Alterna la visibilidad del modal para subir canciones.
   */
  const handleUploadModalToggle = () => setShowUploadModal(!showUploadModal);
    /**
   * Alterna la visibilidad del modal para buscar canciones.
   */
  const handleSearchModalToggle = () => setShowSearchModal(!showSearchModal);
   /**
   * Alterna la visibilidad del modal para seleccionar una lista de reproducción.
   */
  const handlePlayListModalToggle = () => setShowPlayListModal(!showPlayListModal);
    /**
   * Alterna la visibilidad del modal para crear una nueva lista de reproducción.
   */
  const handleCreatePlaylistToggle= ()=>setShowCreatePlayList(!showCreatePlayList);
    /**
   * Establece los resultados de búsqueda de canciones.
   * 
   */
  const handleSearchResults = (results) => setSearchResults(results);
  /**
   * Rebobina la canción actual en reproducción 10 segundos.
   */
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
    }
  };
  /**
   * Maneja la selección de una lista de reproducción.
   * 
   */
  const handleSelectPlaylist = (playlist) => {
    console.log('Playlist seleccionada:', playlist);
    // Aquí puedes añadir la lógica para manejar la playlist seleccionada
  };

  const handleOpenPlayListModal = (songId) => {
    setSelectedSongId(songId);
    setShowPlayListModal(true);
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Music List</h1>
          <div>
            <button className="btn btn-primary me-2" onClick={handleUploadModalToggle}>Agregar</button>
            <button className="btn btn-secondary me-2" onClick={handleSearchModalToggle}>Buscar Canciones</button>
            <button className="btn btn-warning me-2" onClick={handleCreatePlaylistToggle}>Crear Playlist</button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Resultados de búsqueda o lista de canciones */}
        <ul className="list-group">
          {songs.length === 0 && !loading && (
            <li className="list-group-item">
              <div className="text-center">
                No se encontraron canciones válidas o hay un problema con el archivo.
              </div>
            </li>
          )}
          {songs.map((song) => (
            <li key={song.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  {song.cover && (
                    <img
                      src={song.cover}
                      alt={`Cover of ${song.title}`}
                      style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                  )}
                  <div>
                    <h5 className="mb-1">
                      <Link to={`/songs/${song.id}`} className="text-decoration-none">
                        {song.title}
                      </Link>
                    </h5>
                    <small className="text-muted">
                      {song.artists.join(', ')} | Album: {song.album || 'N/A'} | Year: {song.year || 'N/A'} | Duration: {song.duration ? `${song.duration} seconds` : 'N/A'}
                    </small>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handlePlayPause(song)}
                  >
                    {isPlaying && audioRef.current.src === song.song_file ? 'Pause' : 'Play'}
                  </button>
                  {isPlaying && audioRef.current.src === song.song_file && (
                    <>
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={handleRewind}
                      >
                        Rewind 10s
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={handleForward}
                      >
                        Forward 10s
                      </button>
                      <div className="d-flex flex-column mt-2">
                        <input
                          type="range"
                          min="0"
                          max={audioRef.current?.duration || 0}
                          step="0.1"
                          value={currentTime}
                          onChange={handleSeekChange}
                          className="form-range mb-2"
                          style={{ width: '200px' }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="form-range"
                          style={{ width: '100px' }}
                        />
                      </div>
                    </>
                  )}
                  <button
                    className="btn btn-outline-warning btn-sm mt-2"
                    onClick={() => handleOpenPlayListModal(song.id)}
                  >
                    Favorito!
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <nav className="mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
            </li>
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      <audio ref={audioRef} />

      <UploadSongModal showModal={showUploadModal} handleModalToggle={handleUploadModalToggle} />
      <SearchSongModal showModal={showSearchModal} handleModalToggle={handleSearchModalToggle} />
      <SearchModalPlayList showModal={showPlayListModal} handleModalToggle={handlePlayListModalToggle} songId={selectedSongId} />
      <CreatePlaylistModal showModal={showCreatePlayList} handleModalToggle={handleCreatePlaylistToggle} />
    </div>
  );
};

export default MusicList;
