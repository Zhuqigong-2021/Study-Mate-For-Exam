import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const starApi = createApi({
  reducerPath: "starApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://sushibackend.azurewebsites.net/api/",
    baseUrl: "/api",
  }),
  tagTypes: ["Star"],
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
    updateStar: builder.mutation({
      query: ({ currentUserId, notificationId, star }) => ({
        url: "/notification/inApp/star",
        method: "POST",
        body: { notificationId, currentUserId, star },
        headers: {
          "Content-Type": "Application/json",
        },
      }),

      invalidatesTags: ["Star"],
    }),
  }),
});

export const { useUpdateStarMutation } = starApi;
export default starApi;
