"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Star, Users, Zap, Shield, UserCheck, Crown } from "lucide-react";
import { useSiteData } from "@/lib/site-context";

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentToEdit?: any | null;
  onSuccess: () => void;
}

export function AgentFormModal({
  isOpen,
  onClose,
  agentToEdit,
  onSuccess,
}: AgentFormModalProps) {
  const { agents, addAgent, updateAgent } = useSiteData();

  const [formData, setFormData] = useState({
    name: "",
    agentId: "",
    type: "master" as "admin" | "super_admin" | "sub_admin" | "super" | "master",
    phone: "",
    whatsapp: "",
    rating: 5,
    parentId: "",
    status: "active" as "active" | "inactive",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // When opening or editing, populate form
  useEffect(() => {
    if (agentToEdit) {
      setFormData({
        name: agentToEdit.name || "",
        agentId: agentToEdit.agentId || agentToEdit.id || "",
        type: agentToEdit.type || agentToEdit.category || "master",
        phone: agentToEdit.phone || "",
        whatsapp: agentToEdit.whatsapp || "",
        rating: agentToEdit.rating || 5,
        parentId:
          typeof agentToEdit.parentId === "object"
            ? agentToEdit.parentId?._id
            : agentToEdit.parentId || "",
        status: agentToEdit.status || "active",
      });
    } else {
      setFormData({
        name: "",
        agentId: "",
        type: "master",
        phone: "",
        whatsapp: "",
        rating: 5,
        parentId: "",
        status: "active",
      });
    }
    setError("");
  }, [agentToEdit, isOpen]);

  // Supervisors list from cached agents
  const parentsList = React.useMemo(() => {
    if (formData.type === "master") {
      return agents.filter(
        (a: any) => (a.type === "super" || a.category === "super") && a.status === "active"
      );
    }
    if (formData.type === "super") {
      return agents.filter(
        (a: any) => (a.type === "sub_admin" || a.category === "sub_admin") && a.status === "active"
      );
    }
    if (formData.type === "sub_admin") {
      return agents.filter(
        (a: any) =>
          (a.type === "super_admin" ||
            a.category === "super_admin" ||
            a.type === "admin" ||
            a.category === "admin") &&
          a.status === "active"
      );
    }
    if (formData.type === "super_admin") {
      return agents.filter(
        (a: any) => (a.type === "admin" || a.category === "admin") && a.status === "active"
      );
    }
    return [];
  }, [formData.type, agents]);

  // Auto-generate WhatsApp when phone changes if WhatsApp isn't manually customized
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanPhone = val.replace(/[^0-9+]/g, "");
    setFormData((prev) => ({
      ...prev,
      phone: val,
      whatsapp: val ? `https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone}` : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name.trim() || !formData.agentId.trim() || !formData.phone.trim()) {
      setError("Please fill in Agent Name, ID, and Phone Number.");
      setLoading(false);
      return;
    }

    try {
      let ok = false;
      if (agentToEdit) {
        const aid = agentToEdit._id || agentToEdit.id || agentToEdit.agentId;
        ok = await updateAgent(aid, formData);
      } else {
        ok = await addAgent(formData);
      }

      if (!ok) {
        setError("Failed to save to database. Please check your network or MongoDB connection.");
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const roles = [
    {
      id: "master",
      title: "Master",
      icon: Users,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      activeBg: "bg-emerald-500 text-black font-bold",
    },
    {
      id: "super",
      title: "Super",
      icon: Zap,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      activeBg: "bg-amber-400 text-black font-bold",
    },
    {
      id: "sub_admin",
      title: "Sub Admin",
      icon: Shield,
      color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
      activeBg: "bg-cyan-400 text-black font-bold",
    },
    {
      id: "super_admin",
      title: "Super Admin",
      icon: Crown,
      color: "text-blue-400 border-blue-500/40 bg-blue-500/10",
      activeBg: "bg-blue-500 text-black font-bold",
    },
    {
      id: "admin",
      title: "Admin",
      icon: UserCheck,
      color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
      activeBg: "bg-purple-400 text-black font-bold",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-lg bg-[#14181f] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-hind">
              {agentToEdit ? "Edit Agent" : "Add New Agent"}
            </h3>
            <p className="text-xs text-gray font-hind">
              Enter agent credentials and contact information
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm font-hind">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* 1. Role Selection */}
          <div>
            <label className="block text-gray text-xs font-semibold mb-2 uppercase tracking-wider">
              1. Select Agent Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = formData.type === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: r.id as any,
                        parentId: "",
                      }))
                    }
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? `${r.activeBg} border-transparent shadow-md`
                        : `${r.color} hover:bg-white/5`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Agent ID <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={formData.agentId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, agentId: e.target.value }))
                }
                placeholder="e.g. 01, 14, SUPER-01"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Agent Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. SHOHEL RANA"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* 3. Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="e.g. +96879627605"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                WhatsApp Link (Auto-Generated)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))
                }
                placeholder="https://wa.me/+96879627605"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs"
              />
            </div>
          </div>

          {/* 4. Supervisor / Hierarchy */}
          {formData.type !== "admin" && (
            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Reports To (Supervisor / Higher Tier)
              </label>
              <select
                value={formData.parentId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, parentId: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e1217] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
              >
                <option value="">-- None / Select Supervisor --</option>
                {parentsList.map((p: any) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name} (ID: {p.agentId || p.id} - {p.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 5. Rating & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Star Rating ({formData.rating} / 5)
              </label>
              <div className="flex items-center gap-1.5 p-2 bg-[#0e1217] rounded-xl border border-white/10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formData.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Account Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "active" }))
                  }
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    formData.status === "active"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                      : "bg-[#0e1217] border border-white/10 text-gray hover:text-white"
                  }`}
                >
                  🟢 Active
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "inactive" }))
                  }
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    formData.status === "inactive"
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                      : "bg-[#0e1217] border border-white/10 text-gray hover:text-white"
                  }`}
                >
                  🔴 Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray hover:text-white font-medium text-xs sm:text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-xs sm:text-sm hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{loading ? "Saving..." : agentToEdit ? "Update Agent" : "Create Agent"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
