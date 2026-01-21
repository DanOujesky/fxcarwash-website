import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { OrderItem } from "../types/Order";
import { CartContext } from "./CartContext";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Chyba při načítání košíku:", e);
        setCart([]);
      }
    }
  }, []);

  const updateCart = (newCart: OrderItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (item: OrderItem) => {
    const itemWithId = { ...item, id: item.id || crypto.randomUUID() };
    updateCart([...cart, itemWithId]);
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const hasDelivery = cart.some((item) => item.shipping == "cp");
  const totalPrice = cart.reduce((sum, item) => sum + (item.prize || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        hasDelivery,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
