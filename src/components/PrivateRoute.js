/**
 * PrivateRoute.js
 * 
 * Este componente es una ruta protegida que controla el acceso a las rutas basadas en la autenticación del usuario.
 * Utiliza el contexto de autenticación para determinar si el usuario está autenticado o no.
 * 
 * Importa las siguientes librerías y componentes:
 * 
 * - React: La biblioteca principal para construir la interfaz de usuario.
 * - { Navigate }: Componente de `react-router-dom` para redirigir a otras rutas.
 * - { useAuth }: Hook personalizado que proporciona el contexto de autenticación.
 * 
 * El componente `PrivateRoute` recibe dos props principales:
 * 
 * - `component`: El componente que se debe renderizar si el usuario está autenticado.
 * - `...rest`: Otras props que se pasan al componente.
 * 
 * Funcionamiento:
 * 
 * - Usa el hook `useAuth` para obtener el estado de `currentUser` del contexto de autenticación.
 * - Si `currentUser` está presente (es decir, el usuario está autenticado), renderiza el componente especificado, pasándole las props restantes.
 * - Si `currentUser` no está presente (es decir, el usuario no está autenticado), redirige al usuario a la página de inicio de sesión (`/login`).
 * 
 * Uso:
 * - `PrivateRoute` se utiliza para proteger rutas en la aplicación, asegurando que solo los usuarios autenticados puedan acceder a ciertos componentes.
 * - Es especialmente útil para rutas que deben estar accesibles solo para usuarios que han iniciado sesión.
 * 
 * Exporta el componente `PrivateRoute` para ser usado en la configuración de rutas de la aplicación.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Obtiene el usuario actual del contexto de autenticación
  const { currentUser } = useAuth();

  // Si hay un usuario autenticado, renderiza el componente con las props restantes
  // Si no hay usuario autenticado, redirige a la página de login
  return currentUser ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
