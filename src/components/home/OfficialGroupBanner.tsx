"use client";

import React, { useEffect, useState } from "react";
import { FacebookIcon } from "../ui/Icons";

interface OfficialGroupBannerProps {
  facebookUrl?: string;
}

export function OfficialGroupBanner({
  facebookUrl: initialUrl = "https://facebook.com",
}: OfficialGroupBannerProps) {
  const [facebookUrl, setFacebookUrl] = useState(initialUrl);

  useEffect(() => {
    async function fetchFacebookLink() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.facebookGroupLink) {
          setFacebookUrl(json.data.facebookGroupLink);
        }
      } catch (err) {
        console.error("Failed to load official facebook group URL:", err);
      }
    }

    fetchFacebookLink();
  }, []);

  return (
    <div className="flex justify-around items-center mt-4 bg-light_black rounded-[8px] py-2 px-3 sm:px-4">
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
