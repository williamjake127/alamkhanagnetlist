import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Agent from "@/models/Agent";
import { resolveAgentHierarchy } from "@/lib/hierarchy";
import { memoryStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      let agent = await Agent.findById(id).populate("parentId");
      if (!agent) {
        agent = await Agent.findOne({ agentId: id }).populate("parentId");
      }

      if (!agent) {
        return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: agent });
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Please try again." },
          { status: 503 }
        );
      }
      const agent = memoryStore.agents.find((a) => a._id === id || a.agentId === id);
      if (!agent) {
        return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: agent });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const existingAgent = await Agent.findById(id);
      if (!existingAgent) {
        return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
      }

      const { name, agentId, type, phone, whatsapp, rating, appLink, parentId, status } = body;

      if (agentId && agentId.trim() !== existingAgent.agentId) {
        const duplicate = await Agent.findOne({
          agentId: agentId.trim(),
          _id: { $ne: id },
        });
        if (duplicate) {
          return NextResponse.json(
            { success: false, error: `Agent ID "${agentId}" is already in use.` },
            { status: 409 }
          );
        }
        existingAgent.agentId = agentId.trim();
      }

      if (name) existingAgent.name = name.trim();
      if (phone) existingAgent.phone = phone.trim();

      if (whatsapp) {
        existingAgent.whatsapp = whatsapp.trim();
      } else if (phone) {
        const cleanPhone = phone.replace(/[^0-9+]/g, "");
        existingAgent.whatsapp = `https://wa.me/${cleanPhone}`;
      }

      if (rating !== undefined) existingAgent.rating = Number(rating);
      if (appLink !== undefined) existingAgent.appLink = appLink.trim();
      if (status) existingAgent.status = status;

      const targetType = type || existingAgent.type;
      const targetParentId = parentId !== undefined ? parentId : existingAgent.parentId;

      existingAgent.type = targetType;
      existingAgent.parentId = targetParentId || null;

      const resolvedReportTo = await resolveAgentHierarchy(targetType, targetParentId);
      existingAgent.reportTo = resolvedReportTo;

      await existingAgent.save();

      return NextResponse.json({
        success: true,
        message: "Agent updated successfully",
        data: existingAgent,
      });
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Cannot update agent." },
          { status: 503 }
        );
      }
      const idx = memoryStore.agents.findIndex((a) => a._id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
      }

      const existing = memoryStore.agents[idx];
      const { name, agentId, type, phone, whatsapp, rating, appLink, parentId, status } = body;

      if (name) existing.name = name.trim();
      if (agentId) existing.agentId = agentId.trim();
      if (phone) existing.phone = phone.trim();
      if (whatsapp) existing.whatsapp = whatsapp.trim();
      if (rating !== undefined) existing.rating = Number(rating);
      if (appLink !== undefined) existing.appLink = appLink.trim();
      if (status) existing.status = status;
      if (type) existing.type = type;
      if (parentId !== undefined) existing.parentId = parentId;

      if (parentId) {
        const parent = memoryStore.agents.find((a) => a._id === parentId);
        if (parent) {
          const parentContact = {
            id: parent.agentId,
            name: parent.name,
            phone: parent.phone,
            whatsapp: parent.whatsapp,
          };
          const reportTo: any = {};
          if (existing.type === "sub_admin") {
            reportTo.admin = parentContact;
          } else if (existing.type === "super") {
            reportTo.subAdmin = parentContact;
            if (parent.reportTo?.admin) reportTo.admin = parent.reportTo.admin;
          } else if (existing.type === "master") {
            reportTo.super = parentContact;
            if (parent.reportTo?.subAdmin) reportTo.subAdmin = parent.reportTo.subAdmin;
            if (parent.reportTo?.admin) reportTo.admin = parent.reportTo.admin;
          }
          existing.reportTo = reportTo;
        }
      }

      existing.updatedAt = new Date();

      return NextResponse.json({
        success: true,
        message: "Agent updated successfully",
        data: existing,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const deleted = await Agent.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Agent deleted successfully" });
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Cannot delete agent." },
          { status: 503 }
        );
      }
      const idx = memoryStore.agents.findIndex((a) => a._id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
      }
      memoryStore.agents.splice(idx, 1);
      return NextResponse.json({ success: true, message: "Agent deleted successfully" });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete agent" },
      { status: 500 }
    );
  }
}
