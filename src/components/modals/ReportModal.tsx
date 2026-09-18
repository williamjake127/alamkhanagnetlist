"use client";

import React from "react";
import { CloseIcon } from "../ui/Icons";
import { formatWhatsAppUrl } from "@/lib/utils";

interface ReportModalProps {
  agent: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ agent, isOpen, onClose }: ReportModalProps) {
  if (!isOpen || !agent) return null;

  const agentName = agent.name || "Agent";
  const agentId = agent.agentId || agent.id || "";
  const agentPhone = agent.phone || "";
  const agentType = (agent.type || agent.category || "master").toLowerCase();

  const reportMessage = `Hello, I want to report Agent:\n${agentName}\n(ID: ${agentId}, Phone: ${agentPhone})`;

  // Extract inherited contact numbers from reportTo object or fallback
  const adminContact = agent.reportTo?.admin?.phone || agent.adminContact;
  const superAdminContact = agent.reportTo?.superAdmin?.phone || agent.superAdminContact;
  const subAdminContact = agent.reportTo?.subAdmin?.phone || agent.subAdminContact;
  const superContact = agent.reportTo?.super?.phone || agent.superContact;

  // Determine which report buttons to show based strictly on hierarchy level
  const showSuperButton = agentType === "master" && Boolean(superContact);
  const showSubAdminButton =
    (agentType === "master" || agentType === "super") && Boolean(subAdminContact);
  const showSuperAdminButton =
    (agentType === "master" || agentType === "super" || agentType === "sub_admin") &&
    Boolean(superAdminContact);
  const showAdminButton =
    (agentType === "master" ||
      agentType === "super" ||
      agentType === "sub_admin" ||
      agentType === "super_admin") &&
    Boolean(adminContact);

  const hasAnyReportButtons =
    showAdminButton || showSuperAdminButton || showSubAdminButton || showSuperButton;

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

        {/* Header */}
        <h3 className="text-error font-hind text-xl font-semibold mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
          <span>⚠️</span>
          <span>Report Agent</span>
        </h3>

        {/* Agent Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6">
          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Name
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-medium">
              {agentName}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Type
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-medium uppercase">
              {agentType.replace("_", " ")}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              Number
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-mono font-medium">
              {agentPhone}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-primary text-xs md:text-sm font-hind block font-medium">
              ID Number
            </label>
            <div className="bg-deep_black rounded-[8px] py-2 px-3 text-xs md:text-sm text-white font-mono font-medium">
              {agentId}
            </div>
          </div>
        </div>

        {/* Dynamic Hierarchy Report Buttons */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray font-hind mb-3 text-center">
            অভিযোগ জানাতে নিচের অপশনগুলোতে ক্লিক করে সরাসরি মেসেজ পাঠান:
          </p>

          {hasAnyReportButtons ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {/* Admin Button */}
              {showAdminButton && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] font-hind font-semibold text-gray">
                    Admin:
                  </span>
                  <a
                    href={formatWhatsAppUrl(adminContact, reportMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-white rounded bg-error text-[11px] sm:text-xs px-1.5 py-2 font-hind hover:opacity-90 transition-opacity font-medium shadow"
                  >
                    Report To Admin
                  </a>
                </div>
              )}

              {/* Super Admin Button */}
              {showSuperAdminButton && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] font-hind font-semibold text-gray truncate max-w-full">
                    Super Admin:
                  </span>
                  <a
                    href={formatWhatsAppUrl(superAdminContact, reportMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-white rounded bg-error text-[11px] sm:text-xs px-1.5 py-2 font-hind hover:opacity-90 transition-opacity font-medium shadow"
                  >
                    Report To Super Admin
                  </a>
                </div>
              )}

              {/* Sub Admin Button */}
              {showSubAdminButton && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] font-hind font-semibold text-gray truncate max-w-full">
                    Sub Admin:
                  </span>
                  <a
                    href={formatWhatsAppUrl(subAdminContact, reportMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-white rounded bg-error text-[11px] sm:text-xs px-1.5 py-2 font-hind hover:opacity-90 transition-opacity font-medium shadow"
                  >
                    Report To Sub Admin
                  </a>
                </div>
              )}

              {/* Super Button */}
              {showSuperButton && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] font-hind font-semibold text-gray">
                    Super:
                  </span>
                  <a
                    href={formatWhatsAppUrl(superContact, reportMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-white rounded bg-error text-[11px] sm:text-xs px-1.5 py-2 font-hind hover:opacity-90 transition-opacity font-medium shadow"
                  >
                    Report To Super
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 text-center text-gray text-xs font-hind bg-deep_black rounded-[8px]">
              {agentType === "admin"
                ? "এডমিনের জন্য কোন রিপোর্ট অপশন প্রযোজ্য নয়।"
                : "এই এজেন্টের জন্য কোনো উর্ধ্বতন কর্মকর্তা নিযুক্ত নেই।"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
