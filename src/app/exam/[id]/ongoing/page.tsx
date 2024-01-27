import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";

import { idProps } from "../page";

import ExamNoteQuestion from "@/components/ExamNoteQuestion";

const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw Error("Note not found");
  const allQuestions = await prisma.question.findMany({
    where: { noteId: id },
  });

  const singleNoteWithDetails = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      questions: {
        select: {
          id: true,
          questionTitle: true,
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
  return (
    <div className=" grid gap-3 " suppressHydrationWarning={true}>
      {<ExamNoteQuestion note={singleNoteWithDetails} />}
    </div>
  );
};

export default page;
