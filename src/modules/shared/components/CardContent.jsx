import React from 'react';
import Card from './Card';
import Button from './Button';

function CardContent({ children}) {
  return (
    <div>
      {children}
      {/* <p className="text-sm text-gray-500 mt-1">{props.text}</p> */}
    </div>
  );
};

export default CardContent;
