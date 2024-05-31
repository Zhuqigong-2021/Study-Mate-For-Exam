import { redirect } from "next/navigation";

import { SearchUsers } from "./_search-users";
import { auth, clerkClient } from "@clerk/nextjs";
import { setRole } from "./_actions";
// import { checkMetaDataRole, checkRole } from "@/app/utils/roles/role";
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
import { pusherServer } from "@/lib/pusher";
import { checkMetaDataRole } from "../../utils/roles/role";

export const metadata: Metadata = {
  title: "Study Mate - Administration",
};

export default async function Dashboard() {
  const { userId } = auth();
  let isAdmin = await checkMetaDataRole("admin");

  // if (!checkRole("admin")) {
  //   redirect("/notes/public");
  // }

  if (!isAdmin) {
    redirect("/en/notes/public");
  }

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
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  const reportList = await prisma.reportList.findMany({
    select: {
      id: true,
      reports: {
        select: {
          id: true,
          noteId: true,
          noteTitle: true,
          userName: true,
          time: true,
          result: true,
          batch: true,
          userId: true,
          choiceId: true,
          reportListId: true,
          submittedAt: true,
        },
      },
    },
  });
  const reports = await prisma.report.findMany({});

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

  // Helper function to determine if a date is in the current month
  function isDateInCurrentMonth(date: Date) {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  // Function to count notes created in the current month
  function countNotesCreatedThisMonth(notes: any[]) {
    return notes.filter((note) => {
      const createdAtDate = new Date(note.createdAt);
      return isDateInCurrentMonth(createdAtDate);
    }).length;
  }

  // Calculate the number of notes created this month
  const numberOfNotesCreatedThisMonth = countNotesCreatedThisMonth(allNotes);

  return (
    <div className=" flex w-full flex-col items-center justify-center bg-slate-50  transition-all duration-700 ease-in-out dark:bg-background">
      <AdminDashboard
        users={JSON.stringify(users)}
        userId={userId}
        totalUsersNumber={totalUsersNumber}
        notesTotal={notesTotal}
        reportsNumber={reportsNumber}
        reports={JSON.stringify(reports)}
        isSuperAdmin={isSuperAdmin}
        numberOfNotesCreatedThisMonth={numberOfNotesCreatedThisMonth}
        isAdmin={isAdmin}
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
