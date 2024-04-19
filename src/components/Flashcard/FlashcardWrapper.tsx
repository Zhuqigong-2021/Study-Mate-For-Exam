"use client";
import React, { useEffect, useState } from "react";
import WildCardNote from "./WildCardNote";
import { SkeletonCard } from "../SkeletonCard";
type Note = {
  userId: string;
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    questionTitle: string;
    noteId: string;
    isFlagged: boolean;
    comment: string;
    choices: {
      id: string;
      content: string;
      answer: boolean;
    }[];
  }[];
  isShared: boolean;
  createdAt: Date;
  updateAt: Date;
};
type allNotesProps = {
  allNotes: Note[];
  //   isAdmin: boolean;
  //   isSuperAdmin: boolean;
};
const FlashcardWrapper = ({ allNotes }: allNotesProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="grid     gap-3  sm:grid-cols-2 lg:grid-cols-3">
      {isClient &&
        allNotes.map((note) => <WildCardNote note={note} key={note.id} />)}
      {!isClient && (
        <>
          {Array.from({ length: 9 }, (_: any, index: number) => (
            <SkeletonCard key={index} />
          ))}
        </>
      )}
      {isClient && allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You have no note to review in wildcard"}
        </div>
      )}
    </div>
  );
};

export default FlashcardWrapper;
