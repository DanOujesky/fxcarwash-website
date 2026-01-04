import React from "react";
import type { ChangeEvent, MouseEvent } from "react";

interface QuantityInputProps {
  value: number;
  onChange: (val: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ value, onChange }) => {
  const min = 1;
  const max = 100;

  const increment = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);

    if (isNaN(newValue)) {
      onChange(1);
      return;
    }

    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center  bg-white w-fit">
        <button
          onClick={decrement}
          disabled={value <= min}
          className="px-4 py-2 text-black hover:bg-gray-600 bg-gray-500 disabled:opacity-30 transition-colors"
        >
          −
        </button>

        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="w-16 bg-transparent text-center text-black contactText focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          onClick={increment}
          disabled={value >= max}
          className="px-4 py-2 text-black hover:bg-gray-600 bg-gray-500  disabled:opacity-30 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
