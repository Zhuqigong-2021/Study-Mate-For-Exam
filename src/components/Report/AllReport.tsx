"use client";
import React, { useEffect, useState } from "react";
import { Note, Prisma } from "@prisma/client";

import ReportWrapper from "./ReportWrapper";

interface ReportProps {
  reports: {
    id: string;
    result: number;
    userId: string;
    noteTitle: string;
    userName: string;
    userEmail: string;
    time: string;
    noteId: string;
    choiceId: Prisma.JsonValue;
    batch: number;
    reportListId: string;
    submittedAt: Date;
  }[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
}
const AllReport = ({ reports, isSuperAdmin, isAdmin }: ReportProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && (
        <ReportWrapper
          reports={reports}
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default AllReport;
