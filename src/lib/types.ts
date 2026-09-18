export type AgentCategory = 'admin' | 'super_admin' | 'sub_admin' | 'super' | 'master' | 'service';

export interface Agent {
  id: string;
  _id?: string;
  agentId?: string;
  name: string;
  category: AgentCategory;
  type?: string;
  categoryLabel?: string;
  phone: string;
  whatsapp: string;
  rating: number;
  adminContact?: string;
  superAdminContact?: string;
  subAdminContact?: string;
  superContact?: string;
  status?: "active" | "inactive";
  appLink?: string;
  avatar?: string;
  image?: string;
  reportTo?: {
    admin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
    superAdmin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
    subAdmin?: { id?: string; name?: string; phone?: string; whatsapp?: string };
    super?: { id?: string; name?: string; phone?: string; whatsapp?: string };
  };
}


export interface SearchFilters {
  category: string;
  agentId: string;
  whatsappNumber: string;
}
