import { Schema, model } from "mongoose";
import { IBin, ICapturedRequest } from "../types/webhook.js";

const capturedRequestSchema = new Schema<ICapturedRequest>(
  {
    requestId: { type: String, required: true },
    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
    headers: { type: Schema.Types.Mixed, default: {} },
    body: { type: Schema.Types.Mixed, default: {} },
    queryParams: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true },
);
const binSchema = new Schema<IBin>(
  {
    binId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    requests: [capturedRequestSchema],
  },
  {
    timestamps: true,
  },
);

export const BinModel = model<IBin>("Bin", binSchema);
