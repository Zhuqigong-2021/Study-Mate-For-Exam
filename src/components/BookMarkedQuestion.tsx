"use client";
import React, { useEffect, useState } from "react";
import { NoteProps } from "./ExamNoteQuestion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import EditBookMarkedQuestion from "./EditBookMarkedQuestion";
import { processString } from "@/app/utils/processString";
interface noteProps {
  id: string;
  title: string;
  updateAt: Date;
  createdAt: Date;
}
interface choiceProps {
  id: string;
  content: string;
  answer: boolean;
}
export interface QuesionType {
  note: noteProps;
  id: string;
  questionTitle: string;
  isFlagged: boolean;
  comment: string;
  choices: choiceProps[];
  noteId: string;
}
interface questionProps {
  question: QuesionType;
}

const BookMarkedQuestion = ({ question }: questionProps) => {
  // const [question, setQuestion] = useState(initialQuestion);
  const [isFlagged, setIsFlagged] = useState(question.isFlagged);
  const [refresh, setRefresh] = useState(false);
  const pathname = usePathname();
  const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
    useState(false);
  const router = useRouter();

  const bookMarked = async (
    e: React.MouseEvent<SVGElement>,
    questionId: string,
    isFlagged: boolean,
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, isFlagged: !isFlagged }),
      });
      // setIsFlagged(!isFlagged);
      if (response.ok) {
        setIsFlagged(!isFlagged);

        if (!isFlagged) {
          toast.success("you successfully bookmarked a question");
        } else {
          toast.success("you successfully unselect a question");
        }
        router.refresh();
      }
    } catch (error) {
      toast.success("your request is not successful");
    }
  };
  return (
    <>
      <Card
        className="relative flex flex-col items-center justify-center "
        onClick={() => setShowAddEditQuestionDialog(true)}
      >
        <CardHeader>
          <CardTitle>{question.note.title}</CardTitle>
        </CardHeader>
        <BookmarkCheck
          className={`${
            isFlagged ? " text-teal-600" : "text-black"
          } absolute  left-2 top-2 `}
          onClick={(e) => bookMarked(e, question.id, isFlagged)}
        />
        <CardContent>
          <span>{processString(question.questionTitle)}</span>
        </CardContent>
        <CardContent className="w-full text-end text-sm text-gray-500">
          {question.note.createdAt.toDateString()}
        </CardContent>
      </Card>
      <EditBookMarkedQuestion
        open={showAddEditQuestionDialog}
        setOpen={setShowAddEditQuestionDialog}
        question={question}
      />
    </>
  );
};

export default BookMarkedQuestion;
