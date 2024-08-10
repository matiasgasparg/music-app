import React, { useState, useEffect } from 'react';
import api from '../api';
import AddAlbumModal from './AddAlbumModal'; // Ajusta la ruta según tu estructura de carpetas
import defaultAlbumCover from '../Resources/assets/images/default-album.jpg'; // Asegúrate de tener una imagen por defecto para los álbumes

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Función para obtener la lista de álbumes
  const fetchAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/albums/?page=${currentPage}`);
      setAlbums(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching albums:', error);
      setError('Failed to fetch albums.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(); // Llama a fetchAlbums al montar el componente y al cambiar de página
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleAddAlbum = async (formData) => {
    try {
      await api.post('/albums/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Actualiza la lista de álbumes después de agregar uno nuevo
      await fetchAlbums();
      handleModalToggle(); // Cierra el modal
      alert('Álbum agregado con éxito');
    } catch (error) {
      console.error('Error agregando álbum:', error);
      alert('Error agregando álbum');
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
          <h1 className="text-center">Album List</h1>
          <button className="btn btn-primary" onClick={handleModalToggle}>Agregar</button>
        </div>
        <ul className="list-group">
          {albums.map((album) => (
            <li key={album.id} className="list-group-item">
              <div className="d-flex align-items-center">
                <img
                  src={album.cover ? album.cover : defaultAlbumCover}
                  alt={album.title}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{album.title}</h5>
                  <small className="text-muted">Año: {album.year || 'No year available'}</small>
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

      {/* Modal para agregar álbum */}
      {showModal && (
        <AddAlbumModal
          showModal={showModal}
          handleModalToggle={handleModalToggle}
          handleAddAlbum={handleAddAlbum}
        />
      )}
    </div>
  );
};

export default AlbumList;
