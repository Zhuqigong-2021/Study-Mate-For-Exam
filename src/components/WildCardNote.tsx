"use client";
import React, { useState } from "react";
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

interface NoteProps {
  note: NoteModel;
}

const WildCardNote = ({ note }: NoteProps) => {
  const router = useRouter();
  const wasUpdated = note.updateAt > note.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        className="cursor-pointer  transition-shadow "
        onClick={() => router.push(`/wildcard/${note.id}`)}
        // onClick={() => setShowAddEditNoteDialog(true)}
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
      {/* <SetTimer
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        // questions={questions}
        noteToEdit={note}
      /> */}
    </>
  );
};

export default WildCardNote;
