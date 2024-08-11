/**
 * Navbar.js
 *
 * Este componente muestra una barra de navegación en la aplicación. La barra de navegación incluye enlaces a
 * diferentes secciones de la aplicación y muestra el logo en la parte superior. Los enlaces y elementos de
 * navegación cambian según si el usuario está autenticado o no.
 *
 * Dependencias:
 * - `react`: Librería principal para la construcción de componentes.
 * - `react-router-dom`: Para la navegación y enlaces entre rutas.
 * - `bootstrap`: Para los estilos de la barra de navegación.
 * - `../CSS/Navbar.css`: Archivo de estilos personalizados para la barra de navegación.
 * - `../contexts/AuthContext`: Contexto de autenticación para obtener el estado del usuario.
 * - `../Resources/assets/images/logo.png`: Logo de la aplicación.
 * 
 * Contexto utilizado:
 * - `useAuth()`: Hook personalizado que proporciona el estado de autenticación del usuario.
 *
 * Ejemplo de uso:
 * <Navbar />
 */

import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Navbar.css'; // Importa el archivo CSS para estilos personalizados
import { useAuth } from '../contexts/AuthContext'; // Hook de autenticación
import logo from '../Resources/assets/images/logo.png'; // Logo de la aplicación

const Navbar = () => {
  // Obtiene el usuario actual desde el contexto de autenticación
  const { currentUser } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Enlace a la página de inicio con el logo de la aplicación */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Music App Logo" /> {/* Logo de la aplicación */}
        </Link>
        {/* Botón para alternar el menú en pantallas pequeñas */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* Enlace a la página de canciones */}
            <li className="nav-item">
              <Link className="nav-link" to="/songs">Songs</Link>
            </li>
            {/* Enlace a la página de artistas */}
            <li className="nav-item">
              <Link className="nav-link" to="/artists">Artists</Link>
            </li>
            {/* Enlace a la página de perfil */}
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            {/* Enlace a la página de álbumes */}
            <li className="nav-item">
              <Link className="nav-link" to="/AlbumList">Albums</Link>
            </li>

            {/* Enlaces condicionales basados en el estado de autenticación */}
            {currentUser ? (
              // Enlace de cierre de sesión si el usuario está autenticado
              <li className="nav-item">
                <Link className="nav-link" to="/logout">Logout</Link>
              </li>
            ) : (
              // Enlace de inicio de sesión si el usuario no está autenticado
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
