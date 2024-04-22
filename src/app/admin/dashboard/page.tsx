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
import { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import prisma from "@/lib/db/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study Mate - Administration",
};

export default async function Dashboard(params: {
  searchParams: { search?: string; offset?: number; limit?: number };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }
  const { userId } = auth();
  const query = params.searchParams.search;
  const offset = params.searchParams.offset;
  const limit = params.searchParams.limit;

  // const users = query
  //   ? await clerkClient.users.getUserList({ query })
  //   : await clerkClient.users.getUserList({
  //       offset: offset || 0,
  //       limit: limit || 10,
  //       orderBy: "-created_at",
  //   });
  const totalUsersNumber = await clerkClient.users.getCount();
  const users = await clerkClient.users.getUserList({
    limit: totalUsersNumber,
  });

  //   const users = await clerkClient.users.getUserList({});

  let allNotes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      isShared: true,
      updateAt: true,
      createdAt: true,
      userId: true,
      questions: {
        select: {
          id: true,
          questionTitle: true,
          isFlagged: true,
          comment: true,
          noteId: true,
          choices: {
            select: {
              id: true,
              content: true,
              answer: true,
            },
          },
        },
      },
    },
  });
  let notesTotal = await prisma.note.count({});
  let reportsNumber = await prisma.report.count({});
  return (
    <div className="flex flex-col items-center justify-center ">
      <AdminDashboard
        users={JSON.stringify(users)}
        userId={userId}
        totalUsersNumber={totalUsersNumber}
        notesTotal={notesTotal}
        reportsNumber={reportsNumber}
      />
      {/* <SearchUsers />
      <Userdata
        users={JSON.stringify(users)}
        userId={userId}
        totalUsersNumber={totalUsersNumber}
      /> */}
    </div>
  );
}

{
  /* <div className="my-10 flex w-full max-w-7xl items-center justify-center">
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
      </div> */
}
