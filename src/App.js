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
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/profile" element={<PrivateRoute component={Profile} auth={auth} />} />
        <Route path="/songs/:id" element={<PrivateRoute component={SongDetail} auth={auth} />} />
        <Route path="/songs" element={<PrivateRoute component={MusicList} auth={auth} />} />
        <Route path="/artists" element={<PrivateRoute component={ArtistList} auth={auth} />} />
        <Route path="/logout" element={<Logout setAuth={setAuth} />} />
        <Route exact path="/" element={<WelcomePage />} />
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
