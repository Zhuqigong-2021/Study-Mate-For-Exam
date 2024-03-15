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
import { CheckCircle2, XCircle } from "lucide-react";
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
  mappedData: any[] | mappedDataType[];
}

interface mappedDataType {
  questionId: string;
  selectedChoices: string[] | [];
}
const ReportNoteQuestion = ({ note, mappedData }: NoteProps) => {
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
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
        <CardHeader>
          {note.questions.map((q: QuestionType, index: number) => {
            return (
              <CardContent key={q.id}>
                <CardTitle className="mb-4">
                  {index + 1 + ". " + q.questionTitle}
                </CardTitle>
                {q.choices.map((c: ChoiceType, index: number) => {
                  let choiceLetter = String.fromCharCode(65 + index);

                  let answer = c.answer;
                  let rightChoice = q.choices.map((c) => c.answer == true);
                  let selectedChoiceIds = mappedData.find(
                    (d) => d.questionId === q.id,
                  )?.selectedChoices;
                  //console.log("choice id:" + c.id);
                  //console.log("selectedChoiceId:" + selectedChoiceIds);
                  return (
                    <CardContent
                      key={c.id}
                      //   className={`border-grey-600  relative my-2 flex h-[40px] items-center rounded-md border  text-left hover:shadow-lg ${
                      //     answer ? "bg-green-50" : ""
                      //   }`}
                      className={`border-grey-600 relative my-2 flex min-h-[40px] items-center rounded-md  border pb-0 text-left hover:shadow-lg 
                      ${
                        answer
                          ? "bg-green-50"
                          : selectedChoiceIds?.includes(c.id)
                            ? "bg-red-50"
                            : ""
                      }`}
                    >
                      {/* className="absolute top-[50%] -translate-y-[50%] " */}
                      <span>
                        {choiceLetter + "."} &nbsp;&nbsp;
                        {c.content}
                      </span>
                      {c.answer && selectedChoiceIds?.includes(c.id) && (
                        <CheckCircle2 className="absolute right-2 top-[50%] -translate-y-[50%] rounded-full bg-green-400 text-white" />
                      )}
                      {!c.answer && selectedChoiceIds?.includes(c.id) && (
                        <XCircle className="absolute right-2 top-[50%] -translate-y-[50%] rounded-full bg-red-400 text-white" />
                      )}
                    </CardContent>
                  );
                })}
              </CardContent>
            );
          })}
        </CardHeader>
        <CardFooter className="py-4"></CardFooter>

        <Button asChild className="absolute bottom-5 right-10">
          <Link href="/exam">Back</Link>
        </Button>
      </Card>
    </>
  );
};

export default ReportNoteQuestion;
