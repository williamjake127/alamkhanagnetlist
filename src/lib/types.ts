export type AgentCategory = 'admin' | 'sub_admin' | 'super' | 'master' | 'service';

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  categoryLabel?: string;
  phone: string;
  whatsapp: string;
  rating: number;
  adminContact?: string;
  subAdminContact?: string;
  superContact?: string;
}

export interface SearchFilters {
  category: string;
  agentId: string;
  whatsappNumber: string;
}
