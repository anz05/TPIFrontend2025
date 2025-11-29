import React from 'react';
import Card from './Card';
import Button from './Button';

function CardActions({ children }) {
  return (
    <div>
      {children}
      {/* <Button className='flex-shrink-0 px-3 py-1 text-sm'>{props.button}</Button> */}
    </div>    
  );
};

export default CardActions;
