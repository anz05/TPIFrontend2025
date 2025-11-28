import React from 'react';
import Card from './Card';
import Button from './Button';

function CardContent({ props }) {
  return (
    <Card key={props.key} className="flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold">{props.header}</h1>
        <p className="text-sm text-gray-500 mt-1">{props.description}</p>
      </div>
      <Button className='flex-shrink-0 px-3 py-1 text-sm'>{props.button}</Button>
    </Card>
  );
};

export default CardContent;
