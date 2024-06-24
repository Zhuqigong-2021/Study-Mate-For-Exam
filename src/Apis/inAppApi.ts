import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const inAppApi = createApi({
  reducerPath: "inAppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["inApp"],
  endpoints: (builder) => ({
    getInApp: builder.query({
      query: () => ({
        url: "/notification/inApp",
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
        },
      }),

      providesTags: ["inApp"],
    }),
    updateInApp: builder.mutation({
      query: () => ({
        url: "/notification/inApp",
        method: "POST",

        headers: {
          "Content-Type": "Application/json",
        },
      }),

      invalidatesTags: ["inApp"],
    }),
  }),
});

export const { useGetInAppQuery, useUpdateInAppMutation } = inAppApi;
export default inAppApi;
