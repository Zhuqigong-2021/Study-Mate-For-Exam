"use client";
import React, { useState } from "react";
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

import AddEditNoteDialog from "./Note/AddEditNoteDialog";
import EditNoteQuestion from "./EditNoteQuestion";
import { Button } from "./ui/button";
import Link from "next/link";
import { processString } from "@/app/[locale]/utils/processString";
// import { processString } from "@/app/utils/processString";
export interface NoteType {
  id: string;
  title: string;
  description: string;
  questions: QuestionType[];
}
interface QuestionType {
  id: string;
  questionTitle: string;
  comment: string;
  isFlagged: boolean;
  choices: ChoiceType[];
}
interface ChoiceType {
  id?: string;
  content: string;
  answer: boolean;
}
interface NoteProps {
  note: NoteType;

  // questions: QuestionModel[];
  // choices: Choice[][];
}

const EditNote = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  // const wasUpdated = note.updateAt > note.createdAt;

  // const createdUpdatedAtTimestamp = (
  //   wasUpdated ? note.updateAt : note.createdAt
  // ).toDateString();
  // console.log(note);
  // if (showAddEditNoteDialog) {
  // window.location.reload();
  // }
  return (
    <>
      <Card
        className="relative cursor-pointer pb-10 transition-shadow hover:shadow-lg "
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>

        <CardHeader>
          {note.questions.map((q: QuestionType, i: number) => {
            return (
              <CardContent key={q.id}>
                <CardTitle className="mb-4">
                  {processString(q.questionTitle)}
                </CardTitle>
                {q.choices.map((c: ChoiceType, index: number) => {
                  let choiceLetter = String.fromCharCode(65 + index);

                  let answer = c.answer;

                  return (
                    <CardContent
                      key={c?.id}
                      className="relative my-2 min-h-[40px] rounded-sm border  border-slate-300"
                    >
                      <span className="absolute top-[50%] -translate-y-[50%]">
                        {choiceLetter + "."} &nbsp;&nbsp;
                        {processString(c.content)}
                      </span>
                    </CardContent>
                  );
                })}
              </CardContent>
            );
          })}
          {note.questions.length === 0 && (
            <CardContent className="font-bold ">
              You have no questions for the time being!
            </CardContent>
          )}
          {/* <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && "( updated )"}
          </CardDescription> */}
        </CardHeader>
        <CardFooter className="py-4"></CardFooter>

        <Button asChild className="absolute bottom-5 right-10">
          <Link href="/notes">Back</Link>
        </Button>
      </Card>
      <EditNoteQuestion
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default EditNote;
