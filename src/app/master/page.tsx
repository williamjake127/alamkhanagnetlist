"use client";

import React from "react";
import { AgentTable } from "@/components/agent/AgentTable";
import { useModals } from "@/components/layout/AppWrapper";
import { useSiteData } from "@/lib/site-context";

export default function MasterAgentPage() {
  const { openView, openReport } = useModals();
  const { getAgentsByCategory } = useSiteData();

  const agents = getAgentsByCategory("master", "active");

  return (
    <div className="py-2">
      <AgentTable
        title="MASTER AGENT LIST"
        agents={agents}
        onView={openView}
        onReport={openReport}
        emptyMessage="বর্তমানে কোন মাস্টার এজেন্ট তালিকাভুক্ত নেই"
      />
    </div>
  );
}
