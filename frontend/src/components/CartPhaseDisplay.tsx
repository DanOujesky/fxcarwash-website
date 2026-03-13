type CartPhaseDisplayProps = {
  phaseNumber: number;
  delivery: boolean;
};

function CartPhaseDisplay({ phaseNumber, delivery }: CartPhaseDisplayProps) {
  const getBubbleClass = (stepNumber: number) => {
    const isActive = phaseNumber >= stepNumber;
    return `flex flex-row gap-2 items-center justify-center rounded-xl p-2 sm:p-4 transition-colors duration-300 ${
      isActive ? "bg-green-500 text-black" : "bg-white text-black"
    }`;
  };

  const getLineClass = (stepNumber: number) => {
    const isCompleted = phaseNumber > stepNumber;
    return `h-2 flex-1 transition-colors duration-300 ${
      isCompleted ? "bg-green-500" : "bg-white"
    }`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center w-full">
        <div className={getBubbleClass(1)}>
          <div className="bg-[#1d1d1b] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center contactText font-medium text-sm sm:text-[20px]">
            1
          </div>
          <p className="font-medium text-xs sm:text-base">Košík</p>
        </div>

        <span className={getLineClass(1)}></span>

        <div className={getBubbleClass(2)}>
          <div className="bg-[#1d1d1b] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center contactText font-medium text-sm sm:text-[20px]">
            2
          </div>
          <p className="font-medium text-xs sm:text-base">
            {delivery ? "Doprava" : "Fakturační údaje"}
          </p>
        </div>

        <span className={getLineClass(2)}></span>

        <div className={getBubbleClass(3)}>
          <div className="bg-[#1d1d1b] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center contactText font-medium text-sm sm:text-[20px]">
            3
          </div>
          <p className="font-medium text-xs sm:text-base">Souhrn</p>
        </div>
      </div>
    </div>
  );
}

export default CartPhaseDisplay;
