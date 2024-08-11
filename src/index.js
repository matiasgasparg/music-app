import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Se obtiene el elemento del DOM con el id 'root', que es el contenedor donde se renderiza la aplicación React.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Se renderiza la aplicación en el contenedor 'root'.
root.render(
  // React.StrictMode es un componente que ayuda a identificar problemas potenciales en la aplicación durante el desarrollo.
  <React.StrictMode>
    {/* AuthProvider proporciona el contexto de autenticación a toda la aplicación */}
    <AuthProvider>
      {/* App es el componente principal que contiene la estructura y lógica de la aplicación */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
