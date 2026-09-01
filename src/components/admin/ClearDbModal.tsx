"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ClearDbModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClearDbModal({ isOpen, onClose, onSuccess }: ClearDbModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClear = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/clear-db", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to clear database");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to clear database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#14181f] border border-rose-500/30 rounded-2xl shadow-2xl p-6 space-y-4 text-center font-hind animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            Clear Database Completely?
          </h3>
          <p className="text-xs text-gray leading-relaxed">
            This will permanently delete <strong className="text-rose-400">all agents</strong>, <strong className="text-rose-400">support helplines</strong>, and reset website configurations to blank.
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 text-xs text-left">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray hover:text-white text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? "Clearing..." : "Yes, Clear All"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
