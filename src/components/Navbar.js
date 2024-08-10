import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Navbar.css'; // Asegúrate de importar el archivo CSS
import { useAuth } from '../contexts/AuthContext';
import logo from '../Resources/assets/images/logo.png'; // Asegúrate de que la ruta al logo sea correcta

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Music App Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/songs">Songs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/artists">Artists</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AlbumList">Albums</Link>
            </li>

            {currentUser ? (
              <li className="nav-item">
                <Link className="nav-link" to="/logout">Logout</Link>
              </li>
            ) : (
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
