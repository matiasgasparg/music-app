import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      textAlign: 'end', 
      backgroundColor: 'black', 
      height: '150vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'top', 
      alignItems: 'center' 
      }}>
      <h1 style={{color: 'white'}}>404 - This is NOT fine</h1>
      <img src='https://midu.dev/images/this-is-fine-404.gif' alt='This is NOT Fine Matias' />
      <Link to="/songs" style={{ 
        color: 'orange', 
        marginTop: '20px' 
        }}>
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;