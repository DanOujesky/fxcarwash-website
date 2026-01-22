import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartIcon() {
  const { totalCount } = useCart();

  if (totalCount === 0) {
    return (
      <div className="relative w-10 h-10 cursor-pointer">
        <Link to="/kosik">
          <img
            src="/icons/cart-icon.svg"
            className="w-full h-full object-cover invert"
            alt="Cart"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10">
      <Link to="/kosik">
        <img
          src="/icons/cart-icon.svg"
          className="w-full h-full object-cover invert cursor-pointer"
          alt="Cart"
        />
      </Link>

      <div
        className="absolute -top-1 -right-1 
                      flex items-center justify-center 
                      w-5 h-5 
                      bg-[#575757] text-white
                      text-[10px] font-bold 
                      rounded-full contactText"
      >
        {totalCount}
      </div>
    </div>
  );
}

export default CartIcon;
