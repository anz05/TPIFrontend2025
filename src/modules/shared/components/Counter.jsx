import Button from "./Button";
import Input from "./Input";
import { useState } from "react";

function Counter(props) {
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

  const reset = () => {
    setCount(0);
  }
const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 0) {
      setCount(0); 
    } else if (value > props.stock) {
      setCount(props.stock);
    } else {
      setCount(value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        className='h-7 w-7 rounded-2xl'
        onClick={decrease}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
          </svg>
      </button>
      <input 
        type="number"
        value={count}
        onChange={handleInputChange}
        min="0"
        max={props.stock} 
        className="border-gray-200 border text-center h-7 w-12 rounded-lg" >
      </input>
      <button 
        className='h-7 w-7 rounded-2xl'
        onClick={increase}>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g>
          </svg>
      </button>
      {props.activeReset && <Button className="ml-4" onClick={reset}>Borrar</Button>}
    </div> 
  );
};

export default Counter;
