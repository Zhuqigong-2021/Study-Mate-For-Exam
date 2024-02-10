"use client";
import React, { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Choice, Note as NoteModel, Question } from "@prisma/client";
import { Question as QuestionModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
export interface NoteType {
  id: string;
  title: string;
  description: string;
  questions: QuestionType[];
}
interface QuestionType {
  id: string;
  questionTitle: string;
  choices: ChoiceType[];
  noteId: string;
}
interface ChoiceType {
  id?: string;
  content: string;
  answer: boolean;
}
export interface NoteProps {
  note: NoteType;
  isAdmin: boolean;
}

const ReviewNoteQuestion = ({ note, isAdmin }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <Card
        className="relative cursor-pointer pb-10 transition-shadow hover:shadow-lg"
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          {/* <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && "( updated )"}
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
        <CardHeader>
          {note.questions.map((q: QuestionType, index: number) => {
            return (
              <CardContent key={q.id}>
                <CardTitle className="mb-4">{q.questionTitle}</CardTitle>
                {q.choices.map((c: ChoiceType, index: number) => {
                  let choiceLetter = String.fromCharCode(65 + index);
                  // let choiceLetter =
                  //   index === 0
                  //     ? "A"
                  //     : index === 1
                  //       ? "B"
                  //       : index === 2
                  //         ? "C"
                  //         : index === 3
                  //           ? "D"
                  //           : index === 4
                  //             ? "E"
                  //             : index === 5
                  //               ? "F"
                  //               : index === 6
                  //                 ? "G"
                  //                 : "H";
                  let answer = c.answer;
                  return (
                    <CardContent
                      key={c.id}
                      className={`border-grey-600  relative my-2 flex h-[40px] items-center rounded-md border  text-left hover:shadow-lg ${
                        answer ? "hover:bg-green-50" : "hover:bg-red-100"
                      }`}
                    >
                      <span className="absolute top-[50%] -translate-y-[50%]">
                        {choiceLetter + "."} &nbsp;&nbsp;
                        {c.content}
                      </span>
                    </CardContent>
                  );
                })}
              </CardContent>
            );
          })}
        </CardHeader>
        <CardFooter className="py-4"></CardFooter>
        {/* <Button asChild className="right-30 absolute bottom-2 right-20 ">
          <Link href={`/notes/${note.id}/edit`}>Edit</Link>
        </Button> */}
        {isAdmin && (
          <BsPencilSquare
            className="right-30 absolute right-10 top-10 scale-125 "
            onClick={() => {
              router.push(`/notes/${note.id}/edit`);
            }}
          />
        )}
        <Button asChild className="absolute bottom-5 right-10">
          <Link href="/notes/public">Back</Link>
        </Button>
      </Card>
      {/* <EditNoteQuestion
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
      /> */}
    </>
  );
};

export default ReviewNoteQuestion;
