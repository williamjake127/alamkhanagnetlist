"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon, HomeNavIcon, AgentNavIcon } from "../ui/Icons";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Admin", href: "/admin", icon: "agent" },
    { label: "Sub Admin", href: "/sub_admin", icon: "agent" },
    { label: "Super", href: "/super", icon: "agent" },
    { label: "Master", href: "/master", icon: "agent" },
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
        <div className="flex items-center col-span-2 justify-center gap-3 md:gap-5 py-1 md:py-2 flex-wrap">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 font-hind -tracking-tight font-medium transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-white hover:text-primary"
                }`}
              >
                <span className="flex items-center justify-center">
                  {item.icon === "home" ? (
                    <HomeNavIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  ) : (
                    <AgentNavIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  )}
                </span>
                <span className="text-[12px] md:text-[15px]">{item.label}</span>
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
