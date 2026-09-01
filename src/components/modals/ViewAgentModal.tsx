"use client";

import React from "react";
import { CloseIcon, WhatsAppIcon } from "../ui/Icons";
import { StarRating } from "../ui/StarRating";

interface ViewAgentModalProps {
  agent: any | null;
  isOpen: boolean;
  onClose: () => void;
  onReport?: (agent: any) => void;
}

export function ViewAgentModal({
  agent,
  isOpen,
  onClose,
  onReport,
}: ViewAgentModalProps) {
  if (!isOpen || !agent) return null;

  const agentName = agent.name || "Agent";
  const agentId = agent.agentId || agent.id || "";
  const agentPhone = agent.phone || "";
  const agentType = (agent.type || agent.category || "master").toLowerCase();
  const whatsappUrl =
    agent.whatsapp || `https://wa.me/${agentPhone.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light_black w-full max-w-lg p-6 sm:p-8 rounded-[10px] relative border border-white/10 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="text-xl" />
        </button>

        <h3 className="text-primary font-hind text-xl font-semibold mb-4 pb-2 border-b border-white/10">
          Agent Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Name
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-medium">
              {agentName}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Type
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-medium uppercase">
              {agentType.replace("_", " ")}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Number
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-mono font-medium">
              {agentPhone}
            </div>
          </div>

          {/* ID Number */}
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              ID Number
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-mono font-medium">
              {agentId}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Message
            </label>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-deep_black hover:bg-white/10 transition-colors rounded-[8px] py-2 px-3 text-xs md:text-sm text-white flex items-center gap-2"
            >
              <WhatsAppIcon className="text-success text-base" />
              <span>Whatsapp</span>
            </a>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Rating
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 flex items-center justify-center">
              <StarRating rating={agent.rating || 5} className="ml-0" />
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] md:text-[11px] bg-primary text-deep_black font-semibold rounded px-2 py-0.5 font-hind">
              Verified Agent
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onReport?.(agent);
            }}
            className="px-4 py-1.5 text-xs md:text-sm rounded-[4px] bg-error text-white font-hind hover:opacity-90 transition-opacity font-medium shadow"
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
}
