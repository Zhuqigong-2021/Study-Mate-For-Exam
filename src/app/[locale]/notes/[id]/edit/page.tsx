import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";

import { idProps } from "../page";

import { checkRole } from "@/app/[locale]/utils/roles/role";
import UpdateEditQuestions from "@/components/Editquestion/UpdateEditQuestions";
// import { checkRole } from "@/app/utils/roles/role";

const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  const isAdmin = checkRole("admin");
  if (!userId) throw Error("userId undefined");

  // const allNotes = await prisma.note.findMany({ where: { userId } });
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
          comment: true,
          isFlagged: true,
          choices: {
            select: {
              id: true,
              content: true,
              answer: true,
            },
          },
        },

        // include: {
        //   choices: {
        //     select: {
        //       content: true,
        //       answer: true,
        //     },
        //   },
        // },
      },
    },
  });
  if (!singleNoteWithDetails) throw Error("Note Details not Found");

  const AllQuestions = await prisma.question.findMany({
    select: {
      id: true, // Assuming you might need the ID as well
      questionTitle: true,
      comment: true,
      isFlagged: true,
      noteId: true,
      note: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updateAt: true,
        },
      },
      choices: {
        select: {
          id: true,
          content: true,
          answer: true,
        },
      },
    },
  });
  return (
    <div className="w-full max-w-[84rem]" suppressHydrationWarning={true}>
      {/* <EditNote note={singleNoteWithDetails} /> */}
      <UpdateEditQuestions
        flaggedQuestions={AllQuestions}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default page;
