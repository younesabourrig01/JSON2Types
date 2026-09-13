import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  CreateBinResponse,
  BinData,
  TsTypesResponse,
} from '../types/api';

export const webhookApi = createApi({
  reducerPath: 'webhookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  }),
  tagTypes: ['BinRequests'], // Used for automatic cache invalidation
  endpoints: (builder) => ({
    // 1. Create a new Bin (Mutation)
    createBin: builder.mutation<CreateBinResponse, void>({
      query: () => ({
        url: '/bins',
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<CreateBinResponse>) =>
        response.data!,
    }),

    // 2. Get all requests for a specific Bin (Query)
    getBinRequests: builder.query<BinData, string>({
      query: (binId) => `/bins/${binId}`,
      transformResponse: (response: ApiResponse<BinData>) => response.data!,
      providesTags: (result, error, binId) => [{ type: 'BinRequests', id: binId }],
    }),

    // 3. Delete a Bin (Mutation)
    deleteBin: builder.mutation<boolean, string>({
      query: (binId) => ({
        url: `/bins/${binId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<null>) => response.success,
      invalidatesTags: (result, error, binId) => [{ type: 'BinRequests', id: binId }],
    }),

    // 4. Get TypeScript interfaces for a specific payload (Query)
    getRequestTsTypes: builder.query<
      string,
      { binId: string; requestId: string }
    >({
      query: ({ binId, requestId }) =>
        `/bins/${binId}/requests/${requestId}/types`,
      transformResponse: (response: ApiResponse<TsTypesResponse>) =>
        response.data!.typescriptTypes,
    }),
  }),
});

// Auto-generated React Hooks!
export const {
  useCreateBinMutation,
  useGetBinRequestsQuery,
  useDeleteBinMutation,
  useGetRequestTsTypesQuery,
} = webhookApi;