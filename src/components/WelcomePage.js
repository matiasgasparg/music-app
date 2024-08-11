import React, { useEffect, useState, useRef } from 'react';
import { fetchSongById } from '../api'; // Importar la función para obtener la canción por ID
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import '../CSS/WelcomePage.css'; // Importar estilos personalizados para la WelcomePage
import { useAuth } from '../contexts/AuthContext'; // Importar el contexto de autenticación
import { Link } from 'react-router-dom'; // Importar Link para la navegación
import manImage from '../Resources/assets/images/man.png'; // Importar imagen para la WelcomePage

/**
 * Componente de la página de bienvenida.
 * 
 * Muestra una página de bienvenida con un reproductor de audio y un botón de login.
 * 
 * El reproductor de audio permite reproducir, pausar, adelantar y retroceder una canción específica.
 * Si el usuario no está autenticado, se muestra un botón de login.
 * 
 * @returns {JSX.Element} El componente WelcomePage.
 */
const WelcomePage = () => {
  const [song, setSong] = useState(null); // Estado para almacenar la canción obtenida
  const { currentUser } = useAuth(); // Obtener el usuario actual desde el contexto de autenticación
  const [currentSong, setCurrentSong] = useState(null); // Estado para la canción actualmente en reproducción
  const [volume, setVolume] = useState(1); // Estado para el volumen del audio
  const [currentTime, setCurrentTime] = useState(0); // Tiempo actual del audio
  const [duration, setDuration] = useState(0); // Duración total del audio
  const audioRef = useRef(null); // Referencia al elemento de audio

  /**
   * Efecto que se ejecuta al montar el componente.
   * Obtiene una canción específica por ID y la almacena en el estado.
   */
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

  /**
   * Efecto que se ejecuta cada vez que cambia la referencia del audio.
   * Actualiza el tiempo actual y la duración del audio en el estado.
   */
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

  /**
   * Maneja el clic en el botón de reproducción.
   * Reproduce o pausa la canción actual dependiendo de su estado.
   */
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

  /**
   * Maneja el clic en el botón de rebobinado.
   * Rebobina el audio 10 segundos.
   */
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  /**
   * Maneja el clic en el botón de avance.
   * Avanza el audio 10 segundos.
   */
  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  /**
   * Maneja el cambio en el control de volumen.
   * Ajusta el volumen del audio.
   * 
   * @param {Object} e - Evento del cambio en el control de volumen.
   */
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  /**
   * Maneja el cambio en el control de búsqueda.
   * Ajusta el tiempo actual del audio basado en la búsqueda.
   * 
   * @param {Object} e - Evento del cambio en el control de búsqueda.
   */
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
