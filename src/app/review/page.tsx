import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import ExamNote from "@/components/ExamNote";
import WildCardNote from "@/components/WildCardNote";

import ReviewNoteQuestion from "@/components/ReviewNoteQuestion";
import ReviewNote from "@/components/ReviewNote";

export const metadata: Metadata = {
  title: "Study Mate - Review",
};

const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
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
          {"You have no note to take exam"}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
