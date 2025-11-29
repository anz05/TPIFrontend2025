import React from 'react';
import Card from './Card';
import Button from './Button';

function CardTitle({ children }) {
  return (
    <div>
        <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
};

export default CardTitle;
