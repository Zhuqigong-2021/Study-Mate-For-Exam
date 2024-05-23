import React from "react";
import prisma from "@/lib/db/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import AllReport from "@/components/Report/AllReport";
import { dateFormatter } from "../utils/dateFormatter";
import ReportWrapper from "@/components/Report/ReportWrapper";
import { getTranslations } from "next-intl/server";
import { checkMetaDataRole } from "../utils/roles/role";
import { auth } from "@clerk/nextjs";

interface Params {
  locale: string;
}

interface Context {
  params: Params;
}

export async function generateMetadata({ params: { locale } }: Context) {
  const t = await getTranslations({ locale, namespace: "Report" });

  return {
    title: t("metadata"),
  };
}

const page = async () => {
  let isAdmin = await checkMetaDataRole("admin");

  const reportList = await prisma.reportList.findMany({
    select: {
      id: true,
      reports: {
        select: {
          id: true,
          noteId: true,
          noteTitle: true,
          userName: true,
          userEmail: true,
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

  const { userId } = auth();
  // const singleUserReportList = await prisma.reportList.findMany({
  //   select: {
  //     id: true,
  //     reports: {
  //       select: {
  //         id: true,
  //         noteId: true,
  //         noteTitle: true,
  //         userName: true,
  //         userEmail: true,
  //         time: true,
  //         result: true,
  //         batch: true,
  //         userId: true,
  //         choiceId: true,
  //         reportListId: true,
  //         submittedAt: true,
  //       },
  //     },
  //   },
  // });
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  let reportsData;
  if (isAdmin) {
    reportsData = reportList[0].reports;
  } else {
    reportsData = reportList[0].reports.filter((r) => r.userId === userId);
  }
  return (
    <div className="mt-5 flex min-h-[450px] w-full flex-col items-center ">
      <div className="w-full max-w-7xl  ">
        <AllReport
          reports={reportsData}
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default page;
