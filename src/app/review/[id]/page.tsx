import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ReviewNoteQuestion from "@/components/ReviewNoteQuestion";
import { idProps } from "@/app/notes/[id]/page";
import { checkRole } from "@/app/utils/roles/role";

const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();
  const isAdmin = checkRole("admin");
  if (!userId) throw Error("userId undefined");
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw Error("Note not found");
  // const allQuestions = await prisma.question.findMany({
  //   where: { noteId: id },
  // });

  // const singleNoteWithDetails = await prisma.note.findUnique({
  //   where: {
  //     id,
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     description: true,
  //     questions: {
  //       include: {
  //         //questionTitle: true,
  //         isFlagged: true,
  //         choices: {
  //           select: {
  //             id: true,
  //             content: true,
  //             answer: true,
  //           },
  //         },
  //       },
  //     },
  //   },
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

  return (
    <div className=" grid gap-3" suppressHydrationWarning={true}>
      {
        <ReviewNoteQuestion
          note={singleNoteWithDetails}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
        />
      }
    </div>
  );
};

export default page;
