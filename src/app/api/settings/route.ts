import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import { memoryStore } from "@/lib/store";

export async function GET() {
  try {
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      let settings = await WebsiteSettings.findOne();
      if (!settings) {
        settings = await WebsiteSettings.create({
          facebookGroupLink: "https://facebook.com",
          siteNotice: "",
        });
      }
      return NextResponse.json({ success: true, data: settings });
    } else {
      return NextResponse.json({ success: true, data: memoryStore.settings });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { facebookGroupLink, siteNotice } = body;
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      let settings = await WebsiteSettings.findOne();
      if (!settings) {
        settings = new WebsiteSettings({
          facebookGroupLink: facebookGroupLink?.trim() || "https://facebook.com",
          siteNotice: siteNotice?.trim() || "",
        });
      } else {
        if (facebookGroupLink !== undefined) {
          settings.facebookGroupLink = facebookGroupLink.trim();
        }
        if (siteNotice !== undefined) {
          settings.siteNotice = siteNotice.trim();
        }
      }
      await settings.save();
      return NextResponse.json({
        success: true,
        message: "Settings updated successfully",
        data: settings,
      });
    } else {
      if (facebookGroupLink !== undefined) {
        memoryStore.settings.facebookGroupLink = facebookGroupLink.trim();
      }
      if (siteNotice !== undefined) {
        memoryStore.settings.siteNotice = siteNotice.trim();
      }
      memoryStore.settings.updatedAt = new Date();

      return NextResponse.json({
        success: true,
        message: "Settings updated successfully",
        data: memoryStore.settings,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
