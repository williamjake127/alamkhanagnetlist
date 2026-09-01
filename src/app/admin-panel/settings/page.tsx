"use client";

import React, { useState, useEffect } from "react";
import { Check, Facebook, AlertCircle, CheckCircle2, Globe, ExternalLink } from "lucide-react";

export default function WebsiteSettingsAdminPage() {
  const [facebookGroupLink, setFacebookGroupLink] = useState("");
  const [siteNotice, setSiteNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setFacebookGroupLink(json.data.facebookGroupLink || "https://facebook.com");
        setSiteNotice(json.data.siteNotice || "Welcome to Betbuzz365 Official Agent Directory");
      }
    } catch (err: any) {
      setErrorMessage("Failed to load settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facebookGroupLink,
          siteNotice,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update settings.");
      }

      setSuccessMessage("Website configurations saved successfully!");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Website & Social Settings
        </h2>
        <p className="text-xs sm:text-sm text-gray">
          Configure dynamic social links and site announcements
        </p>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Settings Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-[#12161d] p-4 sm:p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl"
        >
          {/* Section: Facebook Group */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Facebook className="w-4 h-4 text-blue" />
              <h3 className="text-sm font-bold text-white">
                Official Facebook Group
              </h3>
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Facebook Group URL <span className="text-primary">*</span>
              </label>
              <input
                type="url"
                value={facebookGroupLink}
                onChange={(e) => setFacebookGroupLink(e.target.value)}
                placeholder="https://facebook.com/groups/..."
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-mono"
              />
              <p className="text-[11px] text-gray/70 mt-1">
                Target link for the "এখানে ক্লিক করুন" banner on the homepage.
              </p>
            </div>
          </div>

          {/* Section: Site Notice */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-white">
                Portal Announcement Notice
              </h3>
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1">
                Banner Message Text
              </label>
              <textarea
                rows={3}
                value={siteNotice}
                onChange={(e) => setSiteNotice(e.target.value)}
                placeholder="Enter announcement text..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="bg-[#12161d] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase font-bold text-primary tracking-wider mb-2">
              Live Banner Preview
            </h4>
            <p className="text-xs text-gray mb-3">
              How the official group banner appears to visitors on mobile and desktop:
            </p>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-900 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                <span className="text-xs font-bold">অফিসিয়াল ফেসবুক গ্রুপ</span>
              </div>
              <p className="text-[11px] opacity-85 leading-snug">
                আমাদের অফিশিয়াল ফেসবুক গ্রুপে যুক্ত হতে নিচের বাটনে চাপুন।
              </p>
              <a
                href={facebookGroupLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-white text-blue-900 rounded-lg text-xs font-bold"
              >
                এখানে ক্লিক করুন →
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5">
            <a
              href="/"
              target="_blank"
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview on Public Site</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
