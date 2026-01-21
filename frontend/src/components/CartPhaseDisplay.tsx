type CartPhaseDisplayProps = {
  phaseNumber: number;
  delivery: boolean;
};

function CartPhaseDisplay({ phaseNumber, delivery }: CartPhaseDisplayProps) {
  if (delivery) {
    return (
      <div className="grid grid-cols-5 w-full justify-items-center items-center">
        <div
          className={`flex flex-row gap-2 items-center justify-center relative justify-self-end  text-black rounded-xl p-4 bg-green-500`}
        >
          <div className="bg-[#1d1d1b] text-white rounded-full w-8 h-8 flex justify-center items-center p-2 contactText font-medium text-[20px]">
            1
          </div>
          <p className="font-medium">Košík</p>
        </div>
        <div className="w-full flex flex-row">
          <span className="bg-green-500 w-1/2 h-2 block"></span>
          <span
            className={`${
              phaseNumber > 1 ? "bg-green-500" : "bg-white"
            } w-1/2 h-2 block`}
          ></span>
        </div>
        <div className="w-full flex flex-row justify-center items-center">
          <span
            className={`${
              phaseNumber > 1 ? "bg-green-500" : "bg-white"
            } flex-1 h-2 block`}
          ></span>
          <div
            className={`flex flex-row gap-2 items-center justify-center relative justify-self-center ${
              phaseNumber > 1 ? "bg-green-500" : "bg-white"
            } text-black rounded-xl p-4`}
          >
            <div className="bg-[#1d1d1b] text-white rounded-full w-8 h-8 flex justify-center items-center p-2 contactText font-medium text-[20px]">
              2
            </div>
            <p className="font-medium">Doprava</p>
          </div>
          <span
            className={`${
              phaseNumber > 1 ? "bg-green-500" : "bg-white"
            } flex-1 h-2 block`}
          ></span>
        </div>

        <div className="w-full flex flex-row">
          <span
            className={`${
              phaseNumber > 1 ? "bg-green-500" : "bg-white"
            } w-1/2 h-2 block`}
          ></span>
          <span
            className={`${
              phaseNumber > 2 ? "bg-green-500" : "bg-white"
            } w-1/2 h-2 block`}
          ></span>
        </div>
        <div
          className={`flex flex-row gap-2 items-center justify-center relative justify-self-start ${
            phaseNumber > 2 ? "bg-green-500" : "bg-white"
          } text-black rounded-xl p-4`}
        >
          <div className="bg-[#1d1d1b] text-white rounded-full w-8 h-8 flex justify-center items-center p-2 contactText font-medium text-[20px]">
            3
          </div>
          <p className="font-medium">Souhrn</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-3 w-full justify-items-center items-center">
        <div
          className={`flex flex-row gap-2 items-center justify-center relative justify-self-end ${
            phaseNumber >= 1 ? "bg-green-500" : "bg-white"
          } text-black rounded-xl p-4`}
        >
          <div className="bg-[#1d1d1b] text-white rounded-full w-8 h-8 flex justify-center items-center p-2 contactText font-medium text-[20px]">
            1
          </div>
          <p className="font-medium">Košík</p>
        </div>
        <div className="w-full flex flex-row">
          <span className="bg-green-500 w-1/2 h-2 block"></span>
          <span
            className={`${
              phaseNumber > 2 ? "bg-green-500" : "bg-white"
            } flex-1 h-2 block`}
          ></span>
        </div>
        <div
          className={`flex flex-row gap-2 items-center justify-center relative justify-self-start ${
            phaseNumber > 2 ? "bg-green-500" : "bg-white"
          } text-black rounded-xl p-4`}
        >
          <div className="bg-[#1d1d1b] text-white rounded-full w-8 h-8 flex justify-center items-center p-2 contactText font-medium text-[20px]">
            2
          </div>
          <p className="font-medium">Souhrn</p>
        </div>
      </div>
    );
  }
}

export default CartPhaseDisplay;
