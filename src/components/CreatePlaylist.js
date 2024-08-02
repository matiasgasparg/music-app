import React, { useState } from 'react';
import api from '../api';
import { useHistory } from 'react-router-dom';

const CreatePlaylist = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const history = useHistory();

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await api.post('/playlists/', { name, description });
      history.push('/');
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div>
      <h1>Create Playlist</h1>
      <form onSubmit={handleCreate}>
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
