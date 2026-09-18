"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Check,
  Facebook,
  AlertCircle,
  CheckCircle2,
  Globe,
  Upload,
  Trash2,
  Plus,
  ImageIcon,
  Loader2,
  Layers,
  Link2,
  ExternalLink,
  Sparkles,
  Search,
  Type,
  Smile,
} from "lucide-react";
import { useSiteData, ProxyLink } from "@/lib/site-context";

export default function WebsiteSettingsAdminPage() {
  const { settings, updateSettings } = useSiteData();

  // Branding & SEO
  const [siteName, setSiteName] = useState(settings.siteName || "");
  const [siteLogo, setSiteLogo] = useState(settings.siteLogo || "");
  const [siteFavicon, setSiteFavicon] = useState(settings.siteFavicon || "");
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(settings.metaKeywords || "");

  // Social & Notice
  const [facebookGroupLink, setFacebookGroupLink] = useState(settings.facebookGroupLink || "https://facebook.com");
  const [siteNotice, setSiteNotice] = useState(
    settings.siteNotice ||
      "স্বাগতম আমাদের অফিসিয়াল এজেন্ট তালিকায়। নিরাপদ লেনদেনের জন্য সর্বদা ভেরিফাইড এজেন্টদের সাথে যোগাযোগ করুন।"
  );

  // Sliders
  const [sliderImages, setSliderImages] = useState<string[]>(settings.sliderImages || []);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Proxy Links
  const [proxyLinks, setProxyLinks] = useState<ProxyLink[]>(
    settings.proxyLinks || []
  );

  const [newProxyTitle, setNewProxyTitle] = useState("");
  const [newProxyUrl, setNewProxyUrl] = useState("");
  const [newProxyStatus, setNewProxyStatus] = useState<"active" | "inactive">("active");

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingSlider, setUploadingSlider] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  // Sync with context if updated
  useEffect(() => {
    if (settings) {
      if (settings.siteName !== undefined) setSiteName(settings.siteName);
      if (settings.siteLogo !== undefined) setSiteLogo(settings.siteLogo);
      if (settings.siteFavicon !== undefined) setSiteFavicon(settings.siteFavicon);
      if (settings.metaTitle !== undefined) setMetaTitle(settings.metaTitle);
      if (settings.metaDescription !== undefined) setMetaDescription(settings.metaDescription);
      if (settings.metaKeywords !== undefined) setMetaKeywords(settings.metaKeywords);
      if (settings.facebookGroupLink) setFacebookGroupLink(settings.facebookGroupLink);
      if (settings.siteNotice) setSiteNotice(settings.siteNotice);
      if (Array.isArray(settings.sliderImages)) setSliderImages(settings.sliderImages);
      if (Array.isArray(settings.proxyLinks) && settings.proxyLinks.length > 0) {
        setProxyLinks(settings.proxyLinks);
      }
    }
  }, [settings]);

  // Logo Upload Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingLogo(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.urls?.[0]) {
        throw new Error(json.error || "Failed to upload logo.");
      }

      const uploadedLogoUrl = json.urls[0];
      setSiteLogo(uploadedLogoUrl);
      await updateSettings({ siteLogo: uploadedLogoUrl });
      setSuccessMessage("Site logo uploaded and applied instantly!");
    } catch (err: any) {
      setErrorMessage("Logo upload failed: " + err.message);
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    setSiteLogo("");
    await updateSettings({ siteLogo: "" });
    setSuccessMessage("Logo removed. Site will use site name or clean header.");
  };

  // Favicon Upload Handler
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFavicon(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.urls?.[0]) {
        throw new Error(json.error || "Failed to upload favicon.");
      }

      const uploadedFaviconUrl = json.urls[0];
      setSiteFavicon(uploadedFaviconUrl);
      await updateSettings({ siteFavicon: uploadedFaviconUrl });
      setSuccessMessage("Favicon uploaded and updated instantly!");
    } catch (err: any) {
      setErrorMessage("Favicon upload failed: " + err.message);
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) {
        faviconInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFavicon = async () => {
    setSiteFavicon("");
    await updateSettings({ siteFavicon: "" });
    setSuccessMessage("Favicon removed.");
  };

  // Auto Generate SEO Metadata from Site Name
  const handleAutoGenerateSEO = () => {
    const brand = siteName.trim();
    if (!brand) {
      setMetaTitle("Official Agent Directory - ভেরিফাইড এজেন্ট তালিকা");
      setMetaDescription(
        "Official Agent Directory. Find verified Admin, Super Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp."
      );
      setMetaKeywords(
        "agent list, official agent directory, admin list, super admin, master agent, super agent, sub admin, verified agents, whatsapp contact, 24/7 customer support"
      );
      setSuccessMessage("Generated general SEO metadata.");
      return;
    }

    setMetaTitle(`${brand} Agent List - Official Agent Directory`);
    setMetaDescription(
      `Official ${brand} Agent Directory. Find verified ${brand} Admin, Super Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp.`
    );
    setMetaKeywords(
      `${brand}, ${brand} agent list, ${brand} admin, ${brand} super admin, ${brand} master agent, ${brand} super agent, ${brand} sub admin, ${brand} agent contact, ${brand} whatsapp, verified agents, 24/7 support`
    );
    setSuccessMessage(`Automated SEO metadata generated for "${brand}"!`);
  };

  // Slider Gallery Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingSlider(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to upload images.");
      }

      if (Array.isArray(json.urls) && json.urls.length > 0) {
        const newImages = [...sliderImages, ...json.urls];
        setSliderImages(newImages);
        await updateSettings({ sliderImages: newImages });
        setSuccessMessage(`${json.urls.length} photo(s) uploaded and saved!`);
      }
    } catch (err: any) {
      setErrorMessage("Gallery upload failed: " + err.message);
    } finally {
      setUploadingSlider(false);
      if (sliderInputRef.current) {
        sliderInputRef.current.value = "";
      }
    }
  };

  const handleAddImageUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    const newImages = [...sliderImages, imageUrlInput.trim()];
    setSliderImages(newImages);
    setImageUrlInput("");
    await updateSettings({ sliderImages: newImages });
    setSuccessMessage("Photo link added and saved instantly!");
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const newImages = sliderImages.filter((_, idx) => idx !== indexToRemove);
    setSliderImages(newImages);
    await updateSettings({ sliderImages: newImages });
    setSuccessMessage("Photo removed successfully.");
  };

  // Proxy Link Operations
  const handleAddProxyLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProxyTitle.trim() || !newProxyUrl.trim()) {
      setErrorMessage("Please enter both Link Title and URL.");
      return;
    }

    const formattedUrl =
      newProxyUrl.trim().startsWith("http://") || newProxyUrl.trim().startsWith("https://")
        ? newProxyUrl.trim()
        : `https://${newProxyUrl.trim()}`;

    const newProxy: ProxyLink = {
      id: `proxy_${Date.now()}`,
      title: newProxyTitle.trim(),
      url: formattedUrl,
      status: newProxyStatus,
    };

    const updated = [...proxyLinks, newProxy];
    setProxyLinks(updated);
    setNewProxyTitle("");
    setNewProxyUrl("");
    setNewProxyStatus("active");

    await updateSettings({ proxyLinks: updated });
    setSuccessMessage("Proxy link added and updated live!");
  };

  const handleToggleProxyStatus = async (index: number) => {
    const updated = proxyLinks.map((p, idx) =>
      idx === index
        ? { ...p, status: p.status === "active" ? ("inactive" as const) : ("active" as const) }
        : p
    );
    setProxyLinks(updated);
    await updateSettings({ proxyLinks: updated });
  };

  const handleDeleteProxyLink = async (index: number) => {
    const updated = proxyLinks.filter((_, idx) => idx !== index);
    setProxyLinks(updated);
    await updateSettings({ proxyLinks: updated });
    setSuccessMessage("Proxy link removed.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const success = await updateSettings({
        siteName,
        siteLogo,
        siteFavicon,
        metaTitle,
        metaDescription,
        metaKeywords,
        facebookGroupLink,
        siteNotice,
        sliderImages,
        proxyLinks,
      });

      if (!success) {
        throw new Error("Failed to save settings to server.");
      }

      setSuccessMessage("All website configurations and SEO settings saved successfully!");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const cleanDomain = (url: string) => {
    if (!url) return "";
    return url
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "");
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Website Settings, Branding & SEO
        </h2>
        <p className="text-xs sm:text-sm text-gray">
          Configure dynamic site branding, custom logo, favicon, automated SEO metadata, proxy links, and announcement banners
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

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#12161d] p-4 sm:p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl"
      >
        {/* Section 1: Dynamic Site Branding, Logo & Favicon */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Type className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-white font-hind">
              সাইট নাম, লোগো ও ফ্যাভআইকন (Site Name, Logo & Favicon)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Site Name */}
            <div>
              <label className="block text-gray text-xs font-medium mb-1 font-hind">
                সাইটের নাম (Site Name / Brand)
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="যেমনঃ আপনার সাইটের নাম লিখুন..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-sans"
              />
              <p className="text-[11px] text-gray/70 mt-1 font-hind">
                এখানে যে নাম দিবেন তা পুরো সাইটে, হেডারে ও এসইও-তে স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে।
              </p>
            </div>

            {/* Site Logo Uploader */}
            <div>
              <label className="block text-gray text-xs font-medium mb-1 font-hind">
                সাইট লোগো (Custom Logo)
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="site-logo-input"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 font-hind"
                >
                  {uploadingLogo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>আপলোড...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-primary" />
                      <span>লোগো আপলোড</span>
                    </>
                  )}
                </button>

                {siteLogo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-2.5 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs transition-colors flex items-center gap-1"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray/70 mt-1 font-hind">
                লোগো আপলোড করলে তা ফ্রন্টএন্ড হেডারে দেখাবে।
              </p>
            </div>

            {/* Site Favicon Uploader */}
            <div>
              <label className="block text-gray text-xs font-medium mb-1 font-hind">
                সাইট ফ্যাভআইকন (Browser Favicon)
              </label>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/png,image/jpeg,image/x-icon,image/svg+xml,image/webp"
                onChange={handleFaviconUpload}
                className="hidden"
                id="site-favicon-input"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={uploadingFavicon}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 font-hind"
                >
                  {uploadingFavicon ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>আপলোড...</span>
                    </>
                  ) : (
                    <>
                      <Smile className="w-4 h-4 text-primary" />
                      <span>ফ্যাভআইকন আপলোড</span>
                    </>
                  )}
                </button>

                {siteFavicon && (
                  <button
                    type="button"
                    onClick={handleRemoveFavicon}
                    className="px-2.5 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs transition-colors flex items-center gap-1"
                    title="Remove Favicon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray/70 mt-1 font-hind">
                ব্রাউজার ট্যাবে যে আইকন প্রদর্শিত হবে (.png, .ico, .svg)।
              </p>
            </div>
          </div>

          {/* Logo & Favicon Live Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Logo Preview */}
            <div className="p-3 rounded-xl bg-[#090d12] border border-white/10 flex items-center gap-3">
              <span className="text-xs text-gray font-hind whitespace-nowrap">লোগো প্রিভিউঃ</span>
              {siteLogo ? (
                <div className="relative w-28 h-8 bg-black/60 rounded p-1">
                  <Image
                    src={siteLogo}
                    alt="Site Logo"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray/50 italic">কোনো লোগো নেই</span>
              )}
            </div>

            {/* Favicon Preview */}
            <div className="p-3 rounded-xl bg-[#090d12] border border-white/10 flex items-center gap-3">
              <span className="text-xs text-gray font-hind whitespace-nowrap">ফ্যাভআইকন প্রিভিউঃ</span>
              {siteFavicon ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 bg-black rounded p-0.5 border border-white/20">
                    <Image
                      src={siteFavicon}
                      alt="Favicon"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">Active Tab Icon</span>
                </div>
              ) : (
                <span className="text-xs text-gray/50 italic">কোনো কাস্টম ফ্যাভআইকন নেই</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Automated Dynamic SEO & Keywords */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-hind">
                স্বয়ংক্রিয় এসইও সেটিংস ও কিওয়ার্ড (Automated SEO & Keywords)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAutoGenerateSEO}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 font-hind"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ সাইটের নাম অনুযায়ী অটো এসইও তৈরি করুন</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-gray text-xs font-medium mb-1 font-hind">
                এসইও মেটা টাইটেল (SEO Title)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={
                  siteName
                    ? `${siteName} Agent List - Official Agent Directory`
                    : "Official Agent Directory - ভেরিফাইড এজেন্ট তালিকা"
                }
                className="w-full px-3 py-2 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1 font-hind">
                এসইও মেটা ডেসক্রিপশন (Meta Description)
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={
                  siteName
                    ? `Official ${siteName} Agent Directory. Find verified Admin, Super Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp.`
                    : "Official Agent Directory. Find verified Admin, Super Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp."
                }
                className="w-full px-3 py-2 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-gray text-xs font-medium mb-1 font-hind">
                এসইও মেটা কিওয়ার্ড তালিকা (Meta Keywords - Comma Separated)
              </label>
              <textarea
                rows={3}
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="keyword1, keyword2, agent list, master agent, super agent, admin list, whatsapp agent..."
                className="w-full px-3 py-2 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-mono"
              />
              <p className="text-[11px] text-gray/70 mt-1 font-hind">
                সার্চ ইঞ্জিনের জন্য আপনার কিওয়ার্ড তালিকা কমা দিয়ে লিখুন অথবা উপরের "অটো এসইও তৈরি করুন" বাটনে ক্লিক করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Official Facebook Group */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Facebook className="w-4 h-4 text-blue" />
            <h3 className="text-sm font-bold text-white font-hind">
              আমাদের অফিসিয়াল ফেসবুক গ্রুপ লিংক (Official Facebook Group)
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
            <p className="text-[11px] text-gray/70 mt-1 font-hind">
              হোমপেজে "আমাদের অফিসিয়াল ফেসবুক গ্রুপঃ [এখানে ক্লিক করুন]" বাটনে এই লিংকটি কাজ করবে।
            </p>
          </div>
        </div>

        {/* Section 4: Scrolling Notice Board */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-white font-hind">
              পোর্টাল অ্যানাউন্সমেন্ট নোটিশ (Scrolling Notice Bar)
            </h3>
          </div>

          <div>
            <label className="block text-gray text-xs font-medium mb-1 font-hind">
              নোটিশ টেক্সট (Notice Message Text)
            </label>
            <textarea
              rows={2}
              value={siteNotice}
              onChange={(e) => setSiteNotice(e.target.value)}
              placeholder="যে টেক্সটটি ডান থেকে বামে স্ক্রল করবে তা লিখুন..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs sm:text-sm font-hind"
            />
            <p className="text-[11px] text-gray/70 mt-1 font-hind">
              এই লেখাটি ফেসবুক গ্রুপের উপরের নোটিশ বারে ডান থেকে বামে নরমাল স্পিডে স্ক্রল হবে।
            </p>
          </div>
        </div>

        {/* Section 5: Proxy & Site Links (সাইটের সকল লিংক) */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-white font-hind">
                সাইটের সকল লিংক / প্রক্সি লিংক ম্যানেজার (Proxy & Site Links)
              </h3>
            </div>
            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
              {proxyLinks.length} {proxyLinks.length === 1 ? "Link" : "Links"}
            </span>
          </div>

          {/* Add New Proxy Link Card */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#090d12] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-hind flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>নতুন প্রক্সি লিংক যোগ করুন (Add Proxy Link)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-4">
                <label className="block text-gray text-[11px] font-medium mb-1 font-hind">
                  লিংক টাইটেল (Title)
                </label>
                <input
                  type="text"
                  value={newProxyTitle}
                  onChange={(e) => setNewProxyTitle(e.target.value)}
                  placeholder="যেমনঃ পয়েন্ট এর সাইট"
                  className="w-full px-3 py-2 rounded-xl bg-[#12161d] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs font-hind"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-gray text-[11px] font-medium mb-1 font-hind">
                  সাইট লিংক / URL (Link)
                </label>
                <input
                  type="text"
                  value={newProxyUrl}
                  onChange={(e) => setNewProxyUrl(e.target.value)}
                  placeholder="যেমনঃ https://Chorki365.bet"
                  className="w-full px-3 py-2 rounded-xl bg-[#12161d] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleAddProxyLink}
                  className="w-full py-2 px-3 rounded-xl bg-primary text-deep_black font-bold text-xs flex items-center justify-center gap-1 hover:bg-amber-400 active:scale-95 transition-all shadow-md font-hind"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ যোগ করুন (Add)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Proxy Links List */}
          {proxyLinks.length > 0 ? (
            <div className="space-y-2">
              <div className="space-y-2">
                {proxyLinks.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className="p-3 rounded-xl bg-[#090d12] border border-white/10 flex items-center justify-between gap-3 text-xs sm:text-sm font-hind"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold font-mono">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-primary block truncate">
                          {link.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-white text-xs">
                            {cleanDomain(link.url)}
                          </span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray hover:text-white"
                            title="Open URL"
                          >
                            <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleProxyStatus(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                          link.status !== "inactive"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            link.status !== "inactive" ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        <span>{link.status !== "inactive" ? "Active" : "Inactive"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProxyLink(idx)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray hover:text-rose-400 transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Section 6: Homepage Updates Photo Slider */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-hind">
                সাইটের নতুন সব আপডেটঃ ফটো স্লাইডার (Updates Image Slider)
              </h3>
            </div>
            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
              {sliderImages.length} {sliderImages.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          <p className="text-xs text-gray font-hind">
            হোমপেজের "সাইটের নতুন সব আপডেটঃ" সেকশনে এই ছবিগুলো একের পর এক পরিবর্তিত হবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                ref={sliderInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
                id="gallery-file-input"
              />
              <button
                type="button"
                onClick={() => sliderInputRef.current?.click()}
                disabled={uploadingSlider}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue/20 to-indigo-500/20 border border-blue/30 hover:border-blue/60 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:bg-blue/30 active:scale-95 disabled:opacity-50 font-hind"
              >
                {uploadingSlider ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>ছবি আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-primary" />
                    <span>গ্যালারি থেকে ছবি আপলোড করুন</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="অথবা ছবির URL পেস্ট করুন..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#090d12] border border-white/10 text-white outline-none focus:border-primary transition-colors text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrlInput.trim()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {sliderImages.length > 0 ? (
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sliderImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden shadow-md"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Slider image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm z-10">
                      #{index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md opacity-90 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-white/10 text-center space-y-1 bg-[#090d12]/50">
              <ImageIcon className="w-8 h-8 text-gray/40 mx-auto" />
              <p className="text-xs text-gray font-hind">
                এখনো কোন ছবি যোগ করা হয়নি। ডিফল্ট নোটিশ কার্ড প্রদর্শিত হচ্ছে।
              </p>
            </div>
          )}
        </div>

        {/* Save Settings Button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving || uploadingLogo || uploadingFavicon || uploadingSlider}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-amber-400 text-deep_black font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 font-hind"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save All Settings (সকল সেটিংস, ফ্যাভআইকন ও এসইও সংরক্ষণ করুন)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
