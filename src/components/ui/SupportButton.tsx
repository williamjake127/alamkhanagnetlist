"use client";

import React from "react";
import Image from "next/image";

interface SupportButtonProps {
  onClick?: () => void;
}

export function SupportButton({ onClick }: SupportButtonProps) {
  return (
    <div className="fixed bottom-4 left-4 z-[9999999]">
      <button
        type="button"
        onClick={onClick}
        className="bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 px-[10px] py-[6px] rounded-[8px] font-sans text-[12px] text-deep_black font-semibold flex items-center gap-[6px]"
      >
        <span className="relative w-[15px] h-[15px]">
          <Image
            src="/icons/headset.svg"
            alt="Support"
            fill
            className="object-contain"
          />
        </span>
        <span>Support</span>
      </button>
    </div>
  );
}
