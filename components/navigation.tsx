import React from "react";
import Link from "next/link";
import { DropdownMenuDemo } from "./dropdown-menu";

function Navigation() {
  return (
    <nav className="flex justify-between items-center p-2 w-full">
      <div className="flex flex-col">
        <h1 className="font-bold text-3xl">
          <Link href="/">Poodeek!</Link>
        </h1>
        {/* <span className="text-xs">Embrasse la répétition</span> */}
      </div>
      <DropdownMenuDemo />
    </nav>
  );
}

export default Navigation;
