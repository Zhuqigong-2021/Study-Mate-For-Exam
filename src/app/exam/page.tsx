import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note/Note";
import ExamNote from "@/components/Exam/ExamNote";
import { SkeletonCard } from "@/components/SkeletonCard";
import ExamWrapper from "@/components/Exam/ExamWrapper";
import { checkRole } from "../utils/roles/role";

export const metadata: Metadata = {
  title: "Study Mate - Exam",
};
const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  // const allNotes = await prisma.note.findMany({ where: { userId } });

  // const isAdmin = checkRole("admin");
  // if (!isAdmin) redirect("/");

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

  return (
    <div>
      <ExamWrapper
        allNotes={allNotes}
        // isAdmin={isAdmin}
        // isSuperAdmin={isSuperAdmin}
      />
    </div>
    // <div className="grid     gap-3  sm:grid-cols-2 lg:grid-cols-3">
    //   {allNotes &&
    //     allNotes.map((note) => <ExamNote note={note} key={note.id} />)}
    //   {!allNotes && (
    //     <>
    //       {Array.from({ length: 9 }, (_: any, index: number) => (
    //         <SkeletonCard key={index} />
    //       ))}
    //     </>
    //   )}
    //   {allNotes.length === 0 && (
    //     <div className="col-span-full text-center">
    //       {"You have no note to take exam"}
    //     </div>
    //   )}
    // </div>
  );
};

export default NotesPage;
