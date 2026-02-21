import { useState } from "react";

type CustomCardProps = {
  number: string;
  credit: number;
  isSelected?: boolean;
  hover?: boolean;
  status: number;
};

function CustomCard({
  number,
  credit,
  isSelected,
  hover,
  status,
}: CustomCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const toggleCardStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/nayax/toggleCardStatus/${number}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to toggle card status: ${response.statusText}`);
      }
      setCurrentStatus((prev) => (prev === 1 ? 2 : 1));
    } catch (error) {
      console.error("Error toggling card status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`flex flex-row w-full relative ${
        hover && !isSelected
          ? "hover:bg-[#5f5f5f] bg-[#555555]"
          : "bg-[#555555]"
      } ${isSelected ? "bg-green-500" : ""}`}
    >
      <div className="relative w-23 p-4 sm:w-30 sm:p-5 h-auto">
        <img src="/icons/card.jpg" className="w-full h-full"></img>
        <div className="absolute bottom-5 right-6 sm:bottom-6 sm:right-7 contactText text-[11px] sm:text-[12px]">
          {number}
        </div>
      </div>
      <div
        className={`flex-1 flex flex-col justify-center ${
          hover ? "text-white" : "text-white"
        } sm:px-10 pr-2`}
      >
        <div className={`  text-[12px] sm:text-[16px]`}>
          ČÍSLO KARTY: <span className="font-normal ">{number}</span>
        </div>
        <div className={`  text-[12px] sm:text-[16px]`}>
          KREDIT: <span className="font-normal">{credit}</span>
        </div>
      </div>
      <button
        onClick={toggleCardStatus}
        className={`absolute right-1 bottom-1 ${currentStatus === 1 ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}  pt-[7px] pb-[3px] px-2 rounded-xl text-sm flex items-center`}
      >
        {currentStatus === 1
          ? isLoading
            ? "Zablokování..."
            : "Zablokovat"
          : isLoading
            ? "Odblokování..."
            : "Odblokovat"}
      </button>
    </div>
  );
}

export default CustomCard;
