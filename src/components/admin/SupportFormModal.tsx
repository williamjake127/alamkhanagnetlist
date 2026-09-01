"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

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

    try {
      const url = supportToEdit ? `/api/support/${supportToEdit._id}` : "/api/support";
      const method = supportToEdit ? "PUT" : "POST";

      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      const whatsappLink = `https://wa.me/${cleanPhone}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          whatsappLink,
          hours,
          status,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save customer support helpline.");
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
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light_black w-full max-w-md p-6 sm:p-8 rounded-[10px] relative border border-white/10 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-primary font-hind text-xl font-semibold mb-4 pb-2 border-b border-white/10">
          {supportToEdit ? "Edit Support Helpline" : "Add Support Helpline"}
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-[8px] bg-error/15 border border-error/30 text-error text-xs md:text-sm font-hind flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
              Support Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Customer Helpline 1"
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
              required
            />
          </div>

          <div>
            <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
              WhatsApp Phone Number *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Example: +96878531374"
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-sans"
              required
            />
          </div>

          <div>
            <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
              Service Hours
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Example: 24/7 Service"
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
            />
          </div>

          <div>
            <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
            >
              <option value="active">Active (Visible on Frontend Support Box)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] bg-deep_black text-gray hover:text-white text-sm font-hind transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-[8px] bg-primary text-deep_black font-semibold text-sm font-hind hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? "Saving..." : supportToEdit ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
