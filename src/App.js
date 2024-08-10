import React, { useState, useEffect } from 'react';
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
import WelcomePage from './components/WelcomePage'
import AlbumList from './components/AlbumList';

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(true);
    }
  }, []);

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
