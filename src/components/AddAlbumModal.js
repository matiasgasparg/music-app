import React, { useState, useEffect } from 'react';
import api from '../api';
import AddArtistModal from './AddArtistModal';

const AddAlbumModal = ({ showModal, handleModalToggle, handleAddAlbum }) => {
  const [album, setAlbum] = useState({
    title: '',
    year: '',
    cover: null,
    artist: '', // ID del artista
  });

  const [artists, setArtists] = useState([]);
  const [allArtists, setAllArtists] = useState([]); // Almacena todos los artistas para búsqueda
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null); // Para la previsualización de la imagen

  useEffect(() => {
    const fetchArtists = async () => {
      let artistsList = [];
      let page = 1;
      let response;

      // Obtén todos los artistas en todas las páginas
      do {
        try {
          response = await api.get(`/artists/?page=${page}`);
          artistsList = artistsList.concat(response.data.results);
          page++;
        } catch (error) {
          console.error('Error fetching artists:', error);
          break;
        }
      } while (response.data.next); // Continúa mientras haya más páginas

      setArtists(artistsList);
      setAllArtists(artistsList); // Almacena todos los artistas para búsqueda
    };

    fetchArtists();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAlbum({ ...album, cover: file });
    setCoverPreview(URL.createObjectURL(file)); // Crear URL para previsualización
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', album.title);
    formData.append('year', album.year);
    formData.append('artist', album.artist);
    if (album.cover) {
      formData.append('cover', album.cover);
    }

    handleAddAlbum(formData);
  };

  const handleArtistModalToggle = () => {
    setShowArtistModal(!showArtistModal);
  };

  const handleSelectArtist = (artist) => {
    setAlbum({ ...album, artist: artist.id });
    setSelectedArtist(artist); // Actualiza el artista seleccionado
    setSearchTerm(artist.name); // Muestra el nombre del artista en el campo de búsqueda
  };

  const filteredArtists = allArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Álbum</h5>
            <button type="button" className="btn-close" onClick={handleModalToggle}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  name="title"
                  value={album.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Año</label>
                <input
                  type="number"
                  name="year"
                  value={album.year}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Portada</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control"
                />
                {coverPreview && (
                  <div className="mt-2">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Artista</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="form-control"
                  placeholder="Buscar artista"
                />
                {searchTerm && (
                  <ul className="list-group mt-2">
                    {filteredArtists.length ? (
                      filteredArtists.map((artist) => (
                        <li
                          key={artist.id}
                          className="list-group-item"
                          onClick={() => handleSelectArtist(artist)}
                        >
                          {artist.name}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No se encontraron artistas</li>
                    )}
                  </ul>
                )}
                <button type="button" className="btn btn-secondary mt-2" onClick={handleArtistModalToggle}>
                  Agregar Artista
                </button>
              </div>
              <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
          </div>
        </div>
      </div>
      {showArtistModal && (
        <AddArtistModal
          showModal={showArtistModal}
          handleModalToggle={handleArtistModalToggle}
          handleAddArtist={(newArtist) => {
            setAllArtists([...allArtists, newArtist]); // Actualiza todos los artistas para la búsqueda
            setAlbum({ ...album, artist: newArtist.id });
            setSelectedArtist(newArtist); // Actualiza el artista seleccionado
            setSearchTerm(newArtist.name); // Muestra el nombre del artista en el campo de búsqueda
            handleArtistModalToggle();
          }}
        />
      )}
    </div>
  );
};

export default AddAlbumModal;
