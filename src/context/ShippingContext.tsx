"use client";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type ShippingInfo = {
  name: string;
  email?: string;
  phone?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type ShippingContextType = {
  shippingInfo: ShippingInfo | null;
  saveShippingInfo: (info: ShippingInfo) => void;
  clearShippingInfo: () => void;
};

const ShippingContext = createContext<ShippingContextType | undefined>(
  undefined
);

export const ShippingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem("shippingInfo");
    if (storedInfo) {
      setShippingInfo(JSON.parse(storedInfo));
    }
  }, []);

  const saveShippingInfo = (info: ShippingInfo) => {
    setShippingInfo(info);
    localStorage.setItem("shippingInfo", JSON.stringify(info));
  };

  const clearShippingInfo = () => {
    setShippingInfo(null);
    localStorage.removeItem("shippingInfo");
  };

  return (
    <ShippingContext.Provider
      value={{ shippingInfo, saveShippingInfo, clearShippingInfo }}
    >
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error("useShipping must be used within a ShippingProvider");
  }
  return context;
};
