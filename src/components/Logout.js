import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Importa useAuth desde el AuthContext

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Usa el hook useAuth para obtener la función logout

  useEffect(() => {
    const performLogout = async () => {
      logout(); // Llama a la función logout del contexto
      navigate('/login');
    };

    performLogout();
  }, [navigate, logout]);

  return <div>Logging out...</div>;
};

export default Logout;
