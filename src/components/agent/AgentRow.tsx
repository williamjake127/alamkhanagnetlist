import React from "react";
import Image from "next/image";
import { WhatsAppIcon, EyeIcon } from "../ui/Icons";
import { StarRating } from "../ui/StarRating";

interface AgentRowProps {
  agent: any;
  onView?: (agent: any) => void;
  onReport?: (agent: any) => void;
}

export function AgentRow({ agent, onView, onReport }: AgentRowProps) {
  const agentName = agent.name || "Agent";
  const agentId = agent.agentId || agent.id || "";
  const agentType = (agent.type || agent.category || "master").toLowerCase();
  const agentPhone = agent.phone || "";
  const whatsappUrl =
    agent.whatsapp || `https://wa.me/${agentPhone.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="grid grid-cols-12 text-white border-b border-white/10 py-[6px] md:py-[10px] md:pr-6 text-[8px] md:text-[16px] items-center hover:bg-white/5 transition-colors">
      {/* 1. Name & Avatar (col-span-3) */}
      <div className="col-span-3 flex items-center gap-1.5 md:gap-2">
        <figure className="relative w-6 h-6 md:w-9 md:h-9 flex-shrink-0">
          <Image
            src={agent.avatar || agent.image || "/icons/avatar.svg"}
            alt={agentName}
            fill
            className="rounded-full object-cover"
          />
        </figure>
        <div className="overflow-hidden">
          <h1 className="text-white text-[8px] md:text-[16px] font-hind font-medium truncate">
            {agentName}
          </h1>
          <p className="text-gray text-[6px] md:text-[10px] text-start font-hind uppercase">
            {agent.categoryLabel || agentType}
          </p>
        </div>
      </div>

      {/* 2. ID Badge (col-span-1) */}
      <div className="flex items-center justify-center">
        <div className="bg-primary text-deep_black px-[6px] py-1 md:px-4 rounded-[8px] text-[8px] md:text-[12px] leading-none md:py-2 flex flex-col items-center gap-1 font-semibold font-hind">
          <span>ID</span>
          <h3 className="font-bold font-sans">{agentId}</h3>
        </div>
      </div>

      {/* 3. Rating (col-span-2) */}
      <div className="col-span-2 h-full flex items-center justify-center">
        <StarRating rating={agent.rating || 5} />
      </div>

      {/* 4. App Link / WhatsApp Icon (col-span-2) */}
      <div className="col-span-2 flex items-center justify-center mr-1 md:mr-0">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-success hover:opacity-80 transition-opacity"
          aria-label={`Chat with ${agentName} on WhatsApp`}
        >
          <WhatsAppIcon className="text-[18px] md:text-[30px] cursor-pointer text-success" />
        </a>
      </div>

      {/* 5. Phone Number & WhatsApp Button (col-span-2) */}
      <div className="col-span-2 flex flex-col items-start md:items-center md:gap-1 -ml-1 md:-ml-2">
        <h1 className="text-[8px] md:text-[14px] font-hind font-medium tracking-wide truncate font-sans">
          {agentPhone}
        </h1>
        <div className="flex">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white rounded bg-success text-[7px] md:text-[10px] px-1.5 py-[1px] font-hind hover:opacity-90 transition-opacity"
          >
            Whatsapp
          </a>
        </div>
      </div>

      {/* 6. View Button (col-span-1) */}
      <div className="flex items-center justify-center -ml-2 md:-ml-0">
        <button
          type="button"
          onClick={() => onView?.(agent)}
          className="text-white hover:text-primary transition-colors p-1"
          aria-label={`View ${agentName} details`}
        >
          <EyeIcon className="text-[14px] md:text-[20px]" />
        </button>
      </div>

      {/* 7. Report Button (col-span-1) */}
      <div className="flex items-center font-hind justify-center md:justify-end -mr-1 md:mr-0">
        <button
          type="button"
          onClick={() => onReport?.(agent)}
          className="py-[1px] md:py-[2px] px-2 w-full text-[8px] md:text-[15px] -ml-2 md:-ml-0 text-white rounded bg-error font-hind hover:opacity-90 transition-opacity"
        >
          Report
        </button>
      </div>
    </div>
  );
}
