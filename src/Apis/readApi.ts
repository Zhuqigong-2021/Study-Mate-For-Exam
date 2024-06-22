import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const readApi = createApi({
  reducerPath: "readApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://sushibackend.azurewebsites.net/api/",
    baseUrl: "/api",
  }),
  tagTypes: ["Read"],
  endpoints: (builder) => ({
    // getUsers: builder.query({
    //   query: () => ({
    //     url: "user",
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "Application/json",
    //     },
    //   }),

    //   providesTags: ["Users"],
    // }),
    updateRead: builder.mutation({
      query: ({ notificationId }) => ({
        url: "unread",
        method: "POST",
        body: { notificationId },
        headers: {
          "Content-Type": "Application/json",
        },
      }),

      invalidatesTags: ["Read"],
    }),
  }),
});

export const { useUpdateReadMutation } = readApi;
export default readApi;
