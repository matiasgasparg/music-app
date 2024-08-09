import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/MusicList.css';
import Navbar from './Navbar'; // Importa el componente Navbar

const MusicList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(1); // Volumen inicial al 100%
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

      audioElement.volume = volume; // Ajustar el volumen
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
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); // Retrocede 10 segundos
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <Navbar /> {/* Agrega el Navbar aquí */}
      <div className="container mt-5">
        <h1 className="text-center mb-4">Music List</h1>
        <ul className="list-group">
          {songs.map((song) => (
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
    </div>
  );
};

export default MusicList;
