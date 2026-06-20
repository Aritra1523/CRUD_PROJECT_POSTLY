import React, { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("orders");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Newest orders first
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  const clearOrders = () => setOrders([]);

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getOrderById, clearOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);