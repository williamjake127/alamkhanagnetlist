import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CustomerSupport from "@/models/CustomerSupport";
import { memoryStore } from "@/lib/store";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      const existing = await CustomerSupport.findById(id);
      if (!existing) {
        return NextResponse.json({ success: false, error: "Support helpline not found" }, { status: 404 });
      }

      const { name, phone, whatsappLink, hours, status } = body;
      if (name) existing.name = name.trim();
      if (phone) {
        existing.phone = phone.trim();
        if (!whatsappLink) {
          const cleanPhone = phone.replace(/[^0-9+]/g, "");
          existing.whatsappLink = `https://wa.me/${cleanPhone}`;
        }
      }
      if (whatsappLink) existing.whatsappLink = whatsappLink.trim();
      if (hours) existing.hours = hours.trim();
      if (status) existing.status = status;

      await existing.save();

      return NextResponse.json({
        success: true,
        message: "Support helpline updated successfully",
        data: existing,
      });
    } else {
      const idx = memoryStore.supports.findIndex((s) => s._id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Support helpline not found" }, { status: 404 });
      }
      const existing = memoryStore.supports[idx];
      const { name, phone, whatsappLink, hours, status } = body;

      if (name) existing.name = name.trim();
      if (phone) existing.phone = phone.trim();
      if (whatsappLink) existing.whatsappLink = whatsappLink.trim();
      if (hours) existing.hours = hours.trim();
      if (status) existing.status = status;
      existing.updatedAt = new Date();

      return NextResponse.json({
        success: true,
        message: "Support helpline updated successfully",
        data: existing,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update support helpline" },
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
      const deleted = await CustomerSupport.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ success: false, error: "Support helpline not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Support helpline deleted successfully" });
    } else {
      const idx = memoryStore.supports.findIndex((s) => s._id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Support helpline not found" }, { status: 404 });
      }
      memoryStore.supports.splice(idx, 1);
      return NextResponse.json({ success: true, message: "Support helpline deleted successfully" });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete support helpline" },
      { status: 500 }
    );
  }
}
