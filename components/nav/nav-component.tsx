"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/app", label: "App" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavComponent() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <div className="sm:hidden border border-gray-200 rounded-md p-1">
            <HamburgerMenuIcon className="h-[22px] w-[22px]" />
          </div>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetTitle>
            <span className="text-3xl">Menu</span>
          </SheetTitle>
          <nav className="flex flex-col space-y-4 mt-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-2xl ${
                  isActive(item.href) ? "font-semibold" : ""
                }`}
              >
                {" "}
                <SheetClose>{item.label}</SheetClose>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex items-center ">
        <h1 className="text-4xl sm:text-4xl font-bold mr-6">
          <Link href="/">
            <span className="text-primary">Poodeek!</span>
          </Link>
        </h1>
        <nav className="hidden sm:flex h-9 space-x-6  items-end">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-primary ${
                isActive(item.href) ? "font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default NavComponent;
