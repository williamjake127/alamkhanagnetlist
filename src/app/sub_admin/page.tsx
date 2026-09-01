"use client";

import React, { useEffect, useState } from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";

export default function SubAdminPage() {
  const { openView, openReport } = useModals();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubAdminAgents() {
      try {
        const res = await fetch("/api/agents?category=sub_admin&status=active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAgents(json.data);
        }
      } catch (err) {
        console.error("Failed to load sub admin agents:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSubAdminAgents();
  }, []);

  return (
    <div className="py-2">
      <AgentTable
        title="SUB ADMIN LIST"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage={loading ? "সাব এডমিন তালিকা লোড হচ্ছে..." : "বর্তমানে কোন সাব এডমিন তালিকাভুক্ত নেই"}
      />
    </div>
  );
}
