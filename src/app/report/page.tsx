import React from "react";
import { auth } from "@clerk/nextjs";

import prisma from "@/lib/db/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import AllReport from "@/components/Report/AllReport";
import { dateFormatter } from "../utils/dateFormatter";
import ReportWrapper from "@/components/Report/ReportWrapper";

const page = async () => {
  const reportList = await prisma.reportList.findMany({
    select: {
      id: true,
      reports: {
        select: {
          id: true,
          noteId: true,
          noteTitle: true,
          userName: true,
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
  // function formatDate(dateString: string | number | Date): string {
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   };
  //   return new Intl.DateTimeFormat("default", options).format(
  //     new Date(dateString),
  //   );
  // }
  //   async function getUser(userId: string) {
  //     const user = await clerkClient.users.getUser(userId);
  //     return user;
  //   }
  const { userId } = auth();
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  return (
    <div className="flex min-h-[850px] w-full flex-col items-center justify-center ">
      <div className="w-full max-w-7xl  ">
        <AllReport
          reports={reportList[0].reports}
          isSuperAdmin={isSuperAdmin}
        />
      </div>
    </div>
  );
};

export default page;
