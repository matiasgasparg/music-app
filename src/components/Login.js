/**
 * Login.js
 * 
 * Este archivo contiene el componente `Login` que maneja el proceso de inicio de sesión en la aplicación `music-app`.
 * 
 * El componente `Login` permite a los usuarios ingresar su nombre de usuario y contraseña para autenticarse en la aplicación.
 * 
 * Importa las siguientes librerías y componentes:
 * 
 * - React: La biblioteca principal para construir la interfaz de usuario.
 * - { useState }: Hook de React para manejar el estado en componentes funcionales.
 * - { useNavigate }: Hook de `react-router-dom` para la navegación programática.
 * - { useAuth }: Hook personalizado que proporciona acceso al contexto de autenticación.
 * - 'bootstrap/dist/css/bootstrap.min.css': Estilo de Bootstrap para diseño y componentes.
 * - '../CSS/Login.css': Estilos personalizados para la página de inicio de sesión.
 * - { login } desde api.js: Función para manejar la autenticación del usuario.
 * 
 * Estado y Funcionalidades:
 * 
 * - `username` y `password`: Variables de estado que almacenan los valores introducidos por el usuario en los campos de nombre de usuario y contraseña.
 * - `login`: Función del contexto de autenticación (`useAuth`) que permite iniciar sesión y actualizar el estado de autenticación.
 * - `navigate`: Función de `useNavigate` que permite redirigir al usuario a otras páginas una vez autenticado.
 * 
 * Manejo del Formulario:
 * 
 * - `handleSubmit`: Función que se ejecuta cuando el formulario de inicio de sesión se envía. Llama a la función `login` del API para autenticar al usuario.
 * - Si la respuesta de la API contiene un token, se llama a la función `login` con el token y se redirige al usuario a la página de inicio (`'/'`).
 * - Si no se recibe un token, se muestra una alerta indicando que el nombre de usuario o la contraseña son inválidos.
 * 
 * Renderizado:
 * 
 * - El componente renderiza un formulario de inicio de sesión con campos para el nombre de usuario y la contraseña.
 * - Incluye un botón de inicio de sesión que, al hacer clic, envía el formulario.
 * - Utiliza clases de Bootstrap para el diseño y estilos personalizados para la apariencia de la página.
 * 
 * Uso:
 * - `useState` se utiliza para manejar el estado de los campos del formulario.
 * - `useAuth` proporciona la función `login` para actualizar el estado de autenticación.
 * - `useNavigate` se utiliza para redirigir al usuario después de un inicio de sesión exitoso.
 * 
 * Exporta el componente `Login` para ser utilizado en otras partes de la aplicación.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../api'; // Importa la función `login` desde api.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await apiLogin(username, password); // Usa la función `login` de api.js
      if (token) {
        login({ token });
        navigate('/'); // Redirige al usuario a la página de inicio
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in');
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Iniciar Sesión</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
