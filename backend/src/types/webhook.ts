import { Types } from "mongoose";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ICapturedRequest {
  _id?: Types.ObjectId;
  requestId: string;
  method: HttpMethod;
  headers: Record<string, unknown>;
  body: unknown;
  queryParams: Record<string, unknown>;
  ip: string;
  timestamp: Date;
}

export interface IBin {
  binId: string;
  requests: ICapturedRequest[];
  createdAt: Date;
  updatedAt: Date;
}
