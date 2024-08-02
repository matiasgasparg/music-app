import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams, useHistory } from 'react-router-dom';

const EditPlaylist = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await api.get(`/playlists/${id}/`);
        setName(response.data.name);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/playlists/${id}/`, { name, description });
      history.push(`/playlists/${id}`);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  return (
    <div>
      <h1>Edit Playlist</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPlaylist;
