"use client";

import React, { useState, useEffect } from "react";
import { Plus, Headphones, Edit3, Trash2, RefreshCw, ExternalLink, PhoneCall } from "lucide-react";
import { SupportFormModal } from "@/components/admin/SupportFormModal";

export default function CustomerSupportAdminPage() {
  const [supports, setSupports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supportToEdit, setSupportToEdit] = useState<any | null>(null);

  const fetchSupports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support?status=all");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSupports(json.data);
      } else {
        setSupports([]);
      }
    } catch (err) {
      console.error("Error fetching support contacts:", err);
      setSupports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  const handleDelete = async (support: any) => {
    if (!confirm(`Delete helpline "${support.name}"?`)) return;

    try {
      const res = await fetch(`/api/support/${support._id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchSupports();
      } else {
        alert("Failed to delete: " + json.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Customer Support Helplines
          </h2>
          <p className="text-xs sm:text-sm text-gray">
            Manage 24/7 customer care and WhatsApp contact numbers
          </p>
        </div>

        <button
          onClick={() => {
            setSupportToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Helpline</span>
        </button>
      </div>

      {/* Grid of Helpline Cards */}
      {loading ? (
        <div className="py-16 text-center text-primary text-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          Loading helplines...
        </div>
      ) : supports.length === 0 ? (
        <div className="py-16 text-center bg-[#12161d] border border-white/10 rounded-2xl p-6">
          <Headphones className="w-12 h-12 text-gray/40 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No support helplines added</h4>
          <p className="text-xs text-gray mt-1 max-w-sm mx-auto">
            Click below to add a 24/7 WhatsApp helpline number for your users.
          </p>
          <button
            onClick={() => {
              setSupportToEdit(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-deep_black font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Helpline</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supports.map((s) => (
            <div
              key={s._id}
              className="bg-[#12161d] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{s.name}</h3>
                      <span className="text-[10px] text-gray">{s.hours || "24/7 Service"}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {s.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#090d12] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-white">{s.phone}</span>
                  </div>
                  <a
                    href={s.whatsappLink || `https://wa.me/${s.phone?.replace(/[^0-9+]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Open in WhatsApp"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setSupportToEdit(s);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#090d12] hover:bg-white/10 text-gray hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s)}
                  className="p-2 rounded-xl bg-[#090d12] hover:bg-rose-500/20 text-gray hover:text-rose-400 transition-colors"
                  title="Delete Helpline"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SupportFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSupportToEdit(null);
        }}
        supportToEdit={supportToEdit}
        onSuccess={fetchSupports}
      />
    </div>
  );
}
