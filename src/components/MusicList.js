import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import UploadSongModal from './UploadSongModal';
import SearchSongModal from './SearchSongModal'; // Importa el nuevo modal de búsqueda
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/MusicList.css';

const MusicList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // Estado para el modal de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/songs/?page=${currentPage}`);
        setSongs(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to fetch songs.');
        setLoading(false);
      }
    };

    fetchSongs();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePlayClick = (song) => {
    if (currentSong === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentSong(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audioElement = new Audio(song.song_file);

      audioElement.volume = volume;
      audioElement.play()
        .then(() => {
          audioRef.current = audioElement;
          setCurrentSong(song.id);
        })
        .catch((error) => {
          console.error('Failed to play song:', error);
          alert('Canción Inválida');
        });
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleUploadModalToggle = () => {
    setShowUploadModal(!showUploadModal);
  };

  const handleSearchModalToggle = () => {
    setShowSearchModal(!showSearchModal);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Music List</h1>
          <button className="btn btn-primary" onClick={handleUploadModalToggle}>Agregar</button>
        </div>

        {/* Botón para abrir el modal de búsqueda */}
        <button className="btn btn-secondary mb-3" onClick={handleSearchModalToggle}>Buscar Canciones</button>

        {/* Resultados de búsqueda o lista de canciones */}
        <ul className="list-group">
          {searchResults.length > 0 ? (
            searchResults.map((song) => (
              <li key={song.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      <Link to={`/songs/${song.id}`} className="text-decoration-none">
                        {song.title}
                      </Link>
                    </h5>
                    <small className="text-muted">
                      {song.artists.join(', ')} | Year: {song.year || 'N/A'} | Duration: {song.duration ? `${song.duration} seconds` : 'N/A'}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handlePlayClick(song)}
                    >
                      {currentSong === song.id ? 'Pause' : 'Play'}
                    </button>
                    {currentSong === song.id && (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={handleRewind}
                        >
                          Rewind 10s
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="form-range"
                          style={{ width: '100px', display: 'inline-block', verticalAlign: 'middle' }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            songs.map((song) => (
              <li key={song.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      <Link to={`/songs/${song.id}`} className="text-decoration-none">
                        {song.title}
                      </Link>
                    </h5>
                    <small className="text-muted">
                      {song.artists.join(', ')} | Year: {song.year || 'N/A'} | Duration: {song.duration ? `${song.duration} seconds` : 'N/A'}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handlePlayClick(song)}
                    >
                      {currentSong === song.id ? 'Pause' : 'Play'}
                    </button>
                    {currentSong === song.id && (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={handleRewind}
                        >
                          Rewind 10s
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="form-range"
                          style={{ width: '100px', display: 'inline-block', verticalAlign: 'middle' }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mostrar el modal de carga de canciones */}
      <UploadSongModal showModal={showUploadModal} handleModalToggle={handleUploadModalToggle} />

      {/* Mostrar el modal de búsqueda */}
      <SearchSongModal
        showModal={showSearchModal}
        handleModalToggle={handleSearchModalToggle}
        setSearchResults={handleSearchResults} // Pasamos la función para actualizar los resultados de búsqueda
      />
    </div>
  );
};

export default MusicList;
