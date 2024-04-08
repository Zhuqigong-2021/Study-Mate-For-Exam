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
import { BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import ReviewChoiceQuestion from "./ReviewChoiceQuestion";
export interface NoteType {
  id: string;
  title: string;
  description: string;
  questions: QuestionType[];
  isShared: boolean;
}
export interface QuestionType {
  id: string;
  questionTitle: string;
  isFlagged: boolean;
  comment: string;
  noteId: string;
  choices: ChoiceType[];
}

export interface ChoiceType {
  id: string;
  content: string;
  answer: boolean;
}
export interface NoteProps {
  note: NoteType;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const ReviewNoteQuestion = ({ note, isAdmin, isSuperAdmin }: NoteProps) => {
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
            // const [isFlagged, setIsFlagged] = useState(question.isFlagged);
            //console.log(JSON.stringify(note.questions));
            return (
              <CardContent key={q.id}>
                <ReviewChoiceQuestion
                  q={q}
                  index={index}
                  isSuperAdmin={isSuperAdmin}
                />
                {/* <CardTitle className="relative mb-4">
                  {" "}
                  <BookmarkCheck
                    className={`${
                      q.isFlagged ? " text-teal-600" : "text-black"
                    } absolute   -left-6 top-0 `}
                    // onClick={() => bookMarked(question.id, q.isFlagged)}
                  />{" "}
                  {q.questionTitle}
                </CardTitle> */}
                {/* {q.choices.map((c: ChoiceType, index: number) => {
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
                     
                      </span>
                    </CardContent>
                  );
                })} */}
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
