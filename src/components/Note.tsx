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
import { ArrowUpFromLine, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface NoteProps {
  note: NoteModel;
  isAdmin: boolean;
}

const Note = ({ note, isAdmin }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [isShared, setIsShared] = useState(note.isShared);
  const wasUpdated = note.updateAt > note.createdAt;
  const router = useRouter();
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createdAt
  ).toDateString();
  async function ToggleShare(noteId: string, isShared: boolean) {
    // toast.custom("you got click");
    // Use the PUT method and include the 'action' parameter in the body
    const response = await fetch("/api/notes/share", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId, isShared: !isShared }),
    });
    if (response.ok) {
      setIsShared(!isShared);

      if (!isShared) {
        toast.success("you have successfully public a note");
      } else {
        toast.success("you have successfully unpublic a note");
      }
      router.refresh();
    } else {
      toast.error("something is wrong");
    }
    // ... handle the response as previously described
  }
  return (
    <>
      <Card
        className="relative cursor-pointer transition-shadow hover:shadow-lg"
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
        {isAdmin && (
          <Globe
            size={15}
            className={`absolute bottom-2 right-2 ${
              isShared ? "text-teal-500" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation(); // This stops the click event from propagating to the parent
              ToggleShare(note.id, isShared); // Assuming you want to toggle the current state
            }}
          />
        )}
      </Card>

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default Note;
