import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://sushibackend.azurewebsites.net/api/",
    baseUrl: "/api",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "user",
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
        },
      }),
      //   transformResponse(apiResponse: { result: any }, meta: any) {
      //     return {
      //       apiResponse,
      //       totalRecords: meta.response.headers.get("X-Pagination"),
      //     };
      //   },
      providesTags: ["Users"],
    }),
    postUsers: builder.mutation({
      query: () => ({
        url: "user",
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
      }),

      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, usePostUsersMutation } = userApi;
export default userApi;
