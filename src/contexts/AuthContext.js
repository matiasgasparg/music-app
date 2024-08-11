/**
 * authcontext.js
 * 
 * Este archivo define el contexto de autenticación para la aplicación. El `AuthContext` permite compartir el estado de autenticación y funciones relacionadas con todos los componentes de la aplicación sin tener que pasar props manualmente en cada nivel del componente.
 * 
 * Importa las siguientes librerías y hooks:
 * 
 * - createContext: Crea un contexto que puede ser usado para compartir valores entre componentes.
 * - useContext: Permite a los componentes consumir el contexto creado.
 * - useState: Hook para gestionar el estado local en componentes funcionales.
 * 
 * Exporta los siguientes elementos:
 * 
 * - `useAuth`: Un hook personalizado para acceder al contexto de autenticación desde cualquier componente.
 * - `AuthProvider`: Un componente que envuelve a la aplicación y proporciona el estado y las funciones de autenticación a los componentes hijos.
 * 
 * Funciones y variables:
 * 
 * - `AuthContext`: El contexto creado que contiene la información de autenticación.
 * - `currentUser`: Estado que mantiene la información del usuario actualmente autenticado (inicialmente es `null`).
 * - `setCurrentUser`: Función para actualizar el estado `currentUser`.
 * - `login(user)`: Función para iniciar sesión. Recibe un objeto `user`, lo establece como el usuario actual, y guarda el token en el `localStorage`.
 * - `logout()`: Función para cerrar sesión. Borra la información del usuario actual y elimina el token del `localStorage`.
 * - `value`: Objeto que se pasa al `AuthContext.Provider` y contiene el estado y las funciones relacionadas con la autenticación.
 * 
 * Uso:
 * - `useAuth()`: Permite a los componentes acceder al contexto de autenticación sin necesidad de usar el componente `AuthContext.Consumer`.
 * - `AuthProvider`: Debe envolver a toda la aplicación para que los componentes puedan acceder al contexto de autenticación.
 */

import React, { createContext, useContext, useState } from 'react';

// Crea un contexto para la autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el usuario actual
  const [currentUser, setCurrentUser] = useState(null);

  // Función para iniciar sesión
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('Token', user.token);
  };

  // Función para cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    // Elimina el token del localStorage
    localStorage.removeItem('Token');
  };

  // Valor del contexto que se pasa a los componentes hijos
  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
