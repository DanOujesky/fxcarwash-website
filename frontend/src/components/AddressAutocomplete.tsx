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
  error: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  error,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<MapySuggestion[]>([]);

  const API_KEY = import.meta.env.VITE_MAPY_API_KEY as string;

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapy.cz/v1/suggest?query=${encodeURIComponent(
            value
          )}&lang=cs&apikey=${API_KEY}`
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
    <div className="relative w-full">
      <Inputlabel text="Ulice a číslo popisné"></Inputlabel>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-full bg-black p-2 text-white contactText border-2 ${
          error ? "border-red-500" : "border-transparent"
        }`}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-black  max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => selectAddress(item)}
              className="p-3 hover:bg-green-700 cursor-pointer border-2 border-white"
            >
              <div className="font-medium text-sm text-white">{item.name}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
