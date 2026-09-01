import Agent, { IAgent, IReportContact } from "@/models/Agent";

export interface ResolvedHierarchy {
  admin?: IReportContact;
  subAdmin?: IReportContact;
  super?: IReportContact;
}

export async function resolveAgentHierarchy(
  type: "admin" | "sub_admin" | "super" | "master",
  parentId?: string | null
): Promise<ResolvedHierarchy> {
  const reportTo: ResolvedHierarchy = {};

  if (!parentId || type === "admin") {
    return reportTo;
  }

  const parent: IAgent | null = await Agent.findById(parentId);
  if (!parent) {
    return reportTo;
  }

  const parentContact: IReportContact = {
    id: parent.agentId,
    name: parent.name,
    phone: parent.phone,
    whatsapp: parent.whatsapp,
  };

  if (type === "sub_admin") {
    // Parent must be an Admin
    reportTo.admin = parentContact;
  } else if (type === "super") {
    // Parent must be a Sub Admin
    reportTo.subAdmin = parentContact;
    if (parent.reportTo?.admin?.phone) {
      reportTo.admin = parent.reportTo.admin;
    }
  } else if (type === "master") {
    // Parent must be a Super Agent
    reportTo.super = parentContact;
    if (parent.reportTo?.subAdmin?.phone) {
      reportTo.subAdmin = parent.reportTo.subAdmin;
    }
    if (parent.reportTo?.admin?.phone) {
      reportTo.admin = parent.reportTo.admin;
    }
  }

  return reportTo;
}
