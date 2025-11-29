import React, { useState } from 'react';
import Button from './../../shared/components/Button'; 
import Card from './../../shared/components/Card'; 
import Counter from '../../shared/components/Counter';

function ProductCard(props) {
  const [count, setCount] = useState(0);

  //   const increase = () => {
  //   if (count < props.stock) {
  //     setCount(count + 1);
  //   }
  // };

  // const decrease = () => {
  //   if (count > 0) {
  //     setCount(count - 1);
  //   }
  // };
  return(
    <Card className='mt-4 flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-sm'>
      <div
        className='flex justify-center items-center bg-gray-100 p-4'>
        <img src={props.image} alt="producto" width="200" />
      </div>
      {props.name} 
      <div className='flex justify-between flex-wrap'>
        ${props.currentUnitPrice}
        <div className='flex items-center flex-row justify-between'>
          <Counter stock={props.stock} />
          <Button>Agregar</Button>
        </div>
      </div>  
      {count === props.stock && (
        <p className="text-red-500 text-sm">No hay más stock disponible</p>
      )}
    </Card>
  )

}

export default ProductCard;