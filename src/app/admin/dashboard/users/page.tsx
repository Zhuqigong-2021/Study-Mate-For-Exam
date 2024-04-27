import React from "react";
import { SearchUsers } from "../_search-users";
import Userdata from "@/components/Userdata";
import { redirect } from "next/navigation";

import { auth, clerkClient } from "@clerk/nextjs";

import { checkRole } from "@/app/utils/roles/role";
import { Button } from "@/components/ui/button";

const allUsers = async (params: {
  searchParams: { search?: string; offset?: number; limit?: number };
}) => {
  const { userId } = auth();
  const query = params.searchParams.search;
  const offset = params.searchParams.offset;
  const limit = params.searchParams.limit;

  const users = query
    ? await clerkClient.users.getUserList({ query })
    : await clerkClient.users.getUserList({
        offset: offset || 0,
        limit: limit || 10,
        orderBy: "-created_at",
      });

  //   const users = await clerkClient.users.getUserList({});
  const totalUsersNumber = await clerkClient.users.getCount();
  return (
    <div className="mt-5 flex flex-col items-center justify-center ">
      <SearchUsers />
      <Userdata
        users={JSON.stringify(users)}
        userId={userId}
        totalUsersNumber={totalUsersNumber}
      />
    </div>
  );
};

export default allUsers;
