import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import Profile from './components/Profile';
import MusicList from './components/MusicList';
import SongDetail from './components/SongDetail';
import ArtistList from './components/ArtistList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute component={Profile} />} />
          <Route path="/songs/:id" element={<SongDetail />} />
          <Route path="/songs" element={<MusicList />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route exact path="/" element={<MusicList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
