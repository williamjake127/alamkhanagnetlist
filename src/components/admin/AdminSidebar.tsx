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
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal?: () => void;
}

export function AdminSidebar({ isOpen, onClose, onOpenAddModal }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin-panel", icon: LayoutDashboard },
    { label: "Agents", href: "/admin-panel/agents", icon: Users },
    { label: "Helpline", href: "/admin-panel/support", icon: Headphones },
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0e1217] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin-panel" className="flex items-center gap-2.5">
              <div className="relative w-28 h-8">
                <Image
                  src="/images/logo.png"
                  alt="Betbuzz365"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                Admin
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray hover:text-white hover:bg-white/10 lg:hidden"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Button */}
          {onOpenAddModal && (
            <div className="p-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-deep_black font-bold text-xs font-hind flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-95 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Agent</span>
              </button>
            </div>
          )}

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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-deep_black font-bold shadow-md shadow-primary/20"
                      : "text-gray hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray hover:text-primary hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </Link>

          {user && (
            <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
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
                className="text-gray hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
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
