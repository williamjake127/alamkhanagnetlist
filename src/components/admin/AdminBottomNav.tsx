"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Headphones,
  Settings,
  Plus,
} from "lucide-react";

interface AdminBottomNavProps {
  onOpenAddModal: () => void;
}

export function AdminBottomNav({ onOpenAddModal }: AdminBottomNavProps) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin-panel/login";
  if (isLoginPage) return null;

  const navItems = [
    { label: "Home", href: "/admin-panel", icon: LayoutDashboard },
    { label: "Agents", href: "/admin-panel/agents", icon: Users },
    { label: "Support", href: "/admin-panel/support", icon: Headphones },
    { label: "Settings", href: "/admin-panel/settings", icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1217]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around relative">
        {/* First 2 items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
                isActive ? "text-primary font-bold scale-105" : "text-gray hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Floating Add Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center -mt-5"
          aria-label="Add Agent"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-amber-400 text-deep_black flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] text-primary font-bold mt-0.5">Add</span>
        </button>

        {/* Last 2 items */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
                isActive ? "text-primary font-bold scale-105" : "text-gray hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
