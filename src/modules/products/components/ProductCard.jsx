import React, { useState } from 'react';
import Button from './../../shared/components/Button'; 
import Card from './../../shared/components/Card'; 

function ProductCard(props) {
  const [count, setCount] = useState(0);

    const increase = () => {
    if (count < props.stock) {
      setCount(count + 1);
    }
  };

  const decrease = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };
  return(
    <Card className='mt-4 flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-sm'>
      <div
        className='flex justify-center items-center bg-gray-100 p-4'>
        <img src={props.image} alt="producto" width="200" />
      </div>
      {props.name} 
      <div className='flex justify-between'>
        ${props.currentUnitPrice}
        <button 
          className='h-7 w-7 rounded-2xl'
          onClick={decrease}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        </button>
        <div className='border-gray-200 border-1 h-7 w-7 rounded-2xl flex justify-center items-center'>
          {count}
        </div>
        <button 
          className='h-7 w-7 rounded-2xl'
          onClick={increase}>
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g></svg>
        </button>
        <Button>Agregar</Button>
        </div>  
        {count === props.stock && (
          <p className="text-red-500 text-sm">No hay más stock disponible</p>
        )}
    </Card>
  )

}

export default ProductCard;