"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Agent } from "./types";
import { INITIAL_AGENTS } from "./data/agents";

export interface ProxyLink {
  id?: string;
  title: string;
  url: string;
  status?: "active" | "inactive";
}

export interface WebsiteSettingsData {
  _id?: string;
  siteName: string;
  siteLogo: string;
  siteFavicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  facebookGroupLink: string;
  siteNotice: string;
  sliderImages: string[];
  proxyLinks: ProxyLink[];
}

export interface SupportContact {
  _id: string;
  id?: string;
  name: string;
  phone: string;
  whatsappLink: string;
  hours: string;
  status: "active" | "inactive";
}

interface SiteDataContextType {
  agents: Agent[];
  supportList: SupportContact[];
  settings: WebsiteSettingsData;
  isLoading: boolean;
  getAgentsByCategory: (category: string, status?: string) => Agent[];
  getSupportContacts: () => SupportContact[];
  refreshData: (opts?: { force?: boolean }) => Promise<void>;
  updateSettings: (newSettings: Partial<WebsiteSettingsData>) => Promise<boolean>;
  addAgent: (agent: any) => Promise<boolean>;
  updateAgent: (id: string, agent: any) => Promise<boolean>;
  deleteAgent: (id: string) => Promise<boolean>;
  toggleAgentStatus: (id: string) => Promise<boolean>;
  addSupport: (contact: any) => Promise<boolean>;
  updateSupport: (id: string, contact: any) => Promise<boolean>;
  deleteSupport: (id: string) => Promise<boolean>;
  clearAllDatabase: () => Promise<boolean>;
}

const DEFAULT_PROXY_LINKS: ProxyLink[] = [];

const DEFAULT_SETTINGS: WebsiteSettingsData = {
  siteName: "",
  siteLogo: "",
  siteFavicon: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  facebookGroupLink: "",
  siteNotice: "",
  sliderImages: [],
  proxyLinks: [],
};

const SiteDataContext = createContext<SiteDataContextType>({
  agents: INITIAL_AGENTS,
  supportList: [],
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  getAgentsByCategory: () => [],
  getSupportContacts: () => [],
  refreshData: async () => {},
  updateSettings: async () => false,
  addAgent: async () => false,
  updateAgent: async () => false,
  deleteAgent: async () => false,
  toggleAgentStatus: async () => false,
  addSupport: async () => false,
  updateSupport: async () => false,
  deleteSupport: async () => false,
  clearAllDatabase: async () => false,
});

export const useSiteData = () => useContext(SiteDataContext);

// LocalStorage cache keys
const CACHE_KEY_AGENTS = "bb365_cached_agents";
const CACHE_KEY_SETTINGS = "bb365_cached_settings";
const CACHE_KEY_SUPPORT = "bb365_cached_support";
const CACHE_KEY_AGENTS_TS = "bb365_cached_agents_ts";
const CACHE_KEY_SETTINGS_TS = "bb365_cached_settings_ts";
const CACHE_KEY_SUPPORT_TS = "bb365_cached_support_ts";

// Fast cache revalidation throttle (5 seconds)
const CACHE_THROTTLE_MS = 5_000;

// Cross-tab real-time sync channel
const SYNC_CHANNEL_NAME = "agentlist_sync_channel";
function broadcastSync(type: string, data?: any) {
  if (typeof window !== "undefined") {
    try {
      if ("BroadcastChannel" in window) {
        const ch = new BroadcastChannel(SYNC_CHANNEL_NAME);
        ch.postMessage({ type, data });
        ch.close();
      }
    } catch (e) {}
  }
}

function isCacheThrottled(tsKey: string): boolean {
  try {
    const ts = localStorage.getItem(tsKey);
    if (!ts) return false;
    return Date.now() - Number(ts) < CACHE_THROTTLE_MS;
  } catch {
    return false;
  }
}

function hasCachedData(): boolean {
  try {
    return (
      !!localStorage.getItem(CACHE_KEY_AGENTS) ||
      !!localStorage.getItem(CACHE_KEY_SETTINGS)
    );
  } catch {
    return false;
  }
}

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [settings, setSettings] = useState<WebsiteSettingsData>(DEFAULT_SETTINGS);
  const [supportList, setSupportList] = useState<SupportContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isRefreshingRef = useRef(false);

  // ─── Step 1: Instant 0ms Hydration from Cache ───────────────────────────────
  useEffect(() => {
    try {
      const cachedAgents = localStorage.getItem(CACHE_KEY_AGENTS);
      if (cachedAgents) {
        const parsed = JSON.parse(cachedAgents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAgents(parsed);
        }
      }
      const cachedSettings = localStorage.getItem(CACHE_KEY_SETTINGS);
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings);
        if (parsed && typeof parsed === "object") {
          setSettings(parsed);
        }
      }
      const cachedSupport = localStorage.getItem(CACHE_KEY_SUPPORT);
      if (cachedSupport) {
        const parsed = JSON.parse(cachedSupport);
        if (Array.isArray(parsed)) setSupportList(parsed);
      }
    } catch (e) {}
  }, []);

  // ─── Cross-Tab Instant Sync ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === "AGENTS_UPDATED" && Array.isArray(event.data.data)) {
          setAgents(event.data.data);
        } else if (event.data?.type === "SETTINGS_UPDATED" && event.data.data) {
          setSettings(event.data.data);
        } else if (event.data?.type === "SUPPORT_UPDATED" && Array.isArray(event.data.data)) {
          setSupportList(event.data.data);
        }
      };
      return () => {
        channel.close();
      };
    } catch (e) {}
  }, []);

  // ─── SEO & Dynamic Head Updater ────────────────────────────────────────────
  useEffect(() => {
    if (typeof document === "undefined") return;

    const brand = settings.siteName ? settings.siteName.trim() : "";
    const title = settings.metaTitle
      ? settings.metaTitle
      : brand
      ? `${brand} Agent List - Official Agent Directory`
      : "Official Agent Directory - ভেরিফাইড এজেন্ট তালিকা";

    const desc = settings.metaDescription
      ? settings.metaDescription
      : brand
      ? `Official ${brand} Agent Directory. Find verified Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp.`
      : "Official Agent Directory. Find verified Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp.";

    const keywords = settings.metaKeywords
      ? settings.metaKeywords
      : brand
      ? `${brand}, ${brand} agent list, ${brand} admin, ${brand} master agent, ${brand} super agent, ${brand} sub admin, verified agents, whatsapp contact, 24/7 customer support`
      : "agent list, official agent directory, admin list, master agent, super agent, sub admin, verified agents, whatsapp contact, 24/7 customer support";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement("meta");
      metaKey.setAttribute("name", "keywords");
      document.head.appendChild(metaKey);
    }
    metaKey.setAttribute("content", keywords);

    if (settings.siteFavicon && settings.siteFavicon.trim()) {
      let faviconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement("link");
        faviconLink.rel = "icon";
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = settings.siteFavicon.trim();
    }
  }, [
    settings.siteName,
    settings.metaTitle,
    settings.metaDescription,
    settings.metaKeywords,
    settings.siteFavicon,
  ]);

  // ─── Core Silent Background Refresh ────────────────────────────────────────
  // Always runs in the background. Never blocks or flickers the UI if cached data exists.
  const refreshData = useCallback(async (opts?: { force?: boolean }) => {
    const force = opts?.force ?? false;

    // Avoid concurrent fetches
    if (isRefreshingRef.current) return;

    // Throttle checks unless forced
    if (!force) {
      const throttled =
        isCacheThrottled(CACHE_KEY_AGENTS_TS) &&
        isCacheThrottled(CACHE_KEY_SETTINGS_TS) &&
        isCacheThrottled(CACHE_KEY_SUPPORT_TS);
      if (throttled) return;
    }

    const coldStart = !hasCachedData();
    if (coldStart) setIsLoading(true);
    isRefreshingRef.current = true;

    try {
      const [agentRes, settingsRes, supportRes] = await Promise.allSettled([
        fetch("/api/agents?status=all"),
        fetch("/api/settings"),
        fetch("/api/support?status=all"),
      ]);

      if (agentRes.status === "fulfilled" && agentRes.value.ok) {
        const agentData = await agentRes.value.json();
        if (agentData.success && Array.isArray(agentData.data)) {
          const normalizedAgents: Agent[] = agentData.data.map((item: any) => ({
            id: item.agentId || item.id || item._id,
            _id: item._id || item.id,
            name: item.name,
            agentId: item.agentId || item.id,
            category: item.type || item.category || "master",
            type: item.type || item.category || "master",
            phone: item.phone,
            whatsapp: item.whatsapp,
            rating: item.rating || 5,
            appLink: item.appLink,
            avatar: item.avatar,
            image: item.image,
            reportTo: item.reportTo,
            status: item.status || "active",
          }));
          setAgents(normalizedAgents);
          try {
            localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(normalizedAgents));
            localStorage.setItem(CACHE_KEY_AGENTS_TS, String(Date.now()));
          } catch (e) {}
        }
      }

      if (settingsRes.status === "fulfilled" && settingsRes.value.ok) {
        const settingsData = await settingsRes.value.json();
        if (settingsData.success && settingsData.data) {
          const s = {
            _id: settingsData.data._id,
            siteName: settingsData.data.siteName || "",
            siteLogo: settingsData.data.siteLogo || "",
            siteFavicon: settingsData.data.siteFavicon || "",
            metaTitle: settingsData.data.metaTitle || "",
            metaDescription: settingsData.data.metaDescription || "",
            metaKeywords: settingsData.data.metaKeywords || "",
            facebookGroupLink: settingsData.data.facebookGroupLink || "https://facebook.com",
            siteNotice: settingsData.data.siteNotice || DEFAULT_SETTINGS.siteNotice,
            sliderImages: Array.isArray(settingsData.data.sliderImages)
              ? settingsData.data.sliderImages
              : [],
            proxyLinks:
              Array.isArray(settingsData.data.proxyLinks) && settingsData.data.proxyLinks.length > 0
                ? settingsData.data.proxyLinks
                : DEFAULT_PROXY_LINKS,
          };
          setSettings(s);
          try {
            localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(s));
            localStorage.setItem(CACHE_KEY_SETTINGS_TS, String(Date.now()));
          } catch (e) {}
        }
      }

      if (supportRes.status === "fulfilled" && supportRes.value.ok) {
        const supportData = await supportRes.value.json();
        if (supportData.success && Array.isArray(supportData.data)) {
          setSupportList(supportData.data);
          try {
            localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(supportData.data));
            localStorage.setItem(CACHE_KEY_SUPPORT_TS, String(Date.now()));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Background data refresh error:", err);
    } finally {
      isRefreshingRef.current = false;
      if (coldStart) setIsLoading(false);
    }
  }, []);

  // ─── Step 2: Background revalidation triggers ──────────────────────────────
  // Trigger on initial mount
  useEffect(() => {
    refreshData({ force: true });
  }, [refreshData]);

  // Trigger on window focus and visibility change (instant sync when switching tabs)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onFocus = () => refreshData({ force: true });
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshData({ force: true });
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refreshData]);

  // Background heartbeat (every 10 seconds) so visitors always have live data
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10_000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // ─── Categorized retrieval ─────────────────────────────────────────────────
  const getAgentsByCategory = useCallback(
    (category: string, status: string = "active") => {
      return agents.filter((a) => {
        const matchesCategory =
          category === "all" ||
          (a as any).type === category ||
          (a as any).category === category;
        const matchesStatus = status === "all" || a.status === status;
        return matchesCategory && matchesStatus;
      });
    },
    [agents]
  );

  const getSupportContacts = useCallback(() => {
    return supportList.filter((s) => s.status !== "inactive");
  }, [supportList]);

  // ─── Optimistic Settings Update (0ms UI latency) ───────────────────────────
  const updateSettings = async (newSettings: Partial<WebsiteSettingsData>): Promise<boolean> => {
    const previousSettings = settings;
    const updated = { ...settings, ...newSettings };

    // 1. Instant 0ms update to state and cache
    setSettings(updated);
    try {
      localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_SETTINGS_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("SETTINGS_UPDATED", updated);

    // 2. Persist to MongoDB in background
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return true;
      }
      // Rollback on failure
      setSettings(previousSettings);
      try {
        localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(previousSettings));
      } catch (e) {}
      broadcastSync("SETTINGS_UPDATED", previousSettings);
      return false;
    } catch (e) {
      setSettings(previousSettings);
      try {
        localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(previousSettings));
      } catch (err) {}
      broadcastSync("SETTINGS_UPDATED", previousSettings);
      console.error("Save settings error:", e);
      return false;
    }
  };

  // ─── Optimistic Agent Add (0ms UI latency) ─────────────────────────────────
  const addAgent = async (agentPayload: any): Promise<boolean> => {
    const tempId = `agent_${Date.now()}`;
    const cleanPhone = agentPayload.phone?.trim() || "";
    const whatsappLink =
      agentPayload.whatsapp?.trim() ||
      `https://wa.me/${cleanPhone.replace(/[^0-9+]/g, "")}`;

    const optimisticAgent: Agent = {
      id: agentPayload.agentId?.trim() || tempId,
      _id: tempId,
      name: agentPayload.name?.trim(),
      agentId: agentPayload.agentId?.trim() || tempId,
      category: agentPayload.type || agentPayload.category || "master",
      type: agentPayload.type || agentPayload.category || "master",
      phone: cleanPhone,
      whatsapp: whatsappLink,
      rating: Number(agentPayload.rating) || 5,
      appLink: agentPayload.appLink?.trim() || "",
      avatar: agentPayload.avatar,
      image: agentPayload.image,
      reportTo: agentPayload.reportTo,
      status: agentPayload.status || "active",
    };

    // 1. Instant 0ms update to state and cache
    const previousAgents = agents;
    const updated = [optimisticAgent, ...previousAgents];
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_AGENTS_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("AGENTS_UPDATED", updated);

    // 2. Persist to MongoDB in background
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentPayload),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const persisted = json.data;
        setAgents((curr) => {
          const finalAgents = curr.map((a) =>
            a._id === tempId || a.agentId === optimisticAgent.agentId
              ? {
                  ...a,
                  _id: persisted._id || a._id,
                  id: persisted.agentId || a.id,
                  reportTo: persisted.reportTo || a.reportTo,
                }
              : a
          );
          try {
            localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(finalAgents));
            localStorage.setItem(CACHE_KEY_AGENTS_TS, String(Date.now()));
          } catch (e) {}
          broadcastSync("AGENTS_UPDATED", finalAgents);
          return finalAgents;
        });
        return true;
      } else {
        // Rollback on server error
        setAgents(previousAgents);
        try {
          localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
        } catch (e) {}
        broadcastSync("AGENTS_UPDATED", previousAgents);
        return false;
      }
    } catch (e) {
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (err) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      console.error("Add agent error:", e);
      return false;
    }
  };

  // ─── Optimistic Agent Update (0ms UI latency) ──────────────────────────────
  const updateAgent = async (id: string, agentPayload: any): Promise<boolean> => {
    const previousAgents = agents;
    const updated = agents.map((a) => {
      const aid = (a as any)._id || a.id || (a as any).agentId;
      if (aid === id || a.id === id) {
        return {
          ...a,
          ...agentPayload,
          category: agentPayload.type || agentPayload.category || a.category,
          type: agentPayload.type || agentPayload.category || (a as any).type,
        };
      }
      return a;
    });

    // 1. Instant 0ms update
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_AGENTS_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("AGENTS_UPDATED", updated);

    // 2. Persist in background
    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentPayload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return true;
      }
      // Rollback on failure
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (e) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      return false;
    } catch (e) {
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (err) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      console.error("Update agent error:", e);
      return false;
    }
  };

  // ─── Optimistic Agent Delete (0ms UI latency) ──────────────────────────────
  const deleteAgent = async (id: string): Promise<boolean> => {
    const previousAgents = agents;
    const updated = agents.filter((a) => {
      const aid = (a as any)._id || a.id || (a as any).agentId;
      return aid !== id && a.id !== id;
    });

    // 1. Instant 0ms update
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_AGENTS_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("AGENTS_UPDATED", updated);

    // 2. Persist in background
    try {
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        return true;
      }
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (e) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      return false;
    } catch (e) {
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (err) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      console.error("Delete agent error:", e);
      return false;
    }
  };

  // ─── Optimistic Agent Status Toggle (0ms UI latency) ───────────────────────
  const toggleAgentStatus = async (id: string): Promise<boolean> => {
    const previousAgents = agents;
    let targetStatus = "active";
    const current = agents.find((a) => {
      const aid = (a as any)._id || a.id || (a as any).agentId;
      return aid === id || a.id === id;
    });
    if (current) {
      targetStatus = current.status === "active" ? "inactive" : "active";
    }

    const updated = agents.map((a) => {
      const aid = (a as any)._id || a.id || (a as any).agentId;
      if (aid === id || a.id === id) {
        return { ...a, status: targetStatus as "active" | "inactive" };
      }
      return a;
    });

    // 1. Instant 0ms update
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_AGENTS_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("AGENTS_UPDATED", updated);

    // 2. Persist in background
    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return true;
      }
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (e) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      return false;
    } catch (e) {
      setAgents(previousAgents);
      try {
        localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(previousAgents));
      } catch (err) {}
      broadcastSync("AGENTS_UPDATED", previousAgents);
      console.error("Toggle status error:", e);
      return false;
    }
  };

  // ─── Optimistic Support Mutations (0ms UI latency) ─────────────────────────
  const addSupport = async (contactPayload: any): Promise<boolean> => {
    const tempId = `support_${Date.now()}`;
    const cleanPhone = contactPayload.phone?.trim() || "";
    const optimisticSupport: SupportContact = {
      _id: tempId,
      id: tempId,
      name: contactPayload.name?.trim(),
      phone: cleanPhone,
      whatsappLink:
        contactPayload.whatsappLink?.trim() ||
        `https://wa.me/${cleanPhone.replace(/[^0-9+]/g, "")}`,
      hours: contactPayload.hours || "24/7 Service",
      status: contactPayload.status || "active",
    };

    const previousSupport = supportList;
    const updated = [optimisticSupport, ...previousSupport];
    setSupportList(updated);
    try {
      localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_SUPPORT_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("SUPPORT_UPDATED", updated);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const persisted = json.data;
        setSupportList((curr) => {
          const finalSupport = curr.map((s) =>
            s._id === tempId ? { ...s, _id: persisted._id || s._id, id: persisted._id || s.id } : s
          );
          try {
            localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(finalSupport));
            localStorage.setItem(CACHE_KEY_SUPPORT_TS, String(Date.now()));
          } catch (e) {}
          broadcastSync("SUPPORT_UPDATED", finalSupport);
          return finalSupport;
        });
        return true;
      }
      setSupportList(previousSupport);
      try {
        localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(previousSupport));
      } catch (e) {}
      broadcastSync("SUPPORT_UPDATED", previousSupport);
      return false;
    } catch (e) {
      setSupportList(previousSupport);
      try {
        localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(previousSupport));
      } catch (err) {}
      broadcastSync("SUPPORT_UPDATED", previousSupport);
      console.error("Add support error:", e);
      return false;
    }
  };

  const updateSupport = async (id: string, contactPayload: any): Promise<boolean> => {
    const previousSupport = supportList;
    const updated = supportList.map((s) =>
      s._id === id || s.id === id ? { ...s, ...contactPayload } : s
    );

    setSupportList(updated);
    try {
      localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_SUPPORT_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("SUPPORT_UPDATED", updated);

    try {
      const res = await fetch(`/api/support/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return true;
      }
      setSupportList(previousSupport);
      try {
        localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(previousSupport));
      } catch (e) {}
      broadcastSync("SUPPORT_UPDATED", previousSupport);
      return false;
    } catch (e) {
      setSupportList(previousSupport);
      try {
        localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(previousSupport));
      } catch (err) {}
      broadcastSync("SUPPORT_UPDATED", previousSupport);
      console.error("Update support error:", e);
      return false;
    }
  };

  const deleteSupport = async (id: string): Promise<boolean> => {
    const previousSupport = supportList;
    const updated = supportList.filter((s) => s._id !== id && s.id !== id);

    setSupportList(updated);
    try {
      localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(updated));
      localStorage.setItem(CACHE_KEY_SUPPORT_TS, String(Date.now()));
    } catch (e) {}
    broadcastSync("SUPPORT_UPDATED", updated);

    try {
      const res = await fetch(`/api/support/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        return true;
      }
      setSupportList(previousSupport);
      try {
        localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(previousSupport));
      } catch (e) {}
      broadcastSync("SUPPORT_UPDATED", previousSupport);
      return false;
    } catch (e) {
      setSupportList(previousSupport);
      try {
        localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(previousSupport));
      } catch (err) {}
      broadcastSync("SUPPORT_UPDATED", previousSupport);
      console.error("Delete support error:", e);
      return false;
    }
  };

  const clearAllDatabase = async (): Promise<boolean> => {
    setAgents([]);
    setSupportList([]);
    try {
      localStorage.removeItem(CACHE_KEY_AGENTS);
      localStorage.removeItem(CACHE_KEY_SETTINGS);
      localStorage.removeItem(CACHE_KEY_SUPPORT);
      localStorage.removeItem(CACHE_KEY_AGENTS_TS);
      localStorage.removeItem(CACHE_KEY_SETTINGS_TS);
      localStorage.removeItem(CACHE_KEY_SUPPORT_TS);
    } catch (e) {}
    broadcastSync("AGENTS_UPDATED", []);
    broadcastSync("SUPPORT_UPDATED", []);

    try {
      const res = await fetch("/api/admin/clear-db", { method: "POST" });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Clear database error:", e);
      return false;
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        agents,
        supportList,
        settings,
        isLoading,
        getAgentsByCategory,
        getSupportContacts,
        refreshData,
        updateSettings,
        addAgent,
        updateAgent,
        deleteAgent,
        toggleAgentStatus,
        addSupport,
        updateSupport,
        deleteSupport,
        clearAllDatabase,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}
