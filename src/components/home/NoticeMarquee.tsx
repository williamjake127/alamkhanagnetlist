"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import { useSiteData } from "@/lib/site-context";

export function NoticeMarquee() {
  const { settings } = useSiteData();
  const notice =
    settings.siteNotice ||
    (settings.siteName
      ? `স্বাগতম ${settings.siteName} এর অফিসিয়াল এজেন্ট তালিকায়। নিরাপদ লেনদেনের জন্য সর্বদা আমাদের ভেরিফাইড এজেন্টদের সাথে যোগাযোগ করুন।`
      : "স্বাগতম আমাদের অফিসিয়াল এজেন্ট তালিকায়। নিরাপদ লেনদেনের জন্য সর্বদা ভেরিফাইড এজেন্টদের সাথে যোগাযোগ করুন।");

  return (
    <div className="flex items-center bg-light_black rounded-[8px] py-2 px-3 sm:px-4 overflow-hidden border border-primary/25 shadow-sm mt-4">
      {/* Notice Tag / Badge */}
      <div className="flex items-center gap-1.5 bg-primary text-deep_black font-hind font-bold text-xs sm:text-sm px-2.5 py-0.5 sm:py-1 rounded-[4px] flex-shrink-0 z-10 shadow-sm mr-2 sm:mr-3">
        <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        <span>নোটিশঃ</span>
      </div>

      {/* Scrolling Text Container */}
      <div className="overflow-hidden whitespace-nowrap flex-1 relative flex items-center">
        <div
          className="animate-marquee inline-block text-white text-xs sm:text-sm font-hind font-medium tracking-wide hover:text-primary transition-colors cursor-default"
          title={notice}
        >
          {notice}
        </div>
      </div>
    </div>
  );
}
