"use client";

import React, { useState, useEffect } from "react";
import { Plus, Headphones, Edit2, Trash2, RefreshCw, ExternalLink } from "lucide-react";
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
      }
    } catch (err) {
      console.error("Error fetching support contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  const handleDelete = async (support: any) => {
    if (!confirm(`Delete support helpline "${support.name}"?`)) return;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-hind">
            Customer Support Management
          </h2>
          <p className="text-xs md:text-sm text-gray font-hind">
            Manage 24/7 official customer care and WhatsApp helpline numbers
          </p>
        </div>

        <button
          onClick={() => {
            setSupportToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-[8px] bg-primary text-deep_black font-semibold text-xs md:text-sm font-hind hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-primary/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Support Helpline</span>
        </button>
      </div>

      {/* Support Table */}
      <div className="bg-light_black p-4 rounded-[10px] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray font-hind">
            Active helplines appear immediately on the website support modal.
          </span>
          <button
            onClick={fetchSupports}
            title="Refresh"
            className="p-1.5 bg-deep_black border border-white/10 hover:border-primary text-gray hover:text-white rounded-[6px] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm font-hind">
            <thead className="bg-deep_black text-primary uppercase text-[11px] font-medium border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Helpline Title</th>
                <th className="py-2.5 px-3">Phone / WhatsApp</th>
                <th className="py-2.5 px-3">Service Hours</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-primary font-hind">
                    Loading customer support helplines...
                  </td>
                </tr>
              ) : supports.length > 0 ? (
                supports.map((s) => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{s.name}</span>
                    </td>

                    <td className="py-3 px-3 font-mono text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{s.phone}</span>
                        <a
                          href={s.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-success hover:underline text-[11px]"
                          title="Open WhatsApp"
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-xs text-gray">{s.hours || "24/7 Service"}</td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-error/20 text-error"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSupportToEdit(s);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-[4px] bg-deep_black hover:bg-white/10 text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(s)}
                          className="p-1.5 rounded-[4px] bg-deep_black hover:bg-error/20 text-error transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray font-hind">
                    No customer support helplines added yet. Click "Add Support Helpline" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
