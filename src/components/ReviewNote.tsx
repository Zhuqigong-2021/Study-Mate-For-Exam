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

export interface NoteProps {
  note: NoteModel;
}

const ReviewNote = ({ note }: NoteProps) => {
  const router = useRouter();

  // const createdUpdatedAtTimestamp = (
  //   wasUpdated ? note.updateAt : note.createdAt
  // ).toDateString();
  const createdAtTimestamp = note.createdAt.toDateString();
  return (
    <>
      <Card
        className="cursor-pointer  transition-shadow "
        // onClick={() => router.push(`/exam/${note.id}`)}
        onClick={() => router.push(`/review/${note.id}`)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>{createdAtTimestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default ReviewNote;
