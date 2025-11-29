import React from 'react';
import CardTitle from './CardTitle';
import CardContent from './CardContent';
import CardActions from './CardActions';

function StructuredCard({ title, content, actions, className }) {
  return (
    <div className={`bg-white border border-gray-300 p-4 rounded-xl ${className}`}>
      {/* Pasa el contenido específico al componente correcto */}
      {title && <CardTitle>{title}</CardTitle> }
      <CardContent>{content}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </div>
  );
};

export default StructuredCard;
