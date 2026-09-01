export interface StoredAgent {
  _id: string;
  name: string;
  agentId: string;
  type: "admin" | "sub_admin" | "super" | "master";
  phone: string;
  whatsapp: string;
  rating: number;
  appLink?: string;
  parentId?: string | null;
  reportTo?: {
    admin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
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

export interface StoredSettings {
  _id: string;
  facebookGroupLink: string;
  siteNotice: string;
  updatedAt: Date;
}

// Global In-Memory Store - starts completely empty
class MemoryStore {
  agents: StoredAgent[] = [];
  supports: StoredSupport[] = [];
  settings: StoredSettings = {
    _id: "settings_1",
    facebookGroupLink: "https://facebook.com",
    siteNotice: "Welcome to Betbuzz365 Official Agent Directory",
    updatedAt: new Date(),
  };

  constructor() {
    // Starts 100% clean and empty
    this.agents = [];
    this.supports = [];
  }

  public clearAll() {
    this.agents = [];
    this.supports = [];
    this.settings = {
      _id: "settings_1",
      facebookGroupLink: "https://facebook.com",
      siteNotice: "Welcome to Betbuzz365 Official Agent Directory",
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
