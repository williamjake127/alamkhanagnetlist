"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CloseIcon, WhatsAppIcon } from "../ui/Icons";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [supportList, setSupportList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/support?status=active")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setSupportList(json.data);
          } else {
            // Default fallback
            setSupportList([
              {
                name: "Customer Helpline 1",
                phone: "+96878531374",
                whatsappLink: "https://wa.me/+96878531374",
                hours: "24/7 Service",
              },
              {
                name: "Customer Helpline 2",
                phone: "+96878486803",
                whatsappLink: "https://wa.me/+96878486803",
                hours: "24/7 Service",
              },
            ]);
          }
        })
        .catch((err) => {
          console.error("Failed to load support numbers:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

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
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image
              src="/icons/headset.svg"
              alt="Support"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-primary font-hind text-lg font-medium">
            ২৪/৭ কাস্টমার সাপোর্ট
          </h3>
        </div>

        <p className="text-white text-xs md:text-sm font-hind mb-4 leading-relaxed">
          যেকোনো সমস্যা বা অভিযোগের জন্য আমাদের অফিসিয়াল সাপোর্ট হোয়াটসঅ্যাপে যোগাযোগ করুন।
        </p>

        {loading ? (
          <div className="py-6 text-center text-primary text-xs font-hind">
            Loading helplines...
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {supportList.map((contact, idx) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
