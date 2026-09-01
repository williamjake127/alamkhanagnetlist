"use client";

import React from "react";
import Link from "next/link";
import { Menu, LogOut, Globe, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  onOpenAddModal?: () => void;
  title?: string;
}

export function AdminNavbar({
  onToggleSidebar,
  onOpenAddModal,
  title = "Admin Dashboard",
}: AdminNavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0e1217]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
      {/* Left Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg bg-white/5 text-white hover:text-primary hover:bg-white/10 lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-white font-hind leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-deep_black text-xs font-bold font-hind hover:opacity-90 transition-all shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Agent</span>
          </button>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 text-gray hover:text-white hover:bg-white/10 text-xs font-hind transition-colors"
          title="View Public Website"
        >
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span className="hidden md:inline">Public Site</span>
        </Link>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-gray hover:text-rose-400 transition-colors p-1.5 rounded-lg bg-white/5 hover:bg-white/10"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
