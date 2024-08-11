/**
 * AddAlbumModal.js
 *
 * Este componente representa un modal que permite al usuario agregar un nuevo álbum a través de un formulario. 
 * El modal permite al usuario ingresar un título, un año, seleccionar una portada y asignar un artista al álbum.
 * También se proporciona la funcionalidad para buscar artistas existentes o agregar uno nuevo si no se encuentra 
 * el artista deseado en la lista.

 * Props:
 * - showModal (boolean): Indica si el modal está visible o no.
 * - handleModalToggle (function): Función que se invoca para abrir o cerrar el modal.
 * - handleAddAlbum (function): Función que se invoca al enviar el formulario para agregar un nuevo álbum.
 * 
 * State:
 * - album (object): Objeto que contiene la información del álbum, incluyendo título, año, portada y el ID del artista.
 * - artists (array): Lista de artistas obtenida de la API, utilizada para mostrar los resultados de búsqueda.
 * - allArtists (array): Lista completa de artistas, utilizada para realizar las búsquedas.
 * - showArtistModal (boolean): Controla la visibilidad del modal para agregar un nuevo artista.
 * - searchTerm (string): Término de búsqueda ingresado por el usuario para filtrar la lista de artistas.
 * - selectedArtist (object): Almacena el artista seleccionado por el usuario para asociarlo con el álbum.
 * - coverPreview (string): URL de la imagen seleccionada para la portada del álbum, utilizada para previsualizar la imagen.
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import AddArtistModal from './AddArtistModal';

const AddAlbumModal = ({ showModal, handleModalToggle, handleAddAlbum }) => {
  // Estado para almacenar los datos del álbum
  const [album, setAlbum] = useState({
    title: '',      // Título del álbum
    year: '',       // Año de lanzamiento del álbum
    cover: null,    // Archivo de imagen de la portada
    artist: '',     // ID del artista asociado al álbum
  });

  // Lista de artistas obtenida desde la API
  const [artists, setArtists] = useState([]);
  
  // Almacena todos los artistas para la búsqueda
  const [allArtists, setAllArtists] = useState([]);
  
  // Estado para controlar la visibilidad del modal de agregar artista
  const [showArtistModal, setShowArtistModal] = useState(false);
  
  // Estado para almacenar el término de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm] = useState('');
  
  // Artista seleccionado para el álbum
  const [selectedArtist, setSelectedArtist] = useState(null);
  
  // URL de previsualización de la imagen de portada
  const [coverPreview, setCoverPreview] = useState(null);

  // useEffect para obtener la lista de artistas cuando el componente se monta
  useEffect(() => {
    const fetchArtists = async () => {
      let artistsList = [];  // Almacena la lista acumulada de artistas
      let page = 1;          // Contador de páginas para la paginación de la API
      let response;

      // Bucle para obtener todos los artistas a través de las páginas de la API
      do {
        try {
          response = await api.get(`/artists/?page=${page}`);
          artistsList = artistsList.concat(response.data.results);  // Concatenar resultados de cada página
          page++;
        } catch (error) {
          console.error('Error fetching artists:', error);  // Manejo de error en la obtención de artistas
          break;
        }
      } while (response.data.next); // Continúa mientras haya más páginas disponibles

      setArtists(artistsList);      // Almacena la lista de artistas para mostrar
      setAllArtists(artistsList);   // Almacena todos los artistas para búsqueda
    };

    fetchArtists();
  }, []);

  /**
   * Maneja los cambios en los campos del formulario.
   * Actualiza el estado del álbum según el campo modificado.
   * 
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
  };

  /**
   * Maneja el cambio del archivo de portada seleccionado.
   * Actualiza el estado del álbum con el archivo seleccionado y genera una URL para previsualización.
   * 
   * @param {Event} e - El evento del cambio en el input del archivo.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAlbum({ ...album, cover: file });
    setCoverPreview(URL.createObjectURL(file)); // Crear URL para previsualización de la imagen seleccionada
  };

  /**
   * Maneja el cambio en el campo de búsqueda.
   * Actualiza el término de búsqueda ingresado por el usuario.
   * 
   * @param {Event} e - El evento del cambio en el input de búsqueda.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Maneja el envío del formulario para agregar un nuevo álbum.
   * Crea un objeto FormData con los datos del álbum y lo envía mediante la función handleAddAlbum.
   * 
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', album.title);
    formData.append('year', album.year);
    formData.append('artist', album.artist);
    if (album.cover) {
      formData.append('cover', album.cover);  // Agrega el archivo de portada solo si ha sido seleccionado
    }

    handleAddAlbum(formData); // Envía los datos del álbum a la función manejadora pasada por props
  };

  /**
   * Alterna la visibilidad del modal para agregar un nuevo artista.
   */
  const handleArtistModalToggle = () => {
    setShowArtistModal(!showArtistModal);
  };

  /**
   * Maneja la selección de un artista desde la lista filtrada.
   * Actualiza el estado del álbum con el ID del artista seleccionado y muestra su nombre en el campo de búsqueda.
   * 
   * @param {object} artist - El objeto artista seleccionado.
   */
  const handleSelectArtist = (artist) => {
    setAlbum({ ...album, artist: artist.id });
    setSelectedArtist(artist); // Actualiza el artista seleccionado
    setSearchTerm(artist.name); // Muestra el nombre del artista en el campo de búsqueda
  };

  // Filtra la lista de artistas según el término de búsqueda ingresado por el usuario
  const filteredArtists = allArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si el modal no está visible, no renderiza nada
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
