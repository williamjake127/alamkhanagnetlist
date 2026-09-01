"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SearchIcon } from "../ui/Icons";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: "/icons/nav-home.svg" },
    { label: "Admin", href: "/admin", icon: "/icons/nav-agent.svg" },
    { label: "Sub Admin", href: "/sub_admin", icon: "/icons/nav-agent.svg" },
    { label: "Super", href: "/super", icon: "/icons/nav-agent.svg" },
    { label: "Master", href: "/master", icon: "/icons/nav-agent.svg" },
  ];

  return (
    <nav className="py-2 px-3 md:px-4 bg-light_black rounded-[10px] flex items-center justify-between">
      <div className="md:grid grid-cols-4 w-full items-center">
        {/* Search button on left for desktop */}
        <div className="hidden md:flex">
          <div>
            <button
              onClick={onOpenSearch}
              type="button"
              className="hidden md:flex items-center gap-2 bg-deep_black px-6 lg:px-8 py-2 rounded-[8px] hover:opacity-90 transition-opacity"
            >
              <SearchIcon className="text-primary text-lg" />
              <span className="text-white font-hind text-sm lg:text-base">এজেন্ট খুজুন</span>
            </button>
          </div>
        </div>

        {/* Navigation links center */}
        <div className="flex items-center col-span-2 justify-center gap-2 md:gap-4 py-1 md:py-2 flex-wrap">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center font-hind -tracking-tight font-medium transition-colors ${
                  isActive ? "text-primary" : "text-white hover:text-primary"
                }`}
              >
                <span className="relative w-[12px] h-[12px] md:w-[14px] md:h-[14px] mb-1 mr-[3px] md:mr-[5px] inline-block">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    className={`object-contain ${isActive ? "" : "brightness-100"}`}
                  />
                </span>
                <span className="text-[12px] md:text-[16px]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile search button */}
        <div className="flex md:hidden justify-end">
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex md:hidden p-2 text-primary"
            aria-label="Search agents"
          >
            <SearchIcon className="text-primary text-xl" />
          </button>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </nav>
  );
}
