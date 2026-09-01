"use client";

import React from "react";
import { useSiteData, ProxyLink } from "@/lib/site-context";

interface SiteLinksCardProps {
  links?: ProxyLink[];
}

export function SiteLinksCard({ links: propLinks }: SiteLinksCardProps) {
  const { settings } = useSiteData();

  const links =
    propLinks && propLinks.length > 0
      ? propLinks
      : settings.proxyLinks || [];

  // Helper to format clean domain text (e.g. "https://example.com/" -> "example.com")
  const cleanDomain = (url: string) => {
    if (!url) return "";
    return url
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, ""); // Keep clean domain
  };

  return (
    <div className="bg-light_black md:h-[250px] w-full md:w-[50%] px-2 md:px-6 py-2 md:py-6 rounded-[8px] flex flex-col justify-between">
      <h1 className="text-primary font-hind text-center font-medium text-[16px] md:text-[18px] pb-2 md:pb-3">
        সাইটের সকল লিংক
      </h1>

      <div className="flex items-center justify-center h-full my-auto">
        <div className="bg-deep_black w-full h-[150px] rounded-[8px] overflow-y-auto px-2 sm:px-3 py-1.5 divide-y divide-white/10 scrollbar-thin flex flex-col">
          {links && links.length > 0 ? (
            links.map((link, idx) => {
              const formattedUrl = link.url.startsWith("http://") || link.url.startsWith("https://")
                ? link.url
                : `https://${link.url}`;
              const domainText = cleanDomain(link.url);

              return (
                <div
                  key={link.id || idx}
                  className="py-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm font-hind"
                >
                  {/* Title */}
                  <div className="w-[32%] sm:w-[30%] text-left">
                    <span className="text-primary font-medium text-[12px] sm:text-[14px] leading-tight block truncate">
                      {link.title}
                    </span>
                  </div>

                  {/* Clean Domain Text */}
                  <div className="w-[34%] sm:w-[35%] text-left">
                    <span
                      className="text-white font-sans text-[11px] sm:text-[13px] font-medium truncate block"
                      title={domainText}
                    >
                      {domainText}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="w-[18%] sm:w-[18%] text-center flex items-center justify-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        link.status === "inactive" ? "bg-gray" : "bg-[#00E676] animate-pulse"
                      } flex-shrink-0`}
                    />
                    <span
                      className={`${
                        link.status === "inactive" ? "text-gray" : "text-[#00E676]"
                      } text-[10px] sm:text-[12px] font-sans font-medium`}
                    >
                      {link.status === "inactive" ? "Inactive" : "Active"}
                    </span>
                  </div>

                  {/* Visit Action Button */}
                  <div className="w-[16%] sm:w-[17%] text-right">
                    <a
                      href={formattedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-primary hover:opacity-90 text-deep_black font-bold text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-[4px] transition-all active:scale-95 shadow-sm"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full my-auto text-center py-6">
              <p className="text-gray text-xs md:text-sm font-hind">
                কোনো লিংক যুক্ত করা হয়নি
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
