import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import ExamNote from "@/components/ExamNote";
import WildCardNote from "@/components/WildCardNote";

import ReviewNoteQuestion from "@/components/ReviewNoteQuestion";
import ReviewNote from "@/components/ReviewNote";
import { checkRole } from "../utils/roles/role";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Study Mate - Review",
};

const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  // const isAdmin = checkRole("admin");
  // if (!isAdmin) redirect("/");
  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const allNotes = await prisma.note.findMany({ where: { isShared: true } });
  // const allNotes = await prisma.note.findMany({
  //   where: { userId },
  //   select: {
  //     id: true,
  //     title: true,
  //     description: true,

  //     questions: {
  //       include: {
  //         // questionTitle: true,
  //         choices: {
  //           select: {
  //             content: true,
  //             answer: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  return (
    <div className="grid     gap-3  sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <ReviewNote note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You have no note to review"}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
