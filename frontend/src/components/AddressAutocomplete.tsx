import React, { useState } from "react";
import type { ChangeEvent } from "react";
import Inputlabel from "./InputLabel";

interface MapySuggestion {
  name: string;
  zip?: string;
  location?: string;
  label?: string;
}

interface AddressAutocompleteProps {
  onAddressSelect?: (address: MapySuggestion) => void;
  error?: boolean;
  initialValue?: string;
  white?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  error,
  initialValue,
  white,
}) => {
  const [inputValue, setInputValue] = useState<string>(initialValue || "");
  const [suggestions, setSuggestions] = useState<MapySuggestion[]>([]);

  const API_KEY = import.meta.env.VITE_MAPY_API_KEY as string;

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapy.cz/v1/suggest?query=${encodeURIComponent(
            value,
          )}&lang=cs&apikey=${API_KEY}`,
        );
        const data = await response.json();
        setSuggestions(data.items || []);
      } catch (error) {
        console.error("Chyba při načítání adres:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectAddress = (item: MapySuggestion) => {
    setInputValue(item.name);
    setSuggestions([]);

    if (onAddressSelect) {
      onAddressSelect(item);
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      <Inputlabel white={white} text="Ulice a číslo popisné" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`input-field input-white-field ${
          error ? "border-red-500" : "border-transparent"
        }`}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full top-full mt-1 bg-white shadow-xl rounded-md max-h-60 overflow-y-auto border border-gray-200">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => selectAddress(item)}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none transition-colors"
            >
              <div className="font-medium text-sm text-black">{item.name}</div>
              {item.label && (
                <div className="text-xs text-gray-500">{item.label}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AddressAutocomplete;
