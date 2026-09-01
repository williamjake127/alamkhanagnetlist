"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { AgentFormModal } from "@/components/admin/AgentFormModal";

export default function ManageAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<any | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      let url = "/api/agents?status=all";
      if (activeTab !== "all") {
        url += `&category=${activeTab}`;
      }
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAgents(json.data);
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAgents();
  };

  const handleDelete = async (agent: any) => {
    if (!confirm(`Are you sure you want to delete Agent "${agent.name}" (ID: ${agent.agentId})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/agents/${agent._id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchAgents();
      } else {
        alert("Failed to delete: " + json.error);
      }
    } catch (err: any) {
      alert("Error deleting agent: " + err.message);
    }
  };

  const tabs = [
    { label: "All Agents", value: "all" },
    { label: "Admins", value: "admin" },
    { label: "Sub Admins", value: "sub_admin" },
    { label: "Super Agents", value: "super" },
    { label: "Master Agents", value: "master" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-hind">
            Manage Agent Directory
          </h2>
          <p className="text-xs md:text-sm text-gray font-hind">
            Add, update, filter, or configure agent hierarchy & contacts
          </p>
        </div>

        <button
          onClick={() => {
            setAgentToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-[8px] bg-primary text-deep_black font-semibold text-xs md:text-sm font-hind hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-primary/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Agent</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-light_black p-4 rounded-[10px] border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-hind font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.value
                    ? "bg-primary text-deep_black font-semibold"
                    : "bg-deep_black text-gray hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Name, ID, Phone..."
                className="w-full py-1.5 pl-9 pr-3 rounded-[6px] bg-deep_black outline-none text-white text-xs border border-white/10 focus:border-primary transition-colors font-hind"
              />
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 bg-deep_black border border-white/10 hover:border-primary text-white text-xs rounded-[6px] font-hind transition-colors"
            >
              Search
            </button>

            <button
              type="button"
              onClick={fetchAgents}
              title="Refresh"
              className="p-1.5 bg-deep_black border border-white/10 hover:border-primary text-gray hover:text-white rounded-[6px] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
            </button>
          </form>
        </div>

        {/* Table of Agents */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm font-hind">
            <thead className="bg-deep_black text-primary uppercase text-[11px] font-medium border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Agent ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">WhatsApp / Phone</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Hierarchy / Reports To</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-primary font-hind">
                    Loading agents...
                  </td>
                </tr>
              ) : agents.length > 0 ? (
                agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-white/5 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      <span className="bg-deep_black border border-primary/30 px-2 py-1 rounded text-primary text-xs">
                        {agent.agentId}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3 text-white font-medium whitespace-nowrap">
                      {agent.name}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-deep_black text-white border border-white/10">
                        {agent.type}
                      </span>
                    </td>

                    {/* Phone & WhatsApp */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{agent.phone}</span>
                        <a
                          href={agent.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-success hover:underline text-[11px]"
                          title="Open WhatsApp"
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3 whitespace-nowrap text-primary">
                      {"★".repeat(agent.rating || 5)}
                    </td>

                    {/* Hierarchy reportTo preview */}
                    <td className="py-3 px-3 text-xs">
                      {agent.type === "master" && (
                        <div className="space-y-0.5">
                          {agent.reportTo?.super?.phone ? (
                            <p className="text-white">
                              <span className="text-primary font-medium">Super:</span> {agent.reportTo.super.name} ({agent.reportTo.super.phone})
                            </p>
                          ) : (
                            <p className="text-gray/50 italic">No Super assigned</p>
                          )}
                          {agent.reportTo?.subAdmin?.phone && (
                            <p className="text-gray text-[10px]">
                              <span className="text-gray font-medium">Sub:</span> {agent.reportTo.subAdmin.name} ({agent.reportTo.subAdmin.phone})
                            </p>
                          )}
                        </div>
                      )}

                      {agent.type === "super" && (
                        <div>
                          {agent.reportTo?.subAdmin?.phone ? (
                            <p className="text-white">
                              <span className="text-primary font-medium">Sub Admin:</span> {agent.reportTo.subAdmin.name} ({agent.reportTo.subAdmin.phone})
                            </p>
                          ) : (
                            <p className="text-gray/50 italic">No Sub Admin assigned</p>
                          )}
                        </div>
                      )}

                      {agent.type === "sub_admin" && (
                        <div>
                          {agent.reportTo?.admin?.phone ? (
                            <p className="text-white">
                              <span className="text-primary font-medium">Admin:</span> {agent.reportTo.admin.name} ({agent.reportTo.admin.phone})
                            </p>
                          ) : (
                            <p className="text-gray/50 italic">No Admin assigned</p>
                          )}
                        </div>
                      )}

                      {agent.type === "admin" && (
                        <span className="text-gray/50 italic">Top Level</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          agent.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-error/20 text-error"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAgentToEdit(agent);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-[4px] bg-deep_black hover:bg-white/10 text-primary transition-colors"
                          title="Edit Agent"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(agent)}
                          className="p-1.5 rounded-[4px] bg-deep_black hover:bg-error/20 text-error transition-colors"
                          title="Delete Agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray font-hind">
                    No agents found. Click "Add New Agent" above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AgentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAgentToEdit(null);
        }}
        agentToEdit={agentToEdit}
        onSuccess={fetchAgents}
      />
    </div>
  );
}
