import { formatCurrency } from "../utils/formater";

type Props = {
  totalPrice: number;
};

function OrderSummary({ totalPrice }: Props) {
  return (
    <div className="w-full sm:w-[420px] bg-[#1f1f1f] border border-white/10 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6">
        Souhrn objednávky
      </h2>

      <div className="flex justify-between text-gray-300 mb-2">
        <span>Mezisoučet</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>

      <div className="flex justify-between text-gray-300 mb-4">
        <span>DPH</span>
        <span>Včetně</span>
      </div>

      <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold text-white">
        <span>Celkem</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
