"use client";

import React from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";
import { useSiteData } from "@/lib/site-context";

export default function AdminPage() {
  const { openView, openReport } = useModals();
  const { getAgentsByCategory } = useSiteData();

  const agents = getAgentsByCategory("admin", "active");

  return (
    <div className="py-2">
      <AgentTable
        title="Admin List"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage="বর্তমানে কোন এডমিন তালিকাভুক্ত নেই"
      />
    </div>
  );
}
