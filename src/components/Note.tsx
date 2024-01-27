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

import AddEditNoteDialog from "./AddEditNoteDialog";

interface NoteProps {
  note: NoteModel;
}

const Note = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const wasUpdated = note.updateAt > note.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
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
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default Note;
