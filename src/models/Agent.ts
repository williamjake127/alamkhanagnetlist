import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReportContact {
  id?: string;
  name?: string;
  phone?: string;
  whatsapp?: string;
}

export interface IAgent extends Document {
  name: string;
  agentId: string;
  type: "admin" | "super_admin" | "sub_admin" | "super" | "master";
  phone: string;
  whatsapp: string;
  rating: number;
  appLink?: string;
  parentId?: mongoose.Types.ObjectId | string | null;
  reportTo?: {
    admin?: IReportContact;
    superAdmin?: IReportContact;
    subAdmin?: IReportContact;
    super?: IReportContact;
  };
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const ReportContactSchema = new Schema<IReportContact>(
  {
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { _id: false }
);

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true, trim: true },
    agentId: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["admin", "super_admin", "sub_admin", "super", "master"],
      required: true,
    },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    appLink: { type: String, default: "" },
    parentId: { type: Schema.Types.ObjectId, ref: "Agent", default: null },
    reportTo: {
      admin: { type: ReportContactSchema, default: () => ({}) },
      superAdmin: { type: ReportContactSchema, default: () => ({}) },
      subAdmin: { type: ReportContactSchema, default: () => ({}) },
      super: { type: ReportContactSchema, default: () => ({}) },
    },
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

// Prevent mongoose model overwrite error upon hot-reload
const Agent: Model<IAgent> =
  mongoose.models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);

export default Agent;
