"use client";

import React, { useEffect, useState } from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";
import { INITIAL_AGENTS } from "@/lib/data/agents";

export default function MasterPage() {
  const { openView, openReport } = useModals();
  const [agents, setAgents] = useState<any[]>(INITIAL_AGENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMasterAgents() {
      try {
        const res = await fetch("/api/agents?category=master&status=active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setAgents(json.data);
        }
      } catch (err) {
        console.error("Failed to load master agents from API:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMasterAgents();
  }, []);

  return (
    <div className="py-2">
      <AgentTable
        title="MASTER LIST"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage={loading ? "মাস্টার এজেন্ট তালিকা লোড হচ্ছে..." : "বর্তমানে কোন মাস্টার এজেন্ট তালিকাভুক্ত নেই"}
      />
    </div>
  );
}
