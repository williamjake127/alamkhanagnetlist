import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteSettings extends Document {
  facebookGroupLink: string;
  siteNotice?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    facebookGroupLink: {
      type: String,
      default: "https://facebook.com",
      trim: true,
    },
    siteNotice: {
      type: String,
      default: "",
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
