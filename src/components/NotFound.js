import React from 'react';
import { Link } from './Link';

const NotFound = () => {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, '404 - This is NOT fine'),
    React.createElement('img', {
      src: 'https://midu.dev/images/this-is-fine-404.gif',
      alt: 'This is NOT Fine Matias'
    }),
    React.createElement(Link, { to: '/' }, 'Volver al inicio')
  );
};

export default NotFound;
