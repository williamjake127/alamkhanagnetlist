import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      let settings = await WebsiteSettings.findOne().lean();
      if (!settings) {
        settings = await WebsiteSettings.create({
          siteName: "",
          siteLogo: "",
          siteFavicon: "",
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
          facebookGroupLink: "",
          siteNotice: "",
          sliderImages: [],
          proxyLinks: [],
        });
      }
      return NextResponse.json(
        { success: true, data: settings },
        { headers: { "Cache-Control": "no-store" } }
      );
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Please try again." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { success: true, data: memoryStore.settings },
        { headers: { "Cache-Control": "no-store" } }
      );
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
    const {
      siteName,
      siteLogo,
      siteFavicon,
      metaTitle,
      metaDescription,
      metaKeywords,
      facebookGroupLink,
      siteNotice,
      sliderImages,
      proxyLinks,
    } = body;
    const mongooseConn = await connectToDatabase();

    if (mongooseConn && mongooseConn.connection.readyState === 1) {
      let settings = await WebsiteSettings.findOne();
      if (!settings) {
        settings = new WebsiteSettings({
          siteName: siteName !== undefined ? siteName.trim() : "",
          siteLogo: siteLogo !== undefined ? siteLogo.trim() : "",
          siteFavicon: siteFavicon !== undefined ? siteFavicon.trim() : "",
          metaTitle: metaTitle !== undefined ? metaTitle.trim() : "",
          metaDescription: metaDescription !== undefined ? metaDescription.trim() : "",
          metaKeywords: metaKeywords !== undefined ? metaKeywords.trim() : "",
          facebookGroupLink: facebookGroupLink?.trim() || "https://facebook.com",
          siteNotice: siteNotice !== undefined ? siteNotice.trim() : "স্বাগতম আমাদের অফিসিয়াল এজেন্ট তালিকায়।",
          sliderImages: Array.isArray(sliderImages) ? sliderImages : [],
          proxyLinks: Array.isArray(proxyLinks) ? proxyLinks : [],
        });
      } else {
        if (siteName !== undefined) settings.siteName = siteName.trim();
        if (siteLogo !== undefined) settings.siteLogo = siteLogo.trim();
        if (siteFavicon !== undefined) settings.siteFavicon = siteFavicon.trim();
        if (metaTitle !== undefined) settings.metaTitle = metaTitle.trim();
        if (metaDescription !== undefined) settings.metaDescription = metaDescription.trim();
        if (metaKeywords !== undefined) settings.metaKeywords = metaKeywords.trim();
        if (facebookGroupLink !== undefined) settings.facebookGroupLink = facebookGroupLink.trim();
        if (siteNotice !== undefined) settings.siteNotice = siteNotice.trim();
        if (sliderImages !== undefined && Array.isArray(sliderImages)) settings.sliderImages = sliderImages;
        if (proxyLinks !== undefined && Array.isArray(proxyLinks)) settings.proxyLinks = proxyLinks;
      }
      await settings.save();
      return NextResponse.json({
        success: true,
        message: "Settings updated successfully",
        data: settings,
      });
    } else {
      if (process.env.MONGODB_URI) {
        return NextResponse.json(
          { success: false, error: "Database connection unavailable. Cannot save settings." },
          { status: 503 }
        );
      }
      if (siteName !== undefined) memoryStore.settings.siteName = siteName.trim();
      if (siteLogo !== undefined) memoryStore.settings.siteLogo = siteLogo.trim();
      if (siteFavicon !== undefined) memoryStore.settings.siteFavicon = siteFavicon.trim();
      if (metaTitle !== undefined) memoryStore.settings.metaTitle = metaTitle.trim();
      if (metaDescription !== undefined) memoryStore.settings.metaDescription = metaDescription.trim();
      if (metaKeywords !== undefined) memoryStore.settings.metaKeywords = metaKeywords.trim();
      if (facebookGroupLink !== undefined) memoryStore.settings.facebookGroupLink = facebookGroupLink.trim();
      if (siteNotice !== undefined) memoryStore.settings.siteNotice = siteNotice.trim();
      if (sliderImages !== undefined && Array.isArray(sliderImages)) memoryStore.settings.sliderImages = sliderImages;
      if (proxyLinks !== undefined && Array.isArray(proxyLinks)) memoryStore.settings.proxyLinks = proxyLinks;

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
