"use client";

import React from "react";
import { HeadsetIcon } from "./Icons";

interface SupportButtonProps {
  onClick?: () => void;
}

export function SupportButton({ onClick }: SupportButtonProps) {
  return (
    <div className="fixed bottom-4 left-4 z-[9999999]">
      <button
        type="button"
        onClick={onClick}
        className="bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 px-3 py-1.5 rounded-[8px] font-sans text-[12px] text-deep_black font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
      >
        <HeadsetIcon className="w-3.5 h-3.5 text-deep_black" />
        <span>Support</span>
      </button>
    </div>
  );
}
