type CustomCardProps = {
  number: string;
  credit: number;
};

function CustomCard({ number, credit }: CustomCardProps) {
  return (
    <div className="flex flex-row">
      <div className="relative w-50 h-auto">
        <img src="/icons/card.jpg" className="w-full h-full"></img>
        <div className="absolute bottom-5 right-5 contactText">{number}</div>
      </div>
      <div className="flex-1 text-black px-10">
        <p className="font-bold">
          ČÍSLO: <span className="font-normal">{number}</span>
        </p>
        <p className="font-bold">
          KREDIT: <span className="font-normal">{credit}</span>
        </p>
      </div>
    </div>
  );
}

export default CustomCard;
