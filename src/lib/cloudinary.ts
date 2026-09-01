import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "da9nj9xbw",
  api_key: process.env.CLOUDINARY_API_KEY || "878188223832197",
  api_secret: process.env.CLOUDINARY_API_SECRET || "loUlBTKeOcD7-kHiCxZxV_RlzgM",
  secure: true,
});

export default cloudinary;
