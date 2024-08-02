// src/components/MusicList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const MusicList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.get('/songs/');
        setSongs(response.data.results); // Accede a 'results'
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to fetch songs.');
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Music List</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <Link to={`/songs/${song.id}`}>{song.title}</Link> by {song.artists.join(', ')}
            <p>Year: {song.year || 'N/A'}</p>
            <p>Duration: {song.duration ? `${song.duration} seconds` : 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicList;
