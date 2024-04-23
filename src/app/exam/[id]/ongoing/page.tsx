import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";

import { idProps } from "../page";

import ExamNoteQuestion from "@/components/Exam/ExamNoteQuestion";
import { checkRole } from "@/app/utils/roles/role";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Mate - Taking Exams",
};
const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();
  const isAdmin = checkRole("admin");
  if (!userId) throw Error("userId undefined");
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw Error("Note not found");
  // const allQuestions = await prisma.question.findMany({
  //   where: { noteId: id },
  // });

  const singleNoteWithDetails = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      isShared: true,
      createdAt: true,
      updateAt: true,
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

  if (!singleNoteWithDetails) throw Error("Note Details not Found");
  const reportList = await prisma.reportList.findMany({
    select: {
      id: true,
      reports: {
        select: {
          id: true,
          noteId: true,
          userName: true,
          userEmail: true,
          noteTitle: true,
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
  return (
    <div className=" grid gap-3 " suppressHydrationWarning={true}>
      {
        <ExamNoteQuestion
          note={singleNoteWithDetails}
          id={id}
          isAdmin={isAdmin}
          reportList={reportList[0]}
          userId={userId}
        />
      }
    </div>
  );
};

export default page;
