"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  refreshData: () => Promise<void>;
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

const CACHE_KEY_AGENTS = "bb365_cached_agents";
const CACHE_KEY_SETTINGS = "bb365_cached_settings";
const CACHE_KEY_SUPPORT = "bb365_cached_support";

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [settings, setSettings] = useState<WebsiteSettingsData>(DEFAULT_SETTINGS);
  const [supportList, setSupportList] = useState<SupportContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load from local storage cache on client mount
  useEffect(() => {
    try {
      const cachedAgents = localStorage.getItem(CACHE_KEY_AGENTS);
      if (cachedAgents) {
        const parsed = JSON.parse(cachedAgents);
        if (Array.isArray(parsed) && parsed.length > 0) setAgents(parsed);
      }
      const cachedSettings = localStorage.getItem(CACHE_KEY_SETTINGS);
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings);
        if (parsed && typeof parsed === "object") setSettings(parsed);
      }
      const cachedSupport = localStorage.getItem(CACHE_KEY_SUPPORT);
      if (cachedSupport) {
        const parsed = JSON.parse(cachedSupport);
        if (Array.isArray(parsed)) setSupportList(parsed);
      }
    } catch (e) {}
  }, []);

  // Automatic SEO & Dynamic Head Updater (Title, Description, Keywords, Favicon)
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

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    // Meta keywords
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement("meta");
      metaKey.setAttribute("name", "keywords");
      document.head.appendChild(metaKey);
    }
    metaKey.setAttribute("content", keywords);

    // Dynamic Favicon
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

  // Background fetch without blocking UI
  const refreshData = useCallback(async () => {
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
            reportTo: item.reportTo,
            status: item.status || "active",
          }));
          setAgents(normalizedAgents);
          try {
            localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(normalizedAgents));
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
            proxyLinks: Array.isArray(settingsData.data.proxyLinks) && settingsData.data.proxyLinks.length > 0
              ? settingsData.data.proxyLinks
              : DEFAULT_PROXY_LINKS,
          };
          setSettings(s);
          try {
            localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(s));
          } catch (e) {}
        }
      }

      if (supportRes.status === "fulfilled" && supportRes.value.ok) {
        const supportData = await supportRes.value.json();
        if (supportData.success && Array.isArray(supportData.data)) {
          setSupportList(supportData.data);
          try {
            localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(supportData.data));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Background data refresh error:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Fast categorized retrieval
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

  // Optimistic Settings Update
  const updateSettings = async (newSettings: Partial<WebsiteSettingsData>): Promise<boolean> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(updated));
    } catch (e) {}

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Save settings error:", e);
      return false;
    }
  };

  // Optimistic Agent Add
  const addAgent = async (agentPayload: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentPayload),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const item = json.data;
        const newAgent: Agent = {
          id: item.agentId || item.id || item._id,
          _id: item._id,
          name: item.name,
          agentId: item.agentId || item.id,
          category: item.type || item.category || "master",
          type: item.type || item.category || "master",
          phone: item.phone,
          whatsapp: item.whatsapp,
          rating: item.rating || 5,
          appLink: item.appLink,
          reportTo: item.reportTo,
          status: item.status || "active",
        };
        const updated = [newAgent, ...agents];
        setAgents(updated);
        try {
          localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
        } catch (e) {}
        return true;
      }
      return false;
    } catch (e) {
      console.error("Add agent error:", e);
      return false;
    }
  };

  // Optimistic Agent Update
  const updateAgent = async (id: string, agentPayload: any): Promise<boolean> => {
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
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
    } catch (e) {}

    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentPayload),
      });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Update agent error:", e);
      return false;
    }
  };

  // Optimistic Agent Delete
  const deleteAgent = async (id: string): Promise<boolean> => {
    const updated = agents.filter((a) => {
      const aid = (a as any)._id || a.id || (a as any).agentId;
      return aid !== id && a.id !== id;
    });
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
    } catch (e) {}

    try {
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Delete agent error:", e);
      return false;
    }
  };

  // Optimistic Status Toggle
  const toggleAgentStatus = async (id: string): Promise<boolean> => {
    let targetStatus = "active";
    const updated = agents.map((a) => {
      const aid = (a as any)._id || a.id || (a as any).agentId;
      if (aid === id || a.id === id) {
        targetStatus = a.status === "active" ? "inactive" : "active";
        return { ...a, status: targetStatus as "active" | "inactive" };
      }
      return a;
    });
    setAgents(updated);
    try {
      localStorage.setItem(CACHE_KEY_AGENTS, JSON.stringify(updated));
    } catch (e) {}

    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Toggle status error:", e);
      return false;
    }
  };

  // Support contacts operations
  const addSupport = async (contactPayload: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const updated = [json.data, ...supportList];
        setSupportList(updated);
        try {
          localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(updated));
        } catch (e) {}
        return true;
      }
      return false;
    } catch (e) {
      console.error("Add support error:", e);
      return false;
    }
  };

  const updateSupport = async (id: string, contactPayload: any): Promise<boolean> => {
    const updated = supportList.map((s) => (s._id === id || s.id === id ? { ...s, ...contactPayload } : s));
    setSupportList(updated);
    try {
      localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(updated));
    } catch (e) {}

    try {
      const res = await fetch(`/api/support/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Update support error:", e);
      return false;
    }
  };

  const deleteSupport = async (id: string): Promise<boolean> => {
    const updated = supportList.filter((s) => s._id !== id && s.id !== id);
    setSupportList(updated);
    try {
      localStorage.setItem(CACHE_KEY_SUPPORT, JSON.stringify(updated));
    } catch (e) {}

    try {
      const res = await fetch(`/api/support/${id}`, { method: "DELETE" });
      const json = await res.json();
      return json.success;
    } catch (e) {
      console.error("Delete support error:", e);
      return false;
    }
  };

  const clearAllDatabase = async (): Promise<boolean> => {
    setAgents([]);
    setSupportList([]);
    try {
      localStorage.removeItem(CACHE_KEY_AGENTS);
      localStorage.removeItem(CACHE_KEY_SUPPORT);
    } catch (e) {}

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
