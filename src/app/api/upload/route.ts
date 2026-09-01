import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper to upload buffer to Cloudinary
function uploadToCloudinary(buffer: Buffer, folder: string = "agent_directory"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) return reject(new Error("No secure_url returned from Cloudinary"));
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const folderType = (formData.get("folder") as string) || "agent_portal";

    const filesToProcess: File[] = [];
    if (files && files.length > 0) {
      filesToProcess.push(...files);
    } else if (singleFile) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided for upload" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of filesToProcess) {
      if (!file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        // 1. Primary: Upload directly to Cloudinary CDN
        const cloudinaryUrl = await uploadToCloudinary(buffer, folderType);
        uploadedUrls.push(cloudinaryUrl);
      } catch (cloudErr: any) {
        console.error("Cloudinary upload fallback:", cloudErr);

        // 2. Fallback: Save to local public/uploads if Cloudinary fails
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const ext = path.extname(file.name) || ".jpg";
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .replace(ext, "");
        const filename = `img_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}_${sanitizedName}${ext}`;

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        uploadedUrls.push(`/uploads/${filename}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || "",
      message: `${uploadedUrls.length} picture(s) uploaded to Cloudinary successfully`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image(s)" },
      { status: 500 }
    );
  }
}
