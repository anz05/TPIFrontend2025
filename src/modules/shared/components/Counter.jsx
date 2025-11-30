import Button from "./Button";
import Input from "./Input";
import { useState , useEffect } from "react";
import ResponsiveText from "./ResponsiveText";

function Counter(props) {
  const [count, setCount] = useState(props.initialCount || 0);
  const [hasError, setHasError] = useState(false); 

  useEffect(() => {
    props.onCountChange?.(count);
  }, [count]);

  const increase = () => {
    if (count < props.stock) setCount(count + 1);
  };

  const decrease = () => {
    if (count > 0) setCount(count - 1);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={decrease}
        disabled={count === 0}
        className="h-8 w-8 flex items-center justify-center rounded-xl border border-gray-300"
      >
        <span className="text-xl text-gray-600">−</span>
      </button>
      <input 
        type="number"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className={`
            h-8 w-10 border text-center rounded-md 
            text-base font-medium 
            ${hasError ? "border-red-500" : "border-gray-300"}
        `}
      />
      <button
        onClick={increase}
        disabled={count === props.stock}
        className="h-8 w-8 flex items-center justify-center rounded-xl border border-gray-300"
      >
        <span className="text-xl text-gray-600">+</span>
      </button>
    </div>
  );
}


export default Counter;