"use client";

import React from "react";
import { Menu, LogOut, Database } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export function AdminNavbar({ onToggleSidebar, title = "Admin Dashboard" }: AdminNavbarProps) {
  const { user, logout, isDemoMode } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-light_black/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-[6px] bg-deep_black text-white hover:text-primary lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base md:text-lg font-semibold text-white font-hind">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-deep_black border border-white/5 text-[11px] text-gray">
          <Database className="w-3 h-3 text-success" />
          <span>MongoDB Live</span>
        </div>

        {isDemoMode && (
          <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono">
            Dev Mode
          </span>
        )}

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-gray hover:text-error transition-colors px-2 py-1 rounded bg-deep_black hover:bg-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
