// CardActions.jsx
import React from 'react';

function CardActions({ children, className }) { 
  return (
    <div className={`${className}`}> 
      {children}
    </div>
  );
};

export default CardActions;
