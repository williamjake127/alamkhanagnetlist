import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProxyLink {
  id?: string;
  title: string;
  url: string;
  status: "active" | "inactive";
}

export interface IWebsiteSettings extends Document {
  siteName?: string;
  siteLogo?: string;
  siteFavicon?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  facebookGroupLink: string;
  siteNotice?: string;
  sliderImages?: string[];
  proxyLinks?: IProxyLink[];
  createdAt: Date;
  updatedAt: Date;
}

const ProxyLinkSchema = new Schema<IProxyLink>(
  {
    id: { type: String, default: () => Date.now().toString() },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { _id: false }
);

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    siteName: {
      type: String,
      default: "",
      trim: true,
    },
    siteLogo: {
      type: String,
      default: "",
      trim: true,
    },
    siteFavicon: {
      type: String,
      default: "",
      trim: true,
    },
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    metaKeywords: {
      type: String,
      default: "",
      trim: true,
    },
    facebookGroupLink: {
      type: String,
      default: "https://facebook.com",
      trim: true,
    },
    siteNotice: {
      type: String,
      default: "স্বাগতম আমাদের অফিসিয়াল এজেন্ট তালিকায়। নিরাপদ লেনদেনের জন্য সর্বদা ভেরিফাইড এজেন্টদের সাথে যোগাযোগ করুন।",
      trim: true,
    },
    sliderImages: {
      type: [String],
      default: [],
    },
    proxyLinks: {
      type: [ProxyLinkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteSettings: Model<IWebsiteSettings> =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettings>("WebsiteSettings", WebsiteSettingsSchema);

export default WebsiteSettings;
