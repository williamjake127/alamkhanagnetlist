import Agent, { IAgent, IReportContact } from "@/models/Agent";

export interface ResolvedHierarchy {
  admin?: IReportContact;
  superAdmin?: IReportContact;
  subAdmin?: IReportContact;
  super?: IReportContact;
}

export async function resolveAgentHierarchy(
  type: "admin" | "super_admin" | "sub_admin" | "super" | "master",
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

  if (type === "super_admin") {
    // Parent must be an Admin
    reportTo.admin = parentContact;
  } else if (type === "sub_admin") {
    // Parent can be a Super Admin, or direct Admin (backwards compatibility)
    if (parent.type === "super_admin") {
      reportTo.superAdmin = parentContact;
      if (parent.reportTo?.admin?.phone) {
        reportTo.admin = parent.reportTo.admin;
      }
    } else {
      reportTo.admin = parentContact;
    }
  } else if (type === "super") {
    // Parent must be a Sub Admin
    reportTo.subAdmin = parentContact;
    if (parent.reportTo?.superAdmin?.phone) {
      reportTo.superAdmin = parent.reportTo.superAdmin;
    }
    if (parent.reportTo?.admin?.phone) {
      reportTo.admin = parent.reportTo.admin;
    }
  } else if (type === "master") {
    // Parent must be a Super Agent
    reportTo.super = parentContact;
    if (parent.reportTo?.subAdmin?.phone) {
      reportTo.subAdmin = parent.reportTo.subAdmin;
    }
    if (parent.reportTo?.superAdmin?.phone) {
      reportTo.superAdmin = parent.reportTo.superAdmin;
    }
    if (parent.reportTo?.admin?.phone) {
      reportTo.admin = parent.reportTo.admin;
    }
  }

  return reportTo;
}
