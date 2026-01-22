import { createContext, useContext } from "react";
import type { OrderItem } from "../types/Order";

export interface CartContextType {
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  hasDelivery: boolean;
  totalPrice: number;
  updateCartQuantity: (id: string, newQuantity: number) => void;
  totalCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart musí být použit uvnitř CartProvideru");
  return context;
};
