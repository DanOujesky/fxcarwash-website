type CustomCardProps = {
  number: string;
  credit: number;
  isSelected: boolean;
};

function CustomCard({ number, credit, isSelected }: CustomCardProps) {
  return (
    <div
      className={`flex flex-row ${
        isSelected ? "bg-green-500" : "bg-transparent"
      }`}
    >
      <div className="relative w-30 p-5 h-auto">
        <img src="/icons/card.jpg" className="w-full h-full"></img>
        <div className="absolute bottom-6 right-7 contactText text-[12px]">
          {number}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center text-black px-10">
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
