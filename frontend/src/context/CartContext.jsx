import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      return parsed.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
        price: item.price ?? 0, // ensure price exists
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product, price = 0) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1, price }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id));
  };

  const increment = (id) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decrement = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (id) => cartItems.some((i) => i._id === id);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};