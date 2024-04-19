import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note/Note";
import ExamNote from "@/components/Exam/ExamNote";
import WildCardNote from "@/components/Flashcard/WildCardNote";
import FlashcardWrapper from "@/components/Flashcard/FlashcardWrapper";
import { checkRole } from "../utils/roles/role";

export const metadata: Metadata = {
  title: "Study Mate- Flashcard",
};
const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const isAdmin = checkRole("admin");
  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  let allNotes;
  if (isSuperAdmin) {
    allNotes = allNotes = await prisma.note.findMany({
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
  } else {
    allNotes = await prisma.note.findMany({
      where: { isShared: true },
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
  }
  // const allNotes = await prisma.note.findMany({
  //   where: { isShared: true },
  //   select: {
  //     id: true,
  //     title: true,
  //     description: true,
  //     isShared: true,
  //     updateAt: true,
  //     createdAt: true,
  //     userId: true,
  //     questions: {
  //       select: {
  //         id: true,
  //         questionTitle: true,
  //         isFlagged: true,
  //         comment: true,
  //         noteId: true,
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
  return (
    <div>
      <FlashcardWrapper allNotes={allNotes} />
    </div>
    // <div className="grid     gap-3  sm:grid-cols-2 lg:grid-cols-3">
    //   {allNotes.map((note) => (
    //     <WildCardNote note={note} key={note.id} />
    //   ))}
    //   {allNotes.length === 0 && (
    //     <div className="col-span-full text-center">
    //       {"You have no note to review in wildcard"}
    //     </div>
    //   )}
    // </div>
  );
};

export default NotesPage;
