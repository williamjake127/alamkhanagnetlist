import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Agent from "@/models/Agent";
import { resolveAgentHierarchy } from "@/lib/hierarchy";
import { memoryStore, StoredAgent } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const query: Record<string, any> = {};

      if (type && type !== "default" && type !== "all") {
        query.type = type;
      }

      if (status && status !== "all") {
        query.status = status;
      } else if (!status) {
        query.status = "active";
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
          { name: regex },
          { agentId: regex },
          { phone: regex },
          { whatsapp: regex },
        ];
      }

      const agents = await Agent.find(query)
        .populate("parentId", "name agentId type phone whatsapp")
        .sort({ createdAt: -1 });

      return NextResponse.json(
        { success: true, count: agents.length, data: agents },
        { headers: { "Cache-Control": "no-store" } }
      );
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Please try again." },
          { status: 503 }
        );
      }

      // Fallback only if MONGODB_URI is completely unconfigured
      let filtered = [...memoryStore.agents];

      if (type && type !== "default" && type !== "all") {
        filtered = filtered.filter((a) => a.type === type);
      }

      if (status && status !== "all") {
        filtered = filtered.filter((a) => a.status === status);
      } else if (!status) {
        filtered = filtered.filter((a) => a.status === "active");
      }

      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.name.toLowerCase().includes(term) ||
            a.agentId.toLowerCase().includes(term) ||
            a.phone.includes(term) ||
            a.whatsapp.includes(term)
        );
      }

      return NextResponse.json(
        { success: true, count: filtered.length, data: filtered },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
  } catch (error: any) {
    console.error("GET /api/agents error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      agentId,
      type,
      phone,
      whatsapp,
      rating = 5,
      appLink = "",
      parentId = null,
      status = "active",
    } = body;

    if (!name || !agentId || !type || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, Agent ID, Type, and Phone Number are required." },
        { status: 400 }
      );
    }

    let finalWhatsApp = whatsapp?.trim();
    if (!finalWhatsApp) {
      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      finalWhatsApp = `https://wa.me/${cleanPhone}`;
    }

    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const existing = await Agent.findOne({ agentId: agentId.trim() });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `Agent ID "${agentId}" already exists.` },
          { status: 409 }
        );
      }

      const resolvedReportTo = await resolveAgentHierarchy(type, parentId);

      const newAgent = await Agent.create({
        name: name.trim(),
        agentId: agentId.trim(),
        type,
        phone: phone.trim(),
        whatsapp: finalWhatsApp,
        rating: Number(rating) || 5,
        appLink: appLink?.trim() || "",
        parentId: parentId || null,
        reportTo: resolvedReportTo,
        status,
      });

      return NextResponse.json(
        { success: true, message: "Agent created successfully", data: newAgent },
        { status: 201 }
      );
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Cannot save agent to persistent database." },
          { status: 503 }
        );
      }

      // Memory Store logic only for local testing without mongo uri
      const existing = memoryStore.agents.find(
        (a) => a.agentId.toLowerCase() === agentId.trim().toLowerCase()
      );
      if (existing) {
        return NextResponse.json(
          { success: false, error: `Agent ID "${agentId}" already exists.` },
          { status: 409 }
        );
      }

      const reportTo: any = {};
      if (parentId) {
        const parent = memoryStore.agents.find((a) => a._id === parentId);
        if (parent) {
          const parentContact = {
            id: parent.agentId,
            name: parent.name,
            phone: parent.phone,
            whatsapp: parent.whatsapp,
          };
          if (type === "sub_admin") {
            reportTo.admin = parentContact;
          } else if (type === "super") {
            reportTo.subAdmin = parentContact;
            if (parent.reportTo?.admin) reportTo.admin = parent.reportTo.admin;
          } else if (type === "master") {
            reportTo.super = parentContact;
            if (parent.reportTo?.subAdmin) reportTo.subAdmin = parent.reportTo.subAdmin;
            if (parent.reportTo?.admin) reportTo.admin = parent.reportTo.admin;
          }
        }
      }

      const newAgent: StoredAgent = {
        _id: `agent_${Date.now()}`,
        name: name.trim(),
        agentId: agentId.trim(),
        type,
        phone: phone.trim(),
        whatsapp: finalWhatsApp,
        rating: Number(rating) || 5,
        appLink: appLink?.trim() || "",
        parentId: parentId || null,
        reportTo,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryStore.agents.unshift(newAgent);

      return NextResponse.json(
        { success: true, message: "Agent created successfully", data: newAgent },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/agents error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create agent" },
      { status: 500 }
    );
  }
}
