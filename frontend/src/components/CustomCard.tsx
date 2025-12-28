type CustomCardProps = {
  number: string;
};

function CustomCard({ number }: CustomCardProps) {
  return (
    <div className="relative w-50 h-auto">
      <img src="/icons/card.webp" className="w-full h-full"></img>
      <div className="absolute top-5 right-8 contactText">{number}</div>
    </div>
  );
}

export default CustomCard;
