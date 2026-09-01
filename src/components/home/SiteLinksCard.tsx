import React from "react";
import Link from "next/link";

interface SiteLink {
  title: string;
  url: string;
}

interface SiteLinksCardProps {
  links?: SiteLink[];
}

export function SiteLinksCard({ links = [] }: SiteLinksCardProps) {
  const defaultLinks: SiteLink[] = [
    { title: "Betbuzz365 Official Site", url: "https://www.betbuzz365.com" },
    { title: "Admin List", url: "/admin" },
    { title: "Sub Admin List", url: "/sub_admin" },
    { title: "Super Agent List", url: "/super" },
    { title: "Master Agent List", url: "/master" },
  ];

  const displayLinks = links.length > 0 ? links : defaultLinks;

  return (
    <div className="bg-light_black md:h-[250px] w-full md:w-[50%] px-2 md:px-10 py-2 md:py-6 rounded-[8px] flex flex-col justify-between">
      <h1 className="text-primary font-hind text-center font-medium text-[16px] pb-2 md:pb-0">
        সাইটের সকল লিংক
      </h1>
      <div className="flex items-center justify-center h-full my-auto">
        <div className="bg-deep_black w-full h-[130px] rounded-[8px] overflow-y-auto p-3 flex flex-col gap-2">
          {displayLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className="text-white hover:text-primary transition-colors text-xs md:text-sm font-hind flex items-center justify-between border-b border-white/5 pb-1"
            >
              <span>{link.title}</span>
              <span className="text-primary text-xs">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
