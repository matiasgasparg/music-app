import React, { useState, useEffect } from 'react';
import api from '../api';
import AddArtistModal from './AddArtistModal'; // Ajusta la ruta según tu estructura de carpetas
import defaultArtistImg from '../Resources/assets/images/default-artist.jpg';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/artists/?page=${currentPage}`);
        setArtists(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError('Failed to fetch artists.');
        setLoading(false);
      }
    };

    fetchArtists();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleArtistAdded = async () => {
    try {
      const response = await api.get(`/artists/?page=${currentPage}`);
      setArtists(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error('Error fetching artists after adding new artist:', error);
      setError('Failed to update artist list.');
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
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Artist List</h1>
          <button className="btn btn-primary" onClick={handleModalToggle}>Agregar</button>
        </div>
        <ul className="list-group">
          {artists.map((artist) => (
            <li key={artist.id} className="list-group-item">
              <div className="d-flex align-items-center">
                <img
                  src={artist.image ? artist.image : defaultArtistImg}
                  alt={artist.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{artist.name}</h5>
                  <small className="text-muted">{artist.bio || 'No bio available'}</small>
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

      {/* Modal para agregar artista */}
      {showModal && (
        <AddArtistModal
          showModal={showModal}
          handleModalToggle={handleModalToggle}
          handleArtistAdded={handleArtistAdded} // Pasar la función para actualizar la lista
        />
      )}
    </div>
  );
};

export default ArtistList;
