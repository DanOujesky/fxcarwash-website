import { formatCurrency } from "../utils/formater";

type Props = {
  totalPrice: number;
};

function OrderSummary({ totalPrice }: Props) {
  return (
    <div className="w-full lg:w-[420px] header-color border border-white/10 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6">
        Souhrn objednávky
      </h2>

      <div className="flex justify-between text-gray-300 mb-2">
        <span>Cena bez DPH</span>
        <span>{formatCurrency(totalPrice * 0.79)}</span>
      </div>
      <div className="flex justify-between text-gray-300 mb-2">
        <span>DPH 21 %</span>
        <span>{formatCurrency(totalPrice * 0.21)}</span>
      </div>

      <div className="flex justify-between text-gray-300 mb-4">
        <span>Doprava</span>
        <span>Zdarma</span>
      </div>

      <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold text-white">
        <span>Celkem</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
