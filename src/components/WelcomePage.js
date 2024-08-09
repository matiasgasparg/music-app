import React, { useEffect, useState } from 'react';
import { fetchRandomSong } from '../api'; // Asegúrate de que esta función devuelva la canción correcta
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/WelcomePage.css';

const WelcomePage = () => {
  const [song, setSong] = useState(null);

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
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center">Welcome to Music App</h1>
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
      </div>
    </div>
  );
};

export default WelcomePage;
