"use client";

// import React from "react";
// Shop temporarily disabled
// import { useCart } from "@/context/CartContext";
// import { FiShoppingCart } from "react-icons/fi";
// import Link from "next/link";

const CartIcon = () => {
  // Shop temporarily disabled
  return null;

  // const { cart } = useCart();

  // // Calculate total items in the cart
  // const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // if (totalItems === 0) return null; // Render nothing if the cart is empty

  // return (
  //   <Link href="/shop/cart" className="flex items-center pt-2">
  //     <div className="relative cursor-pointer">
  //       <FiShoppingCart size={24} className="text-white" />
  //       <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
  //         {totalItems}
  //       </span>
  //     </div>
  //   </Link>
  // );
};

export default CartIcon;
