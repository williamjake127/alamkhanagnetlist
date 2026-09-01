"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Headphones } from "lucide-react";

interface SupportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportToEdit?: any | null;
  onSuccess: () => void;
}

export function SupportFormModal({
  isOpen,
  onClose,
  supportToEdit,
  onSuccess,
}: SupportFormModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("24/7 Service");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (supportToEdit) {
      setName(supportToEdit.name || "");
      setPhone(supportToEdit.phone || "");
      setHours(supportToEdit.hours || "24/7 Service");
      setStatus(supportToEdit.status || "active");
    } else {
      setName("");
      setPhone("");
      setHours("24/7 Service");
      setStatus("active");
    }
    setErrorMessage("");
  }, [supportToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Please provide both name and WhatsApp phone number.");
      setSubmitting(false);
      return;
    }

    try {
      const url = supportToEdit ? `/api/support/${supportToEdit._id}` : "/api/support";
      const method = supportToEdit ? "PUT" : "POST";

      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      const whatsappLink = `https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          whatsappLink,
          hours: hours.trim(),
          status,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save helpline.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#14181f] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 font-hind animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {supportToEdit ? "Edit Helpline" : "Add Support Helpline"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-gray text-xs font-medium mb-1">
              Helpline Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 24/7 Customer Care 1"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray text-xs font-medium mb-1">
              WhatsApp Phone Number <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +96878531374"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-gray text-xs font-medium mb-1">
              Service Hours
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 24/7 Service or 9:00 AM - 12:00 AM"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-gray text-xs font-medium mb-1">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("active")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  status === "active"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "bg-[#0e1217] border border-white/10 text-gray hover:text-white"
                }`}
              >
                🟢 Active
              </button>
              <button
                type="button"
                onClick={() => setStatus("inactive")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  status === "inactive"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-[#0e1217] border border-white/10 text-gray hover:text-white"
                }`}
              >
                🔴 Inactive
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{submitting ? "Saving..." : supportToEdit ? "Update Helpline" : "Save Helpline"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
