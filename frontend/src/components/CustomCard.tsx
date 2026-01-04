type CustomCardProps = {
  number: string;
  credit: number;
  isSelected?: boolean;
  hover?: boolean;
};

function CustomCard({ number, credit, isSelected, hover }: CustomCardProps) {
  return (
    <div
      className={`flex flex-row ${
        hover && !isSelected
          ? "hover:bg-[#5f5f5f] bg-[#555555]"
          : "bg-[#555555]"
      } ${isSelected ? "bg-green-500" : ""}`}
    >
      <div className="relative w-30 p-5 h-auto">
        <img src="/icons/card.jpg" className="w-full h-full"></img>
        <div className="absolute bottom-6 right-7 contactText text-[12px]">
          {number}
        </div>
      </div>
      <div
        className={`flex-1 flex flex-col justify-center ${
          hover ? "text-white" : "text-black"
        } px-10`}
      >
        <p className="font-bold">
          ČÍSLO KARTY: <span className="font-normal ">{number}</span>
        </p>
        <p className="font-bold">
          AKTUÁLNÍ KREDIT: <span className="font-normal">{credit}</span>
        </p>
      </div>
    </div>
  );
}

export default CustomCard;
