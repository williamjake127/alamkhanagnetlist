import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Agent from "@/models/Agent";
import WebsiteSettings from "@/models/WebsiteSettings";
import { INITIAL_AGENTS } from "@/lib/data/agents";

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Seed Settings if none exists
    const settingsCount = await WebsiteSettings.countDocuments();
    if (settingsCount === 0) {
      await WebsiteSettings.create({
        facebookGroupLink: "",
        siteNotice: "",
      });
    }

    // 2. Customer Support: no default seed data — admin adds their own helplines

    // 3. Seed Agents if none exists
    const agentCount = await Agent.countDocuments();
    let seededAgents = 0;

    if (agentCount === 0) {
      // Create default hierarchy: Top Admin -> Super Admin -> Sub Admin -> Super Agent -> Master Agents
      const topAdmin = await Agent.create({
        name: "MASTER ADMIN 01",
        agentId: "ADMIN-01",
        type: "admin",
        phone: "+96878531374",
        whatsapp: "https://wa.me/+96878531374",
        rating: 5,
        status: "active",
      });

      const superAdmin = await Agent.create({
        name: "SUPER ADMIN PRIME",
        agentId: "S-ADMIN-01",
        type: "super_admin",
        phone: "+96878531375",
        whatsapp: "https://wa.me/+96878531375",
        rating: 5,
        parentId: topAdmin._id,
        reportTo: {
          admin: {
            id: topAdmin.agentId,
            name: topAdmin.name,
            phone: topAdmin.phone,
            whatsapp: topAdmin.whatsapp,
          },
        },
        status: "active",
      });

      const subAdmin = await Agent.create({
        name: "SUB ADMIN DHAKA",
        agentId: "SUB-01",
        type: "sub_admin",
        phone: "+96878486803",
        whatsapp: "https://wa.me/+96878486803",
        rating: 5,
        parentId: superAdmin._id,
        reportTo: {
          superAdmin: {
            id: superAdmin.agentId,
            name: superAdmin.name,
            phone: superAdmin.phone,
            whatsapp: superAdmin.whatsapp,
          },
          admin: {
            id: topAdmin.agentId,
            name: topAdmin.name,
            phone: topAdmin.phone,
            whatsapp: topAdmin.whatsapp,
          },
        },
        status: "active",
      });

      const superAgent = await Agent.create({
        name: "SUPER AGENT PRIME",
        agentId: "SUPER-01",
        type: "super",
        phone: "+96879627605",
        whatsapp: "https://wa.me/+96879627605",
        rating: 5,
        parentId: subAdmin._id,
        reportTo: {
          subAdmin: {
            id: subAdmin.agentId,
            name: subAdmin.name,
            phone: subAdmin.phone,
            whatsapp: subAdmin.whatsapp,
          },
          superAdmin: {
            id: superAdmin.agentId,
            name: superAdmin.name,
            phone: superAdmin.phone,
            whatsapp: superAdmin.whatsapp,
          },
          admin: {
            id: topAdmin.agentId,
            name: topAdmin.name,
            phone: topAdmin.phone,
            whatsapp: topAdmin.whatsapp,
          },
        },
        status: "active",
      });

      // Now create the verified Master Agents under this Super Agent
      const masterDocs = INITIAL_AGENTS.map((a) => ({
        name: a.name,
        agentId: a.id,
        type: "master" as const,
        phone: a.phone,
        whatsapp: a.whatsapp,
        rating: a.rating || 5,
        parentId: superAgent._id,
        reportTo: {
          super: {
            id: superAgent.agentId,
            name: superAgent.name,
            phone: superAgent.phone,
            whatsapp: superAgent.whatsapp,
          },
          subAdmin: {
            id: subAdmin.agentId,
            name: subAdmin.name,
            phone: subAdmin.phone,
            whatsapp: subAdmin.whatsapp,
          },
          superAdmin: {
            id: superAdmin.agentId,
            name: superAdmin.name,
            phone: superAdmin.phone,
            whatsapp: superAdmin.whatsapp,
          },
          admin: {
            id: topAdmin.agentId,
            name: topAdmin.name,
            phone: topAdmin.phone,
            whatsapp: topAdmin.whatsapp,
          },
        },
        status: "active" as const,
      }));

      await Agent.insertMany(masterDocs);
      seededAgents = masterDocs.length + 4;
    }

    return NextResponse.json({
      success: true,
      message:
        agentCount === 0
          ? `Successfully seeded ${seededAgents} agents and settings into MongoDB.`
          : "Database already contains data.",
    });
  } catch (error: any) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
