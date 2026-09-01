"use client";

import React from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";
import { useSiteData } from "@/lib/site-context";

export default function SuperAgentPage() {
  const { openView, openReport } = useModals();
  const { getAgentsByCategory } = useSiteData();

  const agents = getAgentsByCategory("super", "active");

  return (
    <div className="py-2">
      <AgentTable
        title="SUPER AGENT LIST"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage="বর্তমানে কোন সুপার এজেন্ট তালিকাভুক্ত নেই"
      />
    </div>
  );
}
