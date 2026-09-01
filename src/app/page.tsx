"use client";

import React from "react";
import { NoticeMarquee } from "@/components/home/NoticeMarquee";
import { OfficialGroupBanner } from "@/components/home/OfficialGroupBanner";
import { QuickAgentCard } from "@/components/home/QuickAgentCard";
import { SiteLinksCard } from "@/components/home/SiteLinksCard";
import { AgentTypeGuide } from "@/components/home/AgentTypeGuide";
import { AgentListInfo } from "@/components/home/AgentListInfo";
import { HowToOpenAccount } from "@/components/home/HowToOpenAccount";
import { SiteUpdates } from "@/components/home/SiteUpdates";
import { useModals } from "@/components/layout/AppWrapper";

export default function HomePage() {
  const { openReport } = useModals();

  return (
    <div className="space-y-4">
      {/* Portal Announcement Notice Marquee */}
      <NoticeMarquee />

      {/* Official Facebook Group Banner */}
      <OfficialGroupBanner />


      {/* Quick Agent + Site Links Section */}
      <div className="flex items-center w-full gap-4 md:gap-6 flex-col md:flex-row">
        <QuickAgentCard onReport={openReport} />
        <SiteLinksCard />
      </div>

      {/* Agent Types Guide + Agent List Rules */}
      <div className="grid grid-cols-10 gap-4 md:gap-6">
        <AgentTypeGuide />
        <div className="col-span-10 md:col-span-3">
          <AgentListInfo />
        </div>
      </div>

      {/* How to Open Account + Site Updates Carousel */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div className="col-span-2 md:col-span-1">
          <HowToOpenAccount />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SiteUpdates />
        </div>
      </div>
    </div>
  );
}
