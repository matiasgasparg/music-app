/**
 * Componente `UploadSongModal`
 * 
 * Este componente es un modal para subir una nueva canción. Permite al usuario introducir los detalles de la canción,
 * seleccionar un álbum y artista existente, o agregar nuevos álbumes y artistas mediante modales adicionales.
 * 
 * Props:
 * - `showModal` (boolean): Determina si el modal está visible o no.
 * - `handleModalToggle` (función): Función que alterna la visibilidad del modal.
 * - `handleUploadSong` (función): Función de callback que se llama después de subir una canción.
 * 
 * Estado:
 * - `song` (objeto): Datos de la canción a subir, incluyendo título, año, álbum, artista y archivo.
 * - `albums` (array): Lista de álbumes obtenidos de la API.
 * - `artists` (array): Lista de artistas obtenidos de la API.
 * - `allAlbums` (array): Lista completa de álbumes para búsqueda.
 * - `allArtists` (array): Lista completa de artistas para búsqueda.
 * - `showArtistModal` (boolean): Determina si el modal para agregar un artista está visible.
 * - `showAlbumModal` (boolean): Determina si el modal para agregar un álbum está visible.
 * - `searchTermArtist` (string): Término de búsqueda para artistas.
 * - `searchTermAlbum` (string): Término de búsqueda para álbumes.
 * - `selectedArtist` (objeto|null): Artista seleccionado.
 * - `selectedAlbum` (objeto|null): Álbum seleccionado.
 * 
 * Efectos secundarios:
 * - Se ejecuta cuando `showModal` cambia, recuperando los artistas y álbumes disponibles.
 * 
 * Métodos:
 * - `handleChange`: Maneja cambios en los campos de texto del formulario.
 * - `handleFileChange`: Maneja la carga del archivo de canción.
 * - `handleSearchChangeArtist`: Maneja cambios en el término de búsqueda de artistas.
 * - `handleSearchChangeAlbum`: Maneja cambios en el término de búsqueda de álbumes.
 * - `handleSelectArtist`: Maneja la selección de un artista de la lista de búsqueda.
 * - `handleSelectAlbum`: Maneja la selección de un álbum de la lista de búsqueda.
 * - `assignArtistsToSong`: Asigna los artistas seleccionados a la canción subiendo datos a la API.
 * - `handleSubmit`: Maneja la presentación del formulario para subir la canción.
 * - `handleArtistModalToggle`: Alterna la visibilidad del modal de agregar artista.
 * - `handleAlbumModalToggle`: Alterna la visibilidad del modal de agregar álbum.
 * 
 * Renderiza:
 * - Un formulario para ingresar los detalles de la canción.
 * - Listas filtradas de artistas y álbumes con opciones para buscar y seleccionar.
 * - Botones para agregar nuevos álbumes y artistas.
 * - Modales adicionales para agregar álbumes y artistas.
 */
import React, { useState, useEffect } from 'react';
import api from '../api';
import AddArtistModal from './AddArtistModal';
import AddAlbumModal from './AddAlbumModal';

const UploadSongModal = ({ showModal, handleModalToggle, handleUploadSong }) => {
    const [song, setSong] = useState({
        title: '',
        year: '',
        album: '',
        artist: [],
        file: null,
    });

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [allAlbums, setAllAlbums] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [showArtistModal, setShowArtistModal] = useState(false);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [searchTermArtist, setSearchTermArtist] = useState('');
    const [searchTermAlbum, setSearchTermAlbum] = useState('');
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    useEffect(() => {
        if (showModal) {
            const fetchArtists = async () => {
                let artistsList = [];
                let page = 1;
                let response;

                try {
                    do {
                        response = await api.get(`/artists/?page=${page}`);
                        artistsList = [...artistsList, ...response.data.results];
                        page++;
                    } while (response.data.next);
                    setArtists(artistsList);
                    setAllArtists(artistsList);
                } catch (error) {
                    console.error('Error fetching artists:', error);
                }
            };

            const fetchAlbums = async () => {
                let albumsList = [];
                let page = 1;
                let response;

                try {
                    do {
                        response = await api.get(`/albums/?page=${page}`);
                        albumsList = [...albumsList, ...response.data.results];
                        page++;
                    } while (response.data.next);
                    setAlbums(albumsList);
                    setAllAlbums(albumsList);
                } catch (error) {
                    console.error('Error fetching albums:', error);
                }
            };

            fetchArtists();
            fetchAlbums();
        }
    }, [showModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSong(prevSong => ({ ...prevSong, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 3 * 1024 * 1024) { // 3MB
            setSong(prevSong => ({ ...prevSong, file }));
        } else {
            alert('El archivo debe ser menor a 3MB');
        }
    };

    const handleSearchChangeArtist = (e) => setSearchTermArtist(e.target.value);
    const handleSearchChangeAlbum = (e) => setSearchTermAlbum(e.target.value);

    const handleSelectArtist = (artist) => {
        setSong(prevSong => ({
            ...prevSong,
            artist: [...prevSong.artist, artist.id]
        }));
        setSelectedArtist(artist);
        setSearchTermArtist(artist.name);
    };

    const handleSelectAlbum = (album) => {
        setSong(prevSong => ({
            ...prevSong,
            album: album.id
        }));
        setSelectedAlbum(album);
        setSearchTermAlbum(album.title);
    };

    const assignArtistsToSong = async (songId) => {
        try {
            for (const artistId of song.artist) {
                await api.post('/song-artists/', {
                    song: songId,
                    artist: artistId,
                    role: 'Artista', // Ajusta el rol según corresponda
                });
            }
            console.log('Artistas asignados con éxito');
        } catch (error) {
            console.error('Error al asignar artistas a la canción:', error);
            alert('Error al asignar artistas a la canción');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', song.title);
        formData.append('year', song.year);
        formData.append('album', song.album);
        if (song.file) {
            formData.append('song_file', song.file);
        }

        try {
            const response = await api.post('/songs/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Canción subida con éxito:', response.data);

            // Asignar los artistas a la canción después de que se haya subido
            await assignArtistsToSong(response.data.id);

            alert('Canción subida y artistas asignados con éxito');
            setSong({
                title: '',
                year: '',
                album: '',
                artist: [],
                file: null,
            });
            handleModalToggle();
            if (handleUploadSong) handleUploadSong(response.data);
        } catch (error) {
            console.error('Error uploading song:', error);
            alert('Error al subir la canción');
        }
    };

    const handleArtistModalToggle = () => setShowArtistModal(prev => !prev);
    const handleAlbumModalToggle = () => setShowAlbumModal(prev => !prev);

    const filteredArtists = allArtists.filter(artist =>
        artist.name.toLowerCase().includes(searchTermArtist.toLowerCase())
    );

    const filteredAlbums = allAlbums.filter(album =>
        album.title.toLowerCase().includes(searchTermAlbum.toLowerCase())
    );

    if (!showModal) {
        return null;
    }

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Subir Canción</h5>
                        <button type="button" className="btn-close" onClick={handleModalToggle}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={song.title}
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
                                    value={song.year}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Álbum</label>
                                <input
                                    type="text"
                                    value={searchTermAlbum}
                                    onChange={handleSearchChangeAlbum}
                                    className="form-control"
                                    placeholder="Buscar álbum"
                                />
                                {searchTermAlbum && (
                                    <ul className="list-group mt-2">
                                        {filteredAlbums.length ? (
                                            filteredAlbums.map(album => (
                                                <li
                                                    key={album.id}
                                                    className="list-group-item"
                                                    onClick={() => handleSelectAlbum(album)}
                                                >
                                                    {album.title}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">No se encontraron álbumes</li>
                                        )}
                                    </ul>
                                )}
                                <button type="button" className="btn btn-secondary mt-2" onClick={handleAlbumModalToggle}>
                                    Agregar Álbum
                                </button>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Artista</label>
                                <input
                                    type="text"
                                    value={searchTermArtist}
                                    onChange={handleSearchChangeArtist}
                                    className="form-control"
                                    placeholder="Buscar artista"
                                />
                                {searchTermArtist && (
                                    <ul className="list-group mt-2">
                                        {filteredArtists.length ? (
                                            filteredArtists.map(artist => (
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
                            <div className="mb-3">
                                <label className="form-label">Archivo de canción (máx 3MB)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    accept="audio/*"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Subir Canción</button>
                        </form>
                    </div>
                </div>
            </div>
            {showArtistModal && <AddArtistModal showModal={showArtistModal} handleModalToggle={handleArtistModalToggle} />}
            {showAlbumModal && <AddAlbumModal showModal={showAlbumModal} handleModalToggle={handleAlbumModalToggle} />}
        </div>
    );
};

export default UploadSongModal;
