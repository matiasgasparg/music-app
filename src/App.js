import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import Profile from './components/Profile';
import MusicList from './components/MusicList';
import SongDetail from './components/SongDetail';
import ArtistList from './components/ArtistList';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';

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
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/logout" element={<Logout />} />
          <Route exact path="/" element={<MusicList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
