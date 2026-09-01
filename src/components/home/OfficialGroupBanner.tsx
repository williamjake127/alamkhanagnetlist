"use client";

import React from "react";
import { FacebookIcon } from "../ui/Icons";
import { useSiteData } from "@/lib/site-context";

interface OfficialGroupBannerProps {
  facebookUrl?: string;
}

export function OfficialGroupBanner({ facebookUrl: propUrl }: OfficialGroupBannerProps) {
  const { settings } = useSiteData();
  const facebookUrl = propUrl || settings.facebookGroupLink || "https://facebook.com";

  return (
    <div className="flex justify-around items-center mt-2 bg-light_black rounded-[8px] py-2 px-3 sm:px-4">
      <h1 className="text-primary font-hind text-sm md:text-base font-medium">
        আমাদের অফিসিয়াল ফেসবুক গ্রুপঃ
      </h1>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue hover:bg-blue/90 transition-colors text-white rounded-[4px] py-1 px-3 flex items-center gap-1 text-xs md:text-sm font-hind shadow-sm"
      >
        <FacebookIcon className="w-3 h-3 md:w-4 md:h-4" />
        <span>এখানে ক্লিক করুন</span>
      </a>
    </div>
  );
}
