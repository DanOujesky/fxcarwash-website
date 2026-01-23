type CustomCardProps = {
  number: string;
  credit: number;
  isSelected?: boolean;
  hover?: boolean;
};

function CustomCard({ number, credit, isSelected, hover }: CustomCardProps) {
  return (
    <div
      className={`flex flex-row w-full ${
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
          hover ? "text-white" : "text-black"
        } sm:px-10 pr-2`}
      >
        <div
          className={`${hover ? "" : "font-bold"}  text-[12px] sm:text-[16px]`}
        >
          ČÍSLO KARTY: <span className="font-normal ">{number}</span>
        </div>
        <div
          className={`${hover ? "" : "font-bold"}  text-[12px] sm:text-[16px]`}
        >
          KREDIT: <span className="font-normal">{credit}</span>
        </div>
      </div>
    </div>
  );
}

export default CustomCard;
