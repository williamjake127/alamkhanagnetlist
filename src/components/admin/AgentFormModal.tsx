"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { IAgent } from "@/models/Agent";

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
  const [name, setName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [type, setType] = useState<"admin" | "sub_admin" | "super" | "master">("master");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [rating, setRating] = useState(5);
  const [appLink, setAppLink] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [parentOptions, setParentOptions] = useState<any[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Determine required parent category based on selected agent type
  const requiredParentCategory =
    type === "sub_admin" ? "admin" : type === "super" ? "sub_admin" : type === "master" ? "super" : null;

  // Initialize form state
  useEffect(() => {
    if (agentToEdit) {
      setName(agentToEdit.name || "");
      setAgentId(agentToEdit.agentId || "");
      setType(agentToEdit.type || "master");
      setPhone(agentToEdit.phone || "");
      setWhatsapp(agentToEdit.whatsapp || "");
      setRating(agentToEdit.rating || 5);
      setAppLink(agentToEdit.appLink || "");
      setParentId(
        typeof agentToEdit.parentId === "object" && agentToEdit.parentId?._id
          ? agentToEdit.parentId._id
          : agentToEdit.parentId || ""
      );
      setStatus(agentToEdit.status || "active");
    } else {
      setName("");
      setAgentId("");
      setType("master");
      setPhone("");
      setWhatsapp("");
      setRating(5);
      setAppLink("");
      setParentId("");
      setStatus("active");
    }
    setErrorMessage("");
  }, [agentToEdit, isOpen]);

  // Fetch upper hierarchy agents when type changes
  useEffect(() => {
    if (!requiredParentCategory) {
      setParentOptions([]);
      setParentId("");
      return;
    }

    async function fetchParentCandidates() {
      setLoadingParents(true);
      try {
        const res = await fetch(`/api/agents?category=${requiredParentCategory}&status=all`);
        const json = await res.json();
        if (json.success) {
          setParentOptions(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load parent options:", err);
      } finally {
        setLoadingParents(false);
      }
    }

    if (isOpen) {
      fetchParentCandidates();
    }
  }, [type, requiredParentCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const url = agentToEdit ? `/api/agents/${agentToEdit._id}` : "/api/agents";
      const method = agentToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          agentId,
          type,
          phone,
          whatsapp: whatsapp || `https://wa.me/${phone.replace(/[^0-9+]/g, "")}`,
          rating: Number(rating),
          appLink,
          parentId: parentId || null,
          status,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save agent.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedParent = parentOptions.find((p) => p._id === parentId);

  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light_black w-full max-w-2xl p-6 sm:p-8 rounded-[10px] relative border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-primary font-hind text-xl font-semibold mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
          <span>{agentToEdit ? "Edit Agent" : "Add New Agent"}</span>
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-[8px] bg-error/15 border border-error/30 text-error text-xs md:text-sm font-hind flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agent Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
                1. Category / Agent Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
                required
              >
                <option value="admin">Admin</option>
                <option value="sub_admin">Sub Admin</option>
                <option value="super">Super</option>
                <option value="master">Master</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
              >
                <option value="active">Active (Visible on Website)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Hierarchy Selection */}
          {requiredParentCategory && (
            <div className="p-3.5 rounded-[8px] bg-deep_black border border-primary/20 space-y-2">
              <label className="text-primary text-xs md:text-sm font-hind block font-medium">
                Hierarchy Rule: Select Report To {requiredParentCategory === "admin" ? "Admin" : requiredParentCategory === "sub_admin" ? "Sub Admin" : "Super"} *
              </label>

              {loadingParents ? (
                <p className="text-gray text-xs font-hind py-1">Loading available candidates...</p>
              ) : parentOptions.length > 0 ? (
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full py-2 px-3 rounded-[8px] bg-light_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
                  required
                >
                  <option value="">-- Choose {requiredParentCategory} --</option>
                  {parentOptions.map((p) => (
                    <option key={p._id} value={p._id}>
                      [{p.agentId}] {p.name} ({p.phone})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-error text-xs font-hind">
                  ⚠️ No {requiredParentCategory} agents exist yet. Please create a {requiredParentCategory} first.
                </div>
              )}

              {selectedParent && (
                <div className="mt-2 text-[11px] text-gray font-hind bg-black/40 p-2 rounded">
                  <span className="text-primary font-medium">Auto-Inherited Chain: </span>
                  {type === "master" && selectedParent && (
                    <span>
                      Super: {selectedParent.name} ({selectedParent.phone})
                      {selectedParent.reportTo?.subAdmin?.phone && ` → Sub Admin: ${selectedParent.reportTo.subAdmin.name} (${selectedParent.reportTo.subAdmin.phone})`}
                      {selectedParent.reportTo?.admin?.phone && ` → Admin: ${selectedParent.reportTo.admin.name} (${selectedParent.reportTo.admin.phone})`}
                    </span>
                  )}
                  {type === "super" && selectedParent && (
                    <span>
                      Sub Admin: {selectedParent.name} ({selectedParent.phone})
                      {selectedParent.reportTo?.admin?.phone && ` → Admin: ${selectedParent.reportTo.admin.name} (${selectedParent.reportTo.admin.phone})`}
                    </span>
                  )}
                  {type === "sub_admin" && selectedParent && (
                    <span>Admin: {selectedParent.name} ({selectedParent.phone})</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
                2. Agent Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: SHADAB KHAN"
                className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
                required
              />
            </div>

            <div>
              <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
                3. Agent ID Number *
              </label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                placeholder="Example: 08 or ADMIN-01"
                className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-sans"
                required
              />
            </div>
          </div>

          {/* Phone & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
                4. WhatsApp Phone Number *
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
                5. Rating (1 to 5 Stars)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
                <option value="2">⭐⭐ (2 Stars)</option>
                <option value="1">⭐ (1 Star)</option>
              </select>
            </div>
          </div>

          {/* App Link */}
          <div>
            <label className="text-primary text-xs md:text-sm font-hind block mb-1 font-medium">
              6. App Link (Optional)
            </label>
            <input
              type="text"
              value={appLink}
              onChange={(e) => setAppLink(e.target.value)}
              placeholder="Custom app link or download URL"
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-sans"
            />
          </div>

          {/* Actions */}
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
              <span>{submitting ? "Saving..." : agentToEdit ? "Update Agent" : "Save Agent"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
