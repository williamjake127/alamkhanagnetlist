"use client";

import React, { useState, useEffect } from "react";
import { Save, Facebook, AlertCircle, CheckCircle } from "lucide-react";

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
        setSiteNotice(json.data.siteNotice || "");
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

      setSuccessMessage("Website settings updated successfully!");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white font-hind">
          Facebook Group & Site Settings
        </h2>
        <p className="text-xs md:text-sm text-gray font-hind">
          Update the dynamic official Facebook group link and global site notices
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3 rounded-[8px] bg-success/15 border border-success/30 text-success text-xs md:text-sm font-hind flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-[8px] bg-error/15 border border-error/30 text-error text-xs md:text-sm font-hind flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-light_black p-6 rounded-[10px] border border-white/5 space-y-6">
        {/* Section: Facebook Group Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Facebook className="w-5 h-5 text-blue" />
            <h3 className="text-base font-semibold text-primary font-hind">
              Facebook Group Settings
            </h3>
          </div>

          <div>
            <label className="text-white text-xs md:text-sm font-hind block mb-1.5 font-medium">
              Official Facebook Group Link URL *
            </label>
            <input
              type="url"
              value={facebookGroupLink}
              onChange={(e) => setFacebookGroupLink(e.target.value)}
              placeholder="https://facebook.com/groups/..."
              required
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-sans"
            />
            <p className="text-gray text-[11px] font-hind mt-1.5">
              This link will be dynamically opened when visitors click "এখানে ক্লিক করুন" on the homepage official banner.
            </p>
          </div>
        </div>

        {/* Section: Optional Site Notice */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-base font-semibold text-primary font-hind">
            Global Announcement / Notice
          </h3>

          <div>
            <label className="text-white text-xs md:text-sm font-hind block mb-1.5 font-medium">
              Site Announcement Message
            </label>
            <textarea
              rows={3}
              value={siteNotice}
              onChange={(e) => setSiteNotice(e.target.value)}
              placeholder="Enter optional announcement text..."
              className="w-full py-2.5 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-hind"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving || loading}
            className="px-6 py-2.5 rounded-[8px] bg-primary text-deep_black font-bold text-sm font-hind hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 shadow-md shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
