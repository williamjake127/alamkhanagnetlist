import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Agent from "@/models/Agent";
import CustomerSupport from "@/models/CustomerSupport";
import WebsiteSettings from "@/models/WebsiteSettings";
import { INITIAL_AGENTS } from "@/lib/data/agents";

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Seed Settings if none exists
    const settingsCount = await WebsiteSettings.countDocuments();
    if (settingsCount === 0) {
      await WebsiteSettings.create({
        facebookGroupLink: "https://facebook.com",
        siteNotice: "Welcome to Betbuzz365 Official Agent Directory",
      });
    }

    // 2. Seed Customer Support if none exists
    const supportCount = await CustomerSupport.countDocuments();
    if (supportCount === 0) {
      await CustomerSupport.create([
        {
          name: "Customer Helpline 1",
          phone: "+96878531374",
          whatsappLink: "https://wa.me/+96878531374",
          hours: "24/7 Service",
          status: "active",
        },
        {
          name: "Customer Helpline 2",
          phone: "+96878486803",
          whatsappLink: "https://wa.me/+96878486803",
          hours: "24/7 Service",
          status: "active",
        },
      ]);
    }

    // 3. Seed Agents if none exists
    const agentCount = await Agent.countDocuments();
    let seededAgents = 0;

    if (agentCount === 0) {
      // Create a default Top Admin & Sub Admin & Super first so we have a realistic hierarchy sample
      const topAdmin = await Agent.create({
        name: "MASTER ADMIN 01",
        agentId: "ADMIN-01",
        type: "admin",
        phone: "+96878531374",
        whatsapp: "https://wa.me/+96878531374",
        rating: 5,
        status: "active",
      });

      const subAdmin = await Agent.create({
        name: "SUB ADMIN DHAKA",
        agentId: "SUB-01",
        type: "sub_admin",
        phone: "+96878486803",
        whatsapp: "https://wa.me/+96878486803",
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
          admin: {
            id: topAdmin.agentId,
            name: topAdmin.name,
            phone: topAdmin.phone,
            whatsapp: topAdmin.whatsapp,
          },
        },
        status: "active",
      });

      // Now create the 25 verified Master Agents under this Super Agent
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
      seededAgents = masterDocs.length + 3;
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
