"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CloseIcon } from "../ui/Icons";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwapModal({ isOpen, onClose }: SwapModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onClose();
    if (val === "master_agent") router.push("/master");
    else if (val === "super_agent") router.push("/super");
    else if (val === "sub_admin") router.push("/sub_admin");
    else if (val === "admin") router.push("/admin");
    else router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light_black w-full max-w-sm p-6 rounded-[8px] relative border border-white/10 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="text-xl" />
        </button>

        <h3 className="text-primary font-hind text-lg font-medium mb-3">Swap Category</h3>

        <div>
          <select
            className="w-full py-2 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/5 focus:border-primary transition-colors font-hind"
            name="type"
            defaultValue="default"
            onChange={handleSelect}
          >
            <option disabled value="default">
              Select Category
            </option>
            <option value="master_agent">Master</option>
            <option value="super_agent">Super</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
}
