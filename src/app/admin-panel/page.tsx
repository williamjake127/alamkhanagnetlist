"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  UserCheck,
  Crown,
  Zap,
  Users,
  Plus,
  ArrowRight,
  ExternalLink,
  Trash2,
  Edit3,
  RefreshCw,
  PhoneCall,
  Star,
} from "lucide-react";
import { AgentFormModal } from "@/components/admin/AgentFormModal";
import { ClearDbModal } from "@/components/admin/ClearDbModal";
import { useSiteData } from "@/lib/site-context";

export default function AdminDashboardPage() {
  const { agents, supportList, refreshData, toggleAgentStatus, deleteAgent } = useSiteData();
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<any | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleToggleStatus = async (agent: any) => {
    const aid = agent._id || agent.id || agent.agentId;
    await toggleAgentStatus(aid);
  };

  const handleDelete = async (agent: any) => {
    if (!confirm(`Delete agent "${agent.name}" (ID: ${agent.agentId || agent.id})?`)) return;
    const aid = agent._id || agent.id || agent.agentId;
    await deleteAgent(aid);
  };

  const stats = {
    admin: agents.filter((a: any) => a.type === "admin" || a.category === "admin").length,
    super_admin: agents.filter((a: any) => a.type === "super_admin" || a.category === "super_admin").length,
    sub_admin: agents.filter((a: any) => a.type === "sub_admin" || a.category === "sub_admin").length,
    super: agents.filter((a: any) => a.type === "super" || a.category === "super").length,
    master: agents.filter((a: any) => a.type === "master" || a.category === "master").length,
    support: supportList.length,
  };

  const recentAgents = agents.slice(0, 8);
  const totalAgents =
    stats.admin + stats.super_admin + stats.sub_admin + stats.super + stats.master;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-[#141a22] to-[#11141a] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Management Center
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Betbuzz365 Agent Directory
            </h2>
            <p className="text-xs sm:text-sm text-gray mt-1 max-w-xl font-hind">
              এজেন্ট পরিচালনা, ক্যাটাগরি রোল, কন্টাক্ট লিঙ্ক এবং কাস্টমার সাপোর্ট ইন্সট্যান্ট পরিবর্তন করুন।
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                setAgentToEdit(null);
                setIsAgentModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Agent</span>
            </button>

            <button
              onClick={handleRefresh}
              title="Refresh Data"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Master Agents */}
        <div className="bg-[#12161d] border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray uppercase tracking-wider font-semibold">
              Master Agents
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.master}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Active</span>
          </div>
          <p className="text-[11px] text-gray/70 mt-1">Tier 5 • Client Dealing</p>
        </div>

        {/* Super Agents */}
        <div className="bg-[#12161d] border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-4 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray uppercase tracking-wider font-semibold">
              Super Agents
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.super}
            </span>
            <span className="text-[11px] text-amber-400 font-medium">Supervisors</span>
          </div>
          <p className="text-[11px] text-gray/70 mt-1">Tier 4 • Super Agents</p>
        </div>

        {/* Sub Admins */}
        <div className="bg-[#12161d] border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl p-4 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray uppercase tracking-wider font-semibold">
              Sub Admins
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.sub_admin}
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">Managers</span>
          </div>
          <p className="text-[11px] text-gray/70 mt-1">Tier 3 • Sub Admins</p>
        </div>

        {/* Super Admins */}
        <div className="bg-[#12161d] border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-4 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray uppercase tracking-wider font-semibold">
              Super Admins
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.super_admin}
            </span>
            <span className="text-[11px] text-blue-400 font-medium">Directors</span>
          </div>
          <p className="text-[11px] text-gray/70 mt-1">Tier 2 • Super Admins</p>
        </div>

        {/* Admins */}
        <div className="bg-[#12161d] border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-4 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray uppercase tracking-wider font-semibold">
              Top Admins
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.admin}
            </span>
            <span className="text-[11px] text-purple-400 font-medium">Executive</span>
          </div>
          <p className="text-[11px] text-gray/70 mt-1">Tier 1 • Top Administration</p>
        </div>
      </div>

      {/* 3. Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/admin-panel/agents"
          className="p-4 rounded-2xl bg-[#12161d] border border-white/10 hover:border-primary/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Manage All Agents ({totalAgents})
              </h4>
              <p className="text-xs text-gray">Search, filter & organize</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin-panel/support"
          className="p-4 rounded-2xl bg-[#12161d] border border-white/10 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Helpline Numbers ({stats.support})
              </h4>
              <p className="text-xs text-gray">Customer care numbers</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <button
          type="button"
          onClick={() => setIsClearModalOpen(true)}
          className="p-4 rounded-2xl bg-[#12161d] border border-rose-500/20 hover:border-rose-500/50 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                Clear Database Totally
              </h4>
              <p className="text-xs text-gray">Wipe all records cleanly</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* 4. Recent Agents Table */}
      <div className="bg-[#12161d] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Agent Directory Overview
            </h3>
            <p className="text-xs text-gray">
              Showing {recentAgents.length} of {totalAgents} agents
            </p>
          </div>
          <Link
            href="/admin-panel/agents"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAgents.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/10 rounded-xl p-6">
            <Users className="w-10 h-10 text-gray/40 mx-auto mb-2" />
            <p className="text-sm text-white font-bold">No agents in database</p>
            <p className="text-xs text-gray mt-1 max-w-sm mx-auto">
              Your directory is currently empty. Click below to add your first agent.
            </p>
            <button
              onClick={() => {
                setAgentToEdit(null);
                setIsAgentModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-deep_black font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Agent</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-2.5 md:hidden">
              {recentAgents.map((agent: any) => (
                <div
                  key={agent._id || agent.id}
                  className="p-3 rounded-xl bg-[#090d12] border border-white/5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30 font-mono text-xs font-bold">
                        ID: {agent.agentId || agent.id}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          agent.type === "master"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : agent.type === "super"
                            ? "bg-amber-500/20 text-amber-400"
                            : agent.type === "sub_admin"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {agent.type || agent.category}
                      </span>
                    </div>

                    {/* Status Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(agent)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        agent.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {agent.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                      <p className="text-xs text-gray font-mono">{agent.phone}</p>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{agent.rating || 5}</span>
                    </div>
                  </div>

                  {/* Actions on Mobile */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <a
                      href={agent.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAgentToEdit(agent);
                          setIsAgentModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray hover:text-white"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(agent)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-hind">
                <thead className="bg-[#090d12] text-gray uppercase text-[11px] font-semibold border-b border-white/5">
                  <tr>
                    <th className="py-3 px-3">Agent ID</th>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Phone / WhatsApp</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray">
                  {recentAgents.map((agent: any) => (
                    <tr key={agent._id || agent.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        <span className="px-2 py-1 rounded bg-[#090d12] border border-primary/30 text-primary text-xs">
                          {agent.agentId || agent.id}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-white">
                        {agent.name}
                      </td>

                      <td className="py-3 px-3">
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

                      <td className="py-3 px-3 font-mono text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{agent.phone}</span>
                          <a
                            href={agent.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline text-xs flex items-center gap-0.5"
                            title="Chat on WhatsApp"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-amber-400">
                        {"★".repeat(agent.rating || 5)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(agent)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                            agent.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                          }`}
                        >
                          {agent.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setAgentToEdit(agent);
                              setIsAgentModalOpen(true);
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
          </>
        )}
      </div>

      {/* Add / Edit Agent Modal */}
      <AgentFormModal
        isOpen={isAgentModalOpen}
        onClose={() => {
          setIsAgentModalOpen(false);
          setAgentToEdit(null);
        }}
        agentToEdit={agentToEdit}
        onSuccess={refreshData}
      />

      {/* Clear Database Modal */}
      <ClearDbModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
}
