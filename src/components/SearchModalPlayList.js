import React, { useState, useEffect } from 'react';
import api from '../api';

const SearchModalPlayList = ({ showModal, handleModalToggle, handleSelectPlaylist, songId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [allPlaylists, setAllPlaylists] = useState([]); // Almacena todas las playlists para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (showModal) {
      const fetchPlaylists = async () => {
        let playlistsList = [];
        let page = 1;
        let response;

        // Obtén todas las playlists en todas las páginas
        do {
          try {
            response = await api.get(`/playlists/?page=${page}`);
            playlistsList = playlistsList.concat(response.data.results);
            page++;
          } catch (error) {
            console.error('Error fetching playlists:', error);
            break;
          }
        } while (response.data.next); // Continúa mientras haya más páginas

        setPlaylists(playlistsList);
        setAllPlaylists(playlistsList); // Almacena todas las playlists para búsqueda
      };

      fetchPlaylists();
    }
  }, [showModal]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = async (playlist) => {
    setSelectedPlaylist(playlist);
    handleModalToggle(); // Cierra el modal después de seleccionar la playlist
    alert('Canción agregada a la lista de reproducción correctamente.'); // Muestra la alerta

    // Envía la entrada a la API
    try {
      await api.post('/playlist-entries/', {
        order: 1, // Puedes ajustar esto según sea necesario
        playlist: playlist.id,
        song: songId,
      });
      handleSelectPlaylist(playlist); // Llama a la función de selección pasada como prop
    } catch (error) {
      console.error('Error al crear la entrada en la lista de reproducción:', error.response ? error.response.data : error.message);
    }
  };

  const filteredPlaylists = allPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buscar Playlist</h5>
            <button type="button" className="btn-close" onClick={handleModalToggle}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
              placeholder="Buscar playlist"
            />
            {searchTerm && (
              <ul className="list-group mt-2">
                {filteredPlaylists.length ? (
                  filteredPlaylists.map((playlist) => (
                    <li
                      key={playlist.id}
                      className={`list-group-item ${selectedPlaylist?.id === playlist.id ? 'active' : ''}`}
                      onClick={() => handleSelect(playlist)}
                    >
                      {playlist.name}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No se encontraron playlists</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalPlayList;
