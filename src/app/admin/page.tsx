"use client";

import React, { useEffect, useState } from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";

export default function AdminPage() {
  const { openView, openReport } = useModals();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminAgents() {
      try {
        const res = await fetch("/api/agents?category=admin&status=active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAgents(json.data);
        }
      } catch (err) {
        console.error("Failed to load admin agents:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminAgents();
  }, []);

  return (
    <div className="py-2">
      <AgentTable
        title="Admin List"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage={loading ? "এডমিন তালিকা লোড হচ্ছে..." : "বর্তমানে কোন এডমিন তালিকাভুক্ত নেই"}
      />
    </div>
  );
}
