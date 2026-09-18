export interface StoredAgent {
  _id: string;
  name: string;
  agentId: string;
  type: "admin" | "super_admin" | "sub_admin" | "super" | "master";
  phone: string;
  whatsapp: string;
  rating: number;
  appLink?: string;
  parentId?: string | null;
  reportTo?: {
    admin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
    superAdmin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
    subAdmin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
    super?: { id?: string; name?: string; phone?: string; whatsapp?: string };
  };
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredSupport {
  _id: string;
  name: string;
  phone: string;
  whatsappLink: string;
  hours: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredProxyLink {
  id: string;
  title: string;
  url: string;
  status: "active" | "inactive";
}

export interface StoredSettings {
  _id: string;
  siteName: string;
  siteLogo: string;
  siteFavicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  facebookGroupLink: string;
  siteNotice: string;
  sliderImages: string[];
  proxyLinks: StoredProxyLink[];
  updatedAt: Date;
}


// Global In-Memory Store
class MemoryStore {
  agents: StoredAgent[] = [];
  supports: StoredSupport[] = [];
  settings: StoredSettings = {
    _id: "settings_1",
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
    updatedAt: new Date(),
  };

  constructor() {
    this.agents = [];
    this.supports = [];
  }

  public clearAll() {
    this.agents = [];
    this.supports = [];
    this.settings = {
      _id: "settings_1",
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
      updatedAt: new Date(),
    };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryStore: MemoryStore | undefined;
}

export const memoryStore: MemoryStore =
  global.__memoryStore || (global.__memoryStore = new MemoryStore());
