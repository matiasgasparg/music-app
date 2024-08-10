import React, { useEffect, useState } from 'react';
import { fetchRandomSong } from '../api'; // Asegúrate de que esta función devuelva la canción correcta
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/WelcomePage.css';
import { useAuth } from '../contexts/AuthContext'; // Importa useAuth para obtener el estado de autenticación
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  const [song, setSong] = useState(null);
  const { currentUser } = useAuth(); // Obtiene el usuario actual desde el contexto de autenticación

  useEffect(() => {
    const getRandomSong = async () => {
      try {
        const randomSong = await fetchRandomSong();
        console.log('Fetched song:', randomSong); // Verifica los datos recibidos
        setSong(randomSong);
      } catch (error) {
        console.error('Error fetching random song:', error);
      }
    };

    getRandomSong();
  }, []);

  return (
    <div>
      <div className="container mt-5">
        <h1 className="text-center">Welcome to Radio Espantoso!</h1>
        <div className="player-container mt-4">
          {song ? (
            <div>
              <h3>{song.title}</h3>
              {song.song_file ? (
                <audio controls>
                  <source src={song.song_file} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p>No audio file available for this song.</p>
              )}
            </div>
          ) : (
            <p>Loading random song...</p>
          )}
        </div>

        {/* Botón de login que se oculta si el usuario está autenticado */}
        {!currentUser && (
          <div className="text-center mt-4">
            <h4>Logueate para navegar!</h4>
            <Link to="/login" className="btn btn-primary btn-lg mt-2">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
