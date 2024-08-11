/**
 * App.js
 * 
 * Este archivo contiene el componente principal de la aplicación `music-app`.
 * Aquí se configura la estructura de rutas y se define el comportamiento de la navegación y la autenticación en la aplicación.
 * 
 * Importa las siguientes librerías y componentes:
 * 
 * - React: La biblioteca principal para construir la interfaz de usuario.
 * - 'bootstrap/dist/css/bootstrap.min.css': Estilo de Bootstrap para diseño y componentes.
 * - { BrowserRouter as Router, Route, Routes }: Componentes de `react-router-dom` para el enrutamiento de la aplicación.
 * - { AuthProvider }: Contexto de autenticación que proporciona el estado de autenticación a la aplicación.
 * - Login, Profile, MusicList, SongDetail, ArtistList, PrivateRoute, Logout, NotFound, Navbar, WelcomePage, AlbumList: Componentes específicos de la aplicación.
 * 
 * El componente `App` envuelve toda la aplicación en el `AuthProvider` para gestionar la autenticación y usa `Router` para manejar la navegación entre diferentes páginas.
 * 
 * La estructura de rutas está configurada de la siguiente manera:
 * 
 * - `/login`: Ruta para la página de inicio de sesión. Renderiza el componente `Login`.
 * - `/profile`: Ruta para la página de perfil del usuario. Accesible solo para usuarios autenticados, renderiza el componente `Profile` envuelto en `PrivateRoute`.
 * - `/songs/:id`: Ruta para la página de detalles de una canción específica. Accesible solo para usuarios autenticados, renderiza el componente `SongDetail` envuelto en `PrivateRoute`.
 * - `/songs`: Ruta para la lista de canciones. Accesible solo para usuarios autenticados, renderiza el componente `MusicList` envuelto en `PrivateRoute`.
 * - `/artists`: Ruta para la lista de artistas. Accesible solo para usuarios autenticados, renderiza el componente `ArtistList` envuelto en `PrivateRoute`.
 * - `/logout`: Ruta para cerrar sesión. Renderiza el componente `Logout`.
 * - `/AlbumList`: Ruta para la lista de álbumes. Accesible solo para usuarios autenticados, renderiza el componente `AlbumList` envuelto en `PrivateRoute`.
 * - `/`: Ruta para la página de bienvenida. Renderiza el componente `WelcomePage`.
 * - `*`: Ruta para manejar cualquier URL que no coincida con las rutas definidas, renderiza el componente `NotFound` para mostrar una página 404.
 * 
 * Uso:
 * - `AuthProvider` proporciona el contexto de autenticación a todos los componentes de la aplicación.
 * - `Router` gestiona el enrutamiento de la aplicación.
 * - `Navbar` se muestra en todas las páginas y proporciona enlaces de navegación.
 * - `Routes` define las rutas y los componentes que se renderizan en función de la URL actual.
 * 
 * Exporta el componente `App` como el componente principal de la aplicación.
 */

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Profile from './components/Profile';
import MusicList from './components/MusicList';
import SongDetail from './components/SongDetail';
import ArtistList from './components/ArtistList';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import WelcomePage from './components/WelcomePage';
import AlbumList from './components/AlbumList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute component={Profile} />} />
          <Route path="/songs/:id" element={<PrivateRoute component={SongDetail} />} />
          <Route path="/songs" element={<PrivateRoute component={MusicList} />} />
          <Route path="/artists" element={<PrivateRoute component={ArtistList} />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/AlbumList" element={<PrivateRoute component={AlbumList} />} />
          <Route exact path="/" element={<WelcomePage />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
