import { useState } from "react";

type CustomCardProps = {
  number: string;
  credit: number;
  isSelected?: boolean;
  hover?: boolean;
  status?: number;
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
      className={`flex flex-row w-full ${!hover ? "pb-3 sm:pb-1" : ""} sm:pb-1 relative ${
        hover && !isSelected
          ? "hover:bg-[#5f5f5f] bg-[#555555]"
          : "bg-[#555555]"
      } ${isSelected ? "bg-green-500" : ""}`}
    >
      <div className="relative  p-4 w-30  sm:w-50 sm:p-5 sm:h-30 h-20">
        <div className="w-full h-full bg-black rounded-sm">
          <img
            src="/icons/logo_homepage.png"
            className="w-full h-full p-2 px-5 sm:p-5 sm:px-10"
          ></img>
        </div>
        <div className="absolute bottom-4 right-5 sm:bottom-6 sm:right-7 contactText text-[8px] sm:text-[12px]">
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
      {status && (
        <button
          onClick={toggleCardStatus}
          className={`absolute right-1 bottom-1 ${currentStatus === 1 ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}  pt-[5px] pb-[2px] px-2 rounded-xl sm:text-[12px] text-[10px] flex items-center`}
        >
          {currentStatus === 1
            ? isLoading
              ? "Zablokování..."
              : "Zablokovat"
            : isLoading
              ? "Odblokování..."
              : "Odblokovat"}
        </button>
      )}
    </div>
  );
}

export default CustomCard;
