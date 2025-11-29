import React from 'react';
import Card from './Card';
import Button from './Button';

function CardContent({ children, className}) {
  return (
    <div className={`${className}`}>
      {children}
      {/* <p className="text-sm text-gray-500 mt-1">{props.text}</p> */}
    </div>
  );
};

export default CardContent;
