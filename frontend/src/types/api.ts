export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
}

export interface CapturedRequest {
  _id: string;
  requestId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, unknown>;
  body: unknown;
  queryParams: Record<string, unknown>;
  ip: string;
  timestamp: string;
}

export interface BinData {
  binId: string;
  totalRequests: number;
  requests: CapturedRequest[];
}

export interface CreateBinResponse {
  binId: string;
  endpointUrl: string;
  createdAt: string;
}

export interface TsTypesResponse {
  requestId: string;
  typescriptTypes: string;
}