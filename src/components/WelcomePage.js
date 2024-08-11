import React, { useEffect, useState, useRef } from 'react';
import { fetchSongById } from '../api'; // Importar la nueva función
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/WelcomePage.css';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import manImage from '../Resources/assets/images/man.png';

const WelcomePage = () => {
  const [song, setSong] = useState(null);
  const { currentUser } = useAuth(); 
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0); // Tiempo actual
  const [duration, setDuration] = useState(0); // Duración total
  const audioRef = useRef(null);

  useEffect(() => {
    const getSongById = async () => {
      try {
        const songId = 581; // ID de la canción específica
        const fetchedSong = await fetchSongById(songId);
        console.log('Fetched song:', fetchedSong);
        setSong(fetchedSong);
      } catch (error) {
        console.error('Error fetching song by ID:', error);
      }
    };

    getSongById();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      const updateCurrentTime = () => {
        setCurrentTime(audioElement.currentTime);
        setDuration(audioElement.duration);
      };

      audioElement.addEventListener('timeupdate', updateCurrentTime);

      return () => {
        audioElement.removeEventListener('timeupdate', updateCurrentTime);
      };
    }
  }, [audioRef.current]);

  const handlePlayClick = () => {
    if (currentSong) {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentSong(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audioElement = new Audio(song.song_file);
      audioRef.current = audioElement;
      audioElement.volume = volume;
      audioElement.play()
        .then(() => {
          setCurrentSong(song.title);
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

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-4 text-center">
          <img src={manImage} alt="Radio Espantoso" className="img-fluid" />
        </div>

        <div className="col-md-8">
          <div className="card player-container mt-4">
            <div className="card-body">
              <h1 className="text-center card-title">Welcome to Radio Espantoso!</h1>
              {song ? (
                <div>
                  {song.song_file ? (
                    <div className="d-flex flex-column align-items-center">
                      <button
                        className={`btn btn-outline-primary play-button ${currentSong ? 'playing' : ''}`}
                        onClick={handlePlayClick}
                      >
                        {currentSong ? 'Pause' : 'Play'}
                      </button>
                      {currentSong && (
                        <>
                          <div className="d-flex mt-3">
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
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(currentTime / duration) * 100 || 0}
                            onChange={handleSeek}
                            className="form-range mt-3"
                            style={{ width: '100%' }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="form-range mt-3"
                            style={{ width: '100px' }}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <p>No audio file available for this song.</p>
                  )}
                </div>
              ) : (
                <p>Loading song...</p>
              )}
            </div>
          </div>

          {/* Card de Login */}
          {!currentUser && (
            <div className="card login-card mt-4">
              <div className="card-body text-center">
                <h4>Logueate para navegar!</h4>
                <Link to="/login" className="btn btn-primary btn-lg mt-3">Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
