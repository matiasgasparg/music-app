import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await api.get(`/songs/${id}/`);
        setSong(response.data);
      } catch (error) {
        console.error('Error fetching song:', error);
      }
    };
    fetchSong();
  }, [id]);

  if (!song) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{song.title}</h1>
      <p>Artist: {song.artist}</p>
      <p>Album: {song.album}</p>
      <p>Genre: {song.genre}</p>
    </div>
  );
};

export default SongDetail;
