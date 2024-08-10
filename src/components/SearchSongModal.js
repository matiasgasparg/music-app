import React, { useState, useEffect } from 'react';
import api from '../api';

const SearchSongModal = ({ showModal, handleModalToggle, handleSelectSong }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      let songsList = [];
      let page = 1;
      let response;

      do {
        try {
          response = await api.get(`/songs/?page=${page}`);
          songsList = songsList.concat(response.data.results);
          page++;
        } catch (error) {
          console.error('Error fetching songs:', error);
          break;
        }
      } while (response.data.next);

      setSongs(songsList);
      setAllSongs(songsList);
    };

    fetchSongs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSongSelect = (song) => {
    setSelectedSong(song);
    if (handleSelectSong) {
      handleSelectSong(song); // Llama a la función pasada por el padre, si existe
    }
    setSearchTerm(''); // Borra el término de búsqueda
  };

  const filteredSongs = allSongs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buscar Canción</h5>
            <button type="button" className="btn-close" onClick={handleModalToggle}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Buscar canción</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
                placeholder="Ingresar título de la canción"
              />
              {searchTerm && (
                <ul className="list-group mt-2">
                  {filteredSongs.length ? (
                    filteredSongs.map((song) => (
                      <li
                        key={song.id}
                        className="list-group-item"
                        onClick={() => onSongSelect(song)}
                      >
                        {song.title}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No se encontraron canciones</li>
                  )}
                </ul>
              )}
            </div>

            {/* Reproductor de audio que se muestra cuando se selecciona una canción */}
            {selectedSong && (
              <div className="mt-3">
                <h6>Reproduciendo: {selectedSong.title}</h6>
                <audio controls src={selectedSong.song_file}>
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSongModal;
