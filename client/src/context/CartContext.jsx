import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/carts");
      const count = res.data?.items?.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      setCartCount(count || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
