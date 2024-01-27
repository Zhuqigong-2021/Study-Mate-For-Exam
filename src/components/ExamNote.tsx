"use client";
import React, { useEffect, useState } from "react";
import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { useRouter } from "next/navigation";
import SetTimer from "./SetTimer";

export interface NoteProps {
  note: NoteModel;
}

const ExamNote = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const wasUpdated = note.updateAt > note.createdAt;
  const router = useRouter();

  // useEffect(() => {
  //   //router.replace(`/note/${note.id}/edit`);
  //   window.location.reload();
  // }, [note, router]);

  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        className="cursor-pointer  transition-shadow "
        // onClick={() => router.push(`/exam/${note.id}`)}
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && "( updated )"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
      </Card>
      <SetTimer
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        // questions={questions}
        noteToEdit={note}
      />
    </>
  );
};

export default ExamNote;
