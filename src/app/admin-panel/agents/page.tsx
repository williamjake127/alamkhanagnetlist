"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  ExternalLink,
  Users,
  Zap,
  Shield,
  UserCheck,
  LayoutGrid,
  List,
  Star,
  X,
} from "lucide-react";
import { AgentFormModal } from "@/components/admin/AgentFormModal";
import { useSiteData } from "@/lib/site-context";

export default function ManageAgentsPage() {
  const { agents, refreshData, toggleAgentStatus, deleteAgent } = useSiteData();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<any | null>(null);

  // Instant in-memory search and filter with 0ms delay
  const filteredAgents = useMemo(() => {
    return agents.filter((agent: any) => {
      const type = agent.type || agent.category || "master";
      const matchesTab = activeTab === "all" || type === activeTab;

      if (!matchesTab) return false;

      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase().trim();
      const name = (agent.name || "").toLowerCase();
      const id = String(agent.agentId || agent.id || "").toLowerCase();
      const phone = (agent.phone || "").toLowerCase();

      return name.includes(q) || id.includes(q) || phone.includes(q);
    });
  }, [agents, activeTab, searchTerm]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleToggle = async (agent: any) => {
    const aid = agent._id || agent.id || agent.agentId;
    await toggleAgentStatus(aid);
  };

  const handleDelete = async (agent: any) => {
    if (!confirm(`Are you sure you want to delete Agent "${agent.name}" (ID: ${agent.agentId || agent.id})?`)) {
      return;
    }
    const aid = agent._id || agent.id || agent.agentId;
    await deleteAgent(aid);
  };

  const tabs = [
    { label: "All", value: "all", icon: Users },
    { label: "Masters", value: "master", icon: Users },
    { label: "Supers", value: "super", icon: Zap },
    { label: "Sub Admins", value: "sub_admin", icon: Shield },
    { label: "Admins", value: "admin", icon: UserCheck },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Agent Directory
          </h2>
          <p className="text-xs sm:text-sm text-gray">
            Browse, filter, edit, or configure all agents
          </p>
        </div>

        <button
          onClick={() => {
            setAgentToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add New Agent</span>
        </button>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-[#12161d] border border-white/10 rounded-2xl p-3 sm:p-4 space-y-3 shadow-lg">
        {/* Category Pills & View Switcher */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-primary text-deep_black shadow-md shadow-primary/20"
                      : "bg-[#090d12] text-gray hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center gap-1 p-1 bg-[#090d12] rounded-xl border border-white/5 ml-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-primary text-deep_black" : "text-gray hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-primary text-deep_black" : "text-gray hover:text-white"
              }`}
              title="Compact Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Agent Name, ID, or Phone (Instant)..."
              className="w-full py-2 pl-9 pr-8 rounded-xl bg-[#090d12] border border-white/10 text-white placeholder-gray text-xs sm:text-sm outline-none focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh"
            className="p-2 bg-[#090d12] border border-white/10 text-gray hover:text-white rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Agent List */}
      {filteredAgents.length === 0 ? (
        <div className="py-16 text-center bg-[#12161d] border border-white/10 rounded-2xl p-6">
          <Users className="w-12 h-12 text-gray/40 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No agents found</h4>
          <p className="text-xs text-gray mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `No agents matching "${searchTerm}". Try a different keyword.`
              : "There are currently no agents registered in this category."}
          </p>
          <button
            onClick={() => {
              setAgentToEdit(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-deep_black font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Agent</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAgents.map((agent: any) => (
            <div
              key={agent._id || agent.id}
              className="bg-[#12161d] border border-white/10 hover:border-white/20 rounded-2xl p-4 space-y-3 shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: ID + Category + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-primary/20 text-primary border border-primary/30 font-mono text-xs font-bold">
                      ID: {agent.agentId || agent.id}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        agent.type === "master" || agent.category === "master"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : agent.type === "super" || agent.category === "super"
                          ? "bg-amber-500/20 text-amber-400"
                          : agent.type === "sub_admin" || agent.category === "sub_admin"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {agent.type || agent.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(agent)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      agent.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                    }`}
                  >
                    {agent.status === "active" ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Name & Phone */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-white truncate">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gray font-mono mt-0.5">{agent.phone}</p>
                </div>

                {/* Rating & Supervisor */}
                <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-semibold">{agent.rating || 5}.0</span>
                  </div>

                  <div className="text-[11px] text-gray truncate max-w-[150px]">
                    {agent.type === "master" && agent.reportTo?.super?.name && (
                      <span>Super: {agent.reportTo.super.name}</span>
                    )}
                    {agent.type === "super" && agent.reportTo?.subAdmin?.name && (
                      <span>Sub: {agent.reportTo.subAdmin.name}</span>
                    )}
                    {agent.type === "sub_admin" && agent.reportTo?.admin?.name && (
                      <span>Admin: {agent.reportTo.admin.name}</span>
                    )}
                    {agent.type === "admin" && <span>Top Level</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                <a
                  href={agent.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAgentToEdit(agent);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-[#090d12] hover:bg-white/10 text-gray hover:text-white transition-colors"
                    title="Edit Agent"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(agent)}
                    className="p-2 rounded-xl bg-[#090d12] hover:bg-rose-500/20 text-gray hover:text-rose-400 transition-colors"
                    title="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-[#12161d] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-hind">
              <thead className="bg-[#090d12] text-gray uppercase text-[11px] font-semibold border-b border-white/5">
                <tr>
                  <th className="py-3 px-3">Agent ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Phone & WhatsApp</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Supervisor</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray">
                {filteredAgents.map((agent: any) => (
                  <tr key={agent._id || agent.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      <span className="px-2 py-1 rounded bg-[#090d12] border border-primary/30 text-primary text-xs">
                        {agent.agentId || agent.id}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {agent.name}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          agent.type === "master" || agent.category === "master"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : agent.type === "super" || agent.category === "super"
                            ? "bg-amber-500/20 text-amber-400"
                            : agent.type === "sub_admin" || agent.category === "sub_admin"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {agent.type || agent.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{agent.phone}</span>
                        <a
                          href={agent.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline"
                          title="Open WhatsApp"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-amber-400 whitespace-nowrap">
                      {"★".repeat(agent.rating || 5)}
                    </td>

                    <td className="py-3 px-3 text-xs">
                      {agent.type === "master" && agent.reportTo?.super?.name && (
                        <span>Super: {agent.reportTo.super.name}</span>
                      )}
                      {agent.type === "super" && agent.reportTo?.subAdmin?.name && (
                        <span>Sub: {agent.reportTo.subAdmin.name}</span>
                      )}
                      {agent.type === "sub_admin" && agent.reportTo?.admin?.name && (
                        <span>Admin: {agent.reportTo.admin.name}</span>
                      )}
                      {agent.type === "admin" && <span className="text-gray/50">Top Level</span>}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggle(agent)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          agent.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                        }`}
                      >
                        {agent.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAgentToEdit(agent);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#090d12] hover:bg-white/10 text-gray hover:text-white transition-colors"
                          title="Edit Agent"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(agent)}
                          className="p-1.5 rounded-lg bg-[#090d12] hover:bg-rose-500/20 text-gray hover:text-rose-400 transition-colors"
                          title="Delete Agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AgentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAgentToEdit(null);
        }}
        agentToEdit={agentToEdit}
        onSuccess={refreshData}
      />
    </div>
  );
}
