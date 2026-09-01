"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  Zap,
  Users,
  Headphones,
  Plus,
  ArrowUpRight,
  Database,
  RefreshCw,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { AgentFormModal } from "@/components/admin/AgentFormModal";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    admin: 0,
    sub_admin: 0,
    super: 0,
    master: 0,
    support: 0,
  });
  const [recentAgents, setRecentAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch agents
      const agentRes = await fetch("/api/agents?status=all");
      const agentJson = await agentRes.json();

      if (agentJson.success && Array.isArray(agentJson.data)) {
        const all = agentJson.data;
        setRecentAgents(all.slice(0, 10));

        setStats((prev) => ({
          ...prev,
          admin: all.filter((a: any) => a.type === "admin").length,
          sub_admin: all.filter((a: any) => a.type === "sub_admin").length,
          super: all.filter((a: any) => a.type === "super").length,
          master: all.filter((a: any) => a.type === "master").length,
        }));
      }

      // Fetch support
      const supportRes = await fetch("/api/support?status=all");
      const supportJson = await supportRes.json();
      if (supportJson.success && Array.isArray(supportJson.data)) {
        setStats((prev) => ({
          ...prev,
          support: supportJson.data.length,
        }));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedDatabase = async () => {
    if (!confirm("Seed initial 25 Master Agents and default settings into MongoDB?")) return;
    setSeeding(true);
    setSeedMessage("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      setSeedMessage(json.message || "Database seeded successfully!");
      fetchData();
    } catch (err: any) {
      setSeedMessage("Failed to seed database: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-hind">
            System Overview & Metrics
          </h2>
          <p className="text-xs md:text-sm text-gray font-hind">
            Real-time management for Betbuzz365 Agent Network
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="p-2 rounded-[8px] bg-deep_black border border-white/10 text-gray hover:text-white hover:border-primary transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>

          <button
            onClick={() => setIsAgentModalOpen(true)}
            className="px-4 py-2 rounded-[8px] bg-primary text-deep_black font-semibold text-xs md:text-sm font-hind hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Agent</span>
          </button>
        </div>
      </div>

      {seedMessage && (
        <div className="p-3 rounded-[8px] bg-primary/10 border border-primary/30 text-primary text-xs md:text-sm font-hind">
          {seedMessage}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Admins"
          count={stats.admin}
          subtitle="Top tier hierarchy"
          icon={ShieldCheck}
          color="text-primary"
        />
        <StatsCard
          title="Sub Admins"
          count={stats.sub_admin}
          subtitle="Reports to Admins"
          icon={UserCheck}
          color="text-blue"
        />
        <StatsCard
          title="Super Agents"
          count={stats.super}
          subtitle="Reports to Sub Admins"
          icon={Zap}
          color="text-yellow-400"
        />
        <StatsCard
          title="Master Agents"
          count={stats.master}
          subtitle="Reports to Supers"
          icon={Users}
          color="text-success"
        />
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin-panel/agents"
          className="p-4 rounded-[10px] bg-light_black border border-white/5 hover:border-primary/40 transition-colors group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-deep_black text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-hind group-hover:text-primary transition-colors">
                Manage All Agents
              </h4>
              <p className="text-xs text-gray font-hind">Add, edit, filter, & delete</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin-panel/support"
          className="p-4 rounded-[10px] bg-light_black border border-white/5 hover:border-primary/40 transition-colors group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-deep_black text-success">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-hind group-hover:text-primary transition-colors">
                Customer Support Lines ({stats.support})
              </h4>
              <p className="text-xs text-gray font-hind">Manage 24/7 WhatsApp lines</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray group-hover:text-primary transition-colors" />
        </Link>

        <div
          onClick={handleSeedDatabase}
          className="p-4 rounded-[10px] bg-light_black border border-white/5 hover:border-primary/40 transition-colors group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-deep_black text-primary">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-hind group-hover:text-primary transition-colors">
                Seed Database Data
              </h4>
              <p className="text-xs text-gray font-hind">Populate 25 verified masters</p>
            </div>
          </div>
          <RefreshCw className={`w-4 h-4 text-gray group-hover:text-primary transition-colors ${seeding ? "animate-spin" : ""}`} />
        </div>
      </div>

      {/* Recent Agents Table */}
      <div className="bg-light_black p-4 md:p-6 rounded-[10px] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-white font-hind">
            Recently Added / Updated Agents
          </h3>
          <Link
            href="/admin-panel/agents"
            className="text-xs text-primary hover:underline font-hind"
          >
            View All ({stats.admin + stats.sub_admin + stats.super + stats.master}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm font-hind">
            <thead className="bg-deep_black text-primary uppercase text-[11px] font-medium border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Agent ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Reports To</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray">
              {recentAgents.length > 0 ? (
                recentAgents.map((a) => (
                  <tr key={a._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      <span className="bg-deep_black px-2 py-1 rounded text-primary text-xs">
                        {a.agentId}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white font-medium">{a.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-deep_black text-white">
                        {a.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-white">{a.phone}</td>
                    <td className="py-2.5 px-3 text-xs">
                      {a.type === "master" && a.reportTo?.super?.name && (
                        <span>Super: {a.reportTo.super.name}</span>
                      )}
                      {a.type === "super" && a.reportTo?.subAdmin?.name && (
                        <span>Sub: {a.reportTo.subAdmin.name}</span>
                      )}
                      {a.type === "sub_admin" && a.reportTo?.admin?.name && (
                        <span>Admin: {a.reportTo.admin.name}</span>
                      )}
                      {a.type === "admin" && <span className="text-gray/50">None (Top Level)</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-error/20 text-error"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray">
                    No agents in database. Click "Seed Database Data" above to import initial records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Agent Modal */}
      <AgentFormModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
