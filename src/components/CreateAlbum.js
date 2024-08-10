import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateAlbum = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [artist, setArtist] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Convert artist to integer and handle year as integer or null
      const response = await axios.post(
        'https://sandbox.academiadevelopers.com/harmonyhub/albums/',
        {
          title,
          year: year ? parseInt(year, 10) : null,
          artist: parseInt(artist, 10),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess('Album created successfully!');
      setTitle('');
      setYear('');
      setArtist('');
    } catch (error) {
      console.error('Error creating album:', error);
      setError('Failed to create album. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Album</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="year" className="form-label">Year (optional)</label>
          <input
            type="number"
            id="year"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="artist" className="form-label">Artist</label>
          <input
            type="text"
            id="artist"
            className="form-control"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Album</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
};

export default CreateAlbum;
