import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import ExamNote from "@/components/ExamNote";

export const metadata: Metadata = {
  title: "Study Mate - Exam",
};
const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div className="grid     gap-3  sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <ExamNote note={note} key={note.id} />
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
