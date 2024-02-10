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

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }
  const { userId } = auth();
  const query = params.searchParams.search;

  const users = query
    ? await clerkClient.users.getUserList({ query })
    : await clerkClient.users.getUserList({});
  //   const users = await clerkClient.users.getUserList({});

  return (
    <div className="mt-5 flex  flex-col  items-center justify-center">
      <SearchUsers />
      <div className="mt-10 flex w-full max-w-7xl items-center justify-center">
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
                  {/* <form action={setRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input
                      type="hidden"
                      value={`${
                        user.publicMetadata.role === "admin" ? "" : "admin"
                      }`}
                      name="role"
                    />
                    <Button
                      type="submit"
                      className={`${
                        user.publicMetadata.role === "admin"
                          ? "bg-violet-500 "
                          : "border bg-transparent "
                      }  hover:bg-violet-800 hover:text-white`}
                    >
                      <Crown
                        size={15}
                        className={`${
                          user.publicMetadata.role === "admin"
                            ? "text-violet-50"
                            : "text-gray-800"
                        } hover:text-white `}
                      />
                    </Button>
                  </form> */}
                  {/* <form action={setRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="moderator" name="role" />
                    <Button type="submit" className="bg-indigo-400 text-white">
                      Make Moderator
                    </Button>
                  </form> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>

      {/* {users.map((user) => {
        return (
          <div key={user.id} className="flex w-full max-w-7xl space-x-4">
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>
              {
                user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId,
                )?.emailAddress
              }
            </div>
            <div>{user.publicMetadata.role as string}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <Button type="submit">Make Admin</Button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <Button type="submit">Make Moderator</Button>
              </form>
            </div>
          </div>
        );
      })} */}
    </div>
  );
}
