import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerSupport extends Document {
  name: string;
  phone: string;
  whatsappLink: string;
  hours: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSupportSchema = new Schema<ICustomerSupport>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsappLink: { type: String, required: true, trim: true },
    hours: { type: String, default: "24/7 Service" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const CustomerSupport: Model<ICustomerSupport> =
  mongoose.models.CustomerSupport ||
  mongoose.model<ICustomerSupport>("CustomerSupport", CustomerSupportSchema);

export default CustomerSupport;
