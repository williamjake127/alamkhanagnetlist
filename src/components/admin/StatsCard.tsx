import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  count: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({ title, count, subtitle, icon: Icon, color = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-light_black p-4 md:p-5 rounded-[10px] border border-white/5 hover:border-primary/40 transition-colors flex items-center justify-between">
      <div>
        <p className="text-gray text-xs md:text-sm font-hind">{title}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-white font-sans mt-1">{count}</h3>
        {subtitle && <p className="text-gray text-[11px] font-hind mt-1">{subtitle}</p>}
      </div>

      <div className={`p-3 rounded-xl bg-deep_black ${color} border border-white/5`}>
        <Icon className="w-6 h-6 md:w-7 md:h-7" />
      </div>
    </div>
  );
}
