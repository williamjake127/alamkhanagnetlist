"use client";

import React from "react";
import Image from "next/image";
import { Agent } from "@/lib/types";
import { useSiteData } from "@/lib/site-context";

interface QuickAgentCardProps {
  initialAgent?: Agent;
  onReport?: (agent: Agent) => void;
}

export function QuickAgentCard({ onReport }: QuickAgentCardProps) {
  const { getAgentsByCategory } = useSiteData();
  const masters = getAgentsByCategory("master", "active");
  const agent = masters.length > 0 ? masters[0] : null;

  if (!agent) {
    return (
      <div className="bg-light_black md:h-[250px] w-full md:w-[50%] px-4 md:px-10 py-4 md:py-6 rounded-[8px] flex flex-col justify-center items-center text-center space-y-2">
        <h1 className="text-primary font-hind font-medium text-[16px]">
          কুইক মাস্টার এজেন্ট নম্বর
        </h1>
        <div className="p-4 bg-deep_black rounded-[8px] w-full text-gray text-xs md:text-sm font-hind">
          বর্তমানে কোন কুইক এজেন্ট নির্ধারিত নেই। অনুগ্রহ করে সরাসরি এডমিন অথবা হেল্পলাইনে যোগাযোগ করুন।
        </div>
      </div>
    );
  }

  const agentIdDisplay = (agent as any).agentId || agent.id;
  const whatsappLink =
    agent.whatsapp || `https://wa.me/${agent.phone?.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="bg-light_black md:h-[250px] w-full md:w-[50%] px-2 md:px-10 py-2 md:py-6 rounded-[8px] flex flex-col justify-between">
      <h1 className="text-primary font-hind text-center font-medium text-[16px] pb-2 md:pb-0">
        কুইক মাস্টার এজেন্ট নম্বর
      </h1>
      <div className="flex items-center justify-center h-full my-auto">
        <div className="w-full bg-deep_black rounded-[8px] px-2 py-4 md:p-4 grid grid-cols-9 gap-2 items-center">
          {/* Avatar & Name */}
          <div className="col-span-4 flex items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-8 md:w-10 h-8 md:h-10 rounded-full flex-shrink-0">
                <Image
                  src="/icons/avatar.svg"
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-white text-[10px] md:text-[16px] tracking-tight md:tracking-tighter font-hind font-medium truncate">
                  {agent.name}
                </h1>
                <p className="text-gray text-[8px] md:text-[10px] font-hind">
                  Quick Agent
                </p>
              </div>
            </div>
          </div>

          {/* ID Badge */}
          <div className="bg-primary rounded-[8px] text-[10px] md:text-[14px] text-center text-deep_black font-semibold font-hind leading-3 md:leading-4 aspect-square py-1 md:py-2 flex flex-col items-center justify-center uppercase">
            <span>id:</span>
            <span className="font-bold">{agentIdDisplay}</span>
          </div>

          {/* Phone & WhatsApp tag */}
          <div className="col-span-2 flex flex-col justify-center items-center">
            <div className="flex flex-col items-start text-left">
              <p className="text-white text-[9px] md:text-[13px] font-medium tracking-tight font-sans">
                {agent.phone}
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white rounded bg-success text-[8px] md:text-[10px] px-1 mt-1 font-hind inline-block hover:opacity-90 transition-opacity"
              >
                Whatssapp
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="col-span-2 flex items-center justify-center w-full">
            <div className="flex flex-col text-center gap-1 md:gap-2 w-full">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white rounded bg-success text-[9px] md:text-[13px] py-[2px] md:py-1 font-hind hover:opacity-90 transition-opacity"
              >
                Message
              </a>
              <button
                type="button"
                onClick={() => onReport?.(agent)}
                className="text-[9px] md:text-[13px] text-white rounded bg-error py-[2px] md:py-1 font-hind hover:opacity-90 transition-opacity"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
