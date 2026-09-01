import { INITIAL_AGENTS } from "./data/agents";

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

// Global In-Memory Store
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
    this.initDefaults();
  }

  private initDefaults() {
    // 1. Initial Admins, Sub Admins, Supers
    const admin1: StoredAgent = {
      _id: "agent_admin_01",
      name: "MASTER ADMIN 01",
      agentId: "ADMIN-01",
      type: "admin",
      phone: "+96878531374",
      whatsapp: "https://wa.me/+96878531374",
      rating: 5,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const subAdmin1: StoredAgent = {
      _id: "agent_sub_01",
      name: "SUB ADMIN DHAKA",
      agentId: "SUB-01",
      type: "sub_admin",
      phone: "+96878486803",
      whatsapp: "https://wa.me/+96878486803",
      rating: 5,
      parentId: admin1._id,
      reportTo: {
        admin: {
          id: admin1.agentId,
          name: admin1.name,
          phone: admin1.phone,
          whatsapp: admin1.whatsapp,
        },
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const super1: StoredAgent = {
      _id: "agent_super_01",
      name: "SUPER AGENT PRIME",
      agentId: "SUPER-01",
      type: "super",
      phone: "+96879627605",
      whatsapp: "https://wa.me/+96879627605",
      rating: 5,
      parentId: subAdmin1._id,
      reportTo: {
        subAdmin: {
          id: subAdmin1.agentId,
          name: subAdmin1.name,
          phone: subAdmin1.phone,
          whatsapp: subAdmin1.whatsapp,
        },
        admin: {
          id: admin1.agentId,
          name: admin1.name,
          phone: admin1.phone,
          whatsapp: admin1.whatsapp,
        },
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.agents.push(admin1, subAdmin1, super1);

    // 2. Initial 25 Verified Master Agents
    INITIAL_AGENTS.forEach((a, i) => {
      this.agents.push({
        _id: `agent_master_${i + 1}`,
        name: a.name,
        agentId: a.id,
        type: "master",
        phone: a.phone,
        whatsapp: a.whatsapp,
        rating: a.rating || 5,
        parentId: super1._id,
        reportTo: {
          super: {
            id: super1.agentId,
            name: super1.name,
            phone: super1.phone,
            whatsapp: super1.whatsapp,
          },
          subAdmin: {
            id: subAdmin1.agentId,
            name: subAdmin1.name,
            phone: subAdmin1.phone,
            whatsapp: subAdmin1.whatsapp,
          },
          admin: {
            id: admin1.agentId,
            name: admin1.name,
            phone: admin1.phone,
            whatsapp: admin1.whatsapp,
          },
        },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 3. Initial Customer Support Helplines
    this.supports.push(
      {
        _id: "support_1",
        name: "Customer Helpline 1",
        phone: "+96878531374",
        whatsappLink: "https://wa.me/+96878531374",
        hours: "24/7 Service",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "support_2",
        name: "Customer Helpline 2",
        phone: "+96878486803",
        whatsappLink: "https://wa.me/+96878486803",
        hours: "24/7 Service",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryStore: MemoryStore | undefined;
}

export const memoryStore: MemoryStore =
  global.__memoryStore || (global.__memoryStore = new MemoryStore());
