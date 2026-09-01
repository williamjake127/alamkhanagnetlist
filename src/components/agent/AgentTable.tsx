import React from "react";
import { Agent } from "@/lib/types";
import { AgentRow } from "./AgentRow";

interface AgentTableProps {
  title: string;
  agents: Agent[];
  onView?: (agent: Agent) => void;
  onReport?: (agent: Agent) => void;
  emptyMessage?: string;
}

export function AgentTable({
  title,
  agents,
  onView,
  onReport,
  emptyMessage = "কোন এজেন্ট পাওয়া যায়নি",
}: AgentTableProps) {
  return (
    <div className="md:px-2">
      <h1 className="text-primary font-hind text-center mt-4 mb-2 text-[16px] md:text-xl uppercase font-sans font-semibold">
        {title}
      </h1>
      <div className="w-full bg-light_black p-2 sm:p-4 rounded-[8px]">
        <div className="w-full overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 text-white bg-deep_black rounded-[8px] py-[6px] px-2 md:px-4 md:pr-6 text-[7px] md:text-[16px] font-hind font-medium items-center">
            <h2 className="col-span-3 -ml-2 md:-ml-4 text-center">Name</h2>
            <h2 className="-ml-2 md:-ml-4 text-center">ID</h2>
            <h2 className="col-span-2 text-center">Rating</h2>
            <h2 className="col-span-2 text-center">App Link</h2>
            <h2 className="col-span-2 -ml-1 md:text-center md:ml-0">Phone Number</h2>
            <h2 className="text-center">View</h2>
            <h2 className="text-end -mr-1">Report</h2>
          </div>

          {/* Table Body */}
          {agents.length > 0 ? (
            <div className="divide-y divide-white/5">
              {agents.map((agent) => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  onView={onView}
                  onReport={onReport}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray font-hind text-sm md:text-base">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
