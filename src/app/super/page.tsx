"use client";

import React, { useEffect, useState } from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";

export default function SuperPage() {
  const { openView, openReport } = useModals();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuperAgents() {
      try {
        const res = await fetch("/api/agents?category=super&status=active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAgents(json.data);
        }
      } catch (err) {
        console.error("Failed to load super agents:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSuperAgents();
  }, []);

  return (
    <div className="py-2">
      <AgentTable
        title="SUPER LIST"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage={loading ? "সুপার এজেন্ট তালিকা লোড হচ্ছে..." : "বর্তমানে কোন সুপার এজেন্ট তালিকাভুক্ত নেই"}
      />
    </div>
  );
}
