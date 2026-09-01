"use client";

import React from "react";
import { CloseIcon, WhatsAppIcon, HeadsetIcon } from "../ui/Icons";
import { useSiteData } from "@/lib/site-context";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { getSupportContacts } = useSiteData();
  const supportList = getSupportContacts();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light_black w-full max-w-md p-6 sm:p-8 rounded-[10px] relative border border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-white/10">
          <HeadsetIcon className="w-5 h-5 text-primary flex-shrink-0" />
          <h3 className="text-primary font-hind text-lg font-medium">
            ২৪/৭ কাস্টমার সাপোর্ট
          </h3>
        </div>

        <p className="text-white text-xs md:text-sm font-hind mb-4 leading-relaxed">
          যেকোনো সমস্যা বা অভিযোগের জন্য আমাদের অফিসিয়াল সাপোর্ট হোয়াটসঅ্যাপে যোগাযোগ করুন।
        </p>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {supportList && supportList.length > 0 ? (
            supportList.map((contact, idx) => (
              <div
                key={contact._id || idx}
                className="flex items-center justify-between p-3 rounded-[8px] bg-deep_black border border-white/5 hover:border-primary/20 transition-colors"
              >
                <div>
                  <h4 className="text-white text-xs md:text-sm font-hind font-medium">
                    {contact.name}
                  </h4>
                  <p className="text-gray text-[11px] font-sans">
                    {contact.phone} •{" "}
                    <span className="text-success font-hind">{contact.hours || "24/7 Service"}</span>
                  </p>
                </div>

                <a
                  href={contact.whatsappLink || `https://wa.me/${contact.phone?.replace(/[^0-9+]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-success text-white px-3 py-1 rounded text-xs font-hind flex items-center gap-1 hover:opacity-90 transition-opacity font-medium shadow"
                >
                  <WhatsAppIcon className="text-sm" />
                  <span>WhatsApp</span>
                </a>
              </div>
            ))
          ) : (
            <div className="py-8 text-center bg-deep_black/50 rounded-[8px] border border-dashed border-white/10">
              <p className="text-gray text-xs md:text-sm font-hind">
                বর্তমানে কোনো হেল্পলাইন যুক্ত নেই।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
