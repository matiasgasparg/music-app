import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UploadSongModal from './UploadSongModal';
import SearchSongModal from './SearchSongModal';

const MusicList = () => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    fetchSongs(currentPage);
  }, [currentPage]);

  const fetchSongs = async (page) => {
    try {
      const response = await axios.get(`https://sandbox.academiadevelopers.com/harmonyhub/songs/?page=${page}`);
      setSongs(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handlePlayPause = (song) => {
    if (isPlaying && audioRef.current.src === song.song_file) {
      setIsPlaying(false);
      audioRef.current.pause();
    } else {
      setIsPlaying(true);
      audioRef.current.src = song.song_file;
      audioRef.current.play();
    }
  };

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUploadModalToggle = () => setShowUploadModal(!showUploadModal);
  const handleSearchModalToggle = () => setShowSearchModal(!showSearchModal);

  const handleSearchResults = (results) => setSearchResults(results);

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
          {songs.map((song) => (
            <li key={song.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img
                  src={song.cover || '/path/to/default-image.png'}  // Ruta a la imagen por defecto
                  alt={song.title}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                />
                <div>
                  <div>
                    <strong>{song.title}</strong>
                  </div>
                  <div>{song.album ? `Album: ${song.album}` : 'No album'}</div>
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
