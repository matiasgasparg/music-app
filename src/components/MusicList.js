import React, { useState, useEffect, useRef } from 'react';


import { Link } from 'react-router-dom';
import UploadSongModal from './UploadSongModal';
import SearchSongModal from './SearchSongModal';
import SearchModalPlayList from './SearchModalPlayList';
import CreatePlaylistModal from './CreatePlaylist'
import api from '../api';

const MusicList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPlayListModal, setShowPlayListModal] = useState(false);
  const[showCreatePlayList,setShowCreatePlayList]=useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const fetchSongs = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/songs/?page=${page}`);
      const validSongs = response.data.results.filter(song => song && song.song_file); // Filtrar canciones válidas
      setSongs(validSongs);
      setTotalPages(Math.ceil(response.data.count / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Songs:', error);
      setError('Failed to fetch Songs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs(currentPage);
  }, [currentPage]);

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
  const handlePlayListModalToggle = () => setShowPlayListModal(!showPlayListModal);
  const handleCreatePlaylistToggle= ()=>setShowCreatePlayList(!showCreatePlayList);
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
