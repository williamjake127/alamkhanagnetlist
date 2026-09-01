import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Agent from "@/models/Agent";
import CustomerSupport from "@/models/CustomerSupport";
import WebsiteSettings from "@/models/WebsiteSettings";
import { memoryStore } from "@/lib/store";

export async function POST() {
  try {
    // 1. Wipe in-memory store
    if (memoryStore) {
      memoryStore.agents = [];
      memoryStore.supports = [];
      if (typeof memoryStore.clearAll === "function") {
        memoryStore.clearAll();
      }
    }

    // 2. Wipe MongoDB if connected
    try {
      const conn = await connectToDatabase();
      if (conn && conn.connection.readyState === 1) {
        await Agent.deleteMany({});
        await CustomerSupport.deleteMany({});
        await WebsiteSettings.deleteMany({});
      }
    } catch (dbErr) {
      console.warn("MongoDB delete warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Database cleared completely. All agents, support contacts, and settings have been reset.",
    });
  } catch (error: any) {
    console.error("POST /api/admin/clear-db error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear database" },
      { status: 500 }
    );
  }
}
