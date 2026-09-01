"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Headphones,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin-panel", icon: LayoutDashboard },
    { label: "Manage Agents", href: "/admin-panel/agents", icon: Users },
    { label: "Customer Support", href: "/admin-panel/support", icon: Headphones },
    { label: "Settings", href: "/admin-panel/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-light_black border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Close Button */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin-panel" className="relative w-36 h-10 block">
              <Image
                src="/images/logo.png"
                alt="Betbuzz365 Admin"
                fill
                className="object-contain"
              />
            </Link>

            <button
              onClick={onClose}
              className="p-1 text-gray hover:text-white lg:hidden"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-primary font-hind">
            Management Panel
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-deep_black font-semibold shadow-md shadow-primary/20"
                      : "text-gray hover:text-white hover:bg-deep_black"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & External Link */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-[8px] text-xs text-gray hover:text-primary hover:bg-deep_black transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-deep_black px-1.5 py-0.5 rounded text-white">Live</span>
          </Link>

          {user && (
            <div className="p-2.5 rounded-[8px] bg-deep_black flex items-center justify-between">
              <div className="overflow-hidden mr-2">
                <p className="text-xs text-white font-medium truncate">
                  {user.displayName || "Admin User"}
                </p>
                <p className="text-[10px] text-gray truncate">{user.email}</p>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="text-gray hover:text-error transition-colors p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
