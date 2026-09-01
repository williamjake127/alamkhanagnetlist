import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CustomerSupport from "@/models/CustomerSupport";
import { memoryStore, StoredSupport } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const query: Record<string, any> = {};
      if (status && status !== "all") {
        query.status = status;
      } else if (!status) {
        query.status = "active";
      }

      const supports = await CustomerSupport.find(query).sort({ createdAt: -1 });
      return NextResponse.json(
        { success: true, count: supports.length, data: supports },
        { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=3600" } }
      );
    } else {
      let filtered = [...memoryStore.supports];
      if (status && status !== "all") {
        filtered = filtered.filter((s) => s.status === status);
      } else if (!status) {
        filtered = filtered.filter((s) => s.status === "active");
      }
      return NextResponse.json(
        { success: true, count: filtered.length, data: filtered },
        { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=3600" } }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch support contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, whatsappLink, hours = "24/7 Service", status = "active" } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Support name and phone number are required." },
        { status: 400 }
      );
    }

    let finalWhatsApp = whatsappLink?.trim();
    if (!finalWhatsApp) {
      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      finalWhatsApp = `https://wa.me/${cleanPhone}`;
    }

    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const newSupport = await CustomerSupport.create({
        name: name.trim(),
        phone: phone.trim(),
        whatsappLink: finalWhatsApp,
        hours,
        status,
      });

      return NextResponse.json(
        { success: true, message: "Support helpline created successfully", data: newSupport },
        { status: 201 }
      );
    } else {
      const newSupport: StoredSupport = {
        _id: `support_${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        whatsappLink: finalWhatsApp,
        hours,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.supports.unshift(newSupport);
      return NextResponse.json(
        { success: true, message: "Support helpline created successfully", data: newSupport },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create support helpline" },
      { status: 500 }
    );
  }
}
