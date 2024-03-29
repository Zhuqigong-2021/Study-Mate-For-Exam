import { redirect } from "next/navigation";

import { SearchUsers } from "./_search-users";
import { auth, clerkClient } from "@clerk/nextjs";
import { setRole } from "./_actions";
import { checkRole } from "@/app/utils/roles/role";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown } from "lucide-react";
import GrantAdmin from "@/components/GrantAdmin";
import Userdata from "@/components/Userdata";
import { off } from "process";

export default async function AdminDashboard(params: {
  searchParams: { search?: string; offset?: number; limit?: number };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }
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
    <div className="mt-5 flex  flex-col  items-center justify-center">
      <SearchUsers />
      <Userdata
        users={JSON.stringify(users)}
        userId={userId}
        totalUsersNumber={totalUsersNumber}
      />
      {/* <div className="my-10 flex w-full max-w-7xl items-center justify-center">
        <Table className="max-w-7xl">
          <TableCaption>All users in this app with details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-md min-w-[100px] font-semibold capitalize text-slate-900">
                username
              </TableHead>
              <TableHead className="text-md font-semibold capitalize  text-slate-900">
                email
              </TableHead>
              <TableHead className="text-md  font-semibold capitalize  text-slate-900">
                role
              </TableHead>
              <TableHead className="text-md text-right font-semibold capitalize  text-slate-900 ">
                operations
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>
                  {" "}
                  {
                    user.emailAddresses.find(
                      (email) => email.id === user.primaryEmailAddressId,
                    )?.emailAddress
                  }
                </TableCell>
                <TableCell>{user.publicMetadata.role as string}</TableCell>
                <TableCell className="flex justify-end space-x-4 text-right">
                  <GrantAdmin
                    userId={user.id}
                    userRole={user.publicMetadata.role as string}
                    currentUserId={userId ? userId : ""}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
}
