import { useState } from "react";
import type { Order } from "../types/Order";

function CartIcon() {
  const [cart] = useState<Order | null>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? (JSON.parse(saved) as Order) : null;
  });

  const displayCount = cart?.count || 0;

  if (displayCount === 0) {
    return (
      <div className="absolute right-0 mr-10 cursor-pointer">
        <div className="relative w-10 h-10">
          <img
            src="/icons/cart-icon.svg"
            className="w-full h-full object-cover invert"
            alt="Cart"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mr-10 cursor-pointer">
      <div className="relative w-10 h-10">
        <img
          src="/icons/cart-icon.svg"
          className="w-full h-full object-cover invert"
          alt="Cart"
        />
        <div
          className="absolute -top-1 -right-1 
                      flex items-center justify-center 
                      w-5 h-5 
                      bg-[#575757] text-white
                      text-[10px] font-bold 
                      rounded-full contactText"
        >
          {displayCount}
        </div>
      </div>
    </div>
  );
}

export default CartIcon;
