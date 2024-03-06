"use client";
import React, { useState } from "react";
import { CardContent, CardTitle } from "./ui/card";

import { BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import { QuestionType, ChoiceType } from "./ReviewNoteQuestion";
interface propType {
  q: QuestionType;
}
const ReviewChoiceQuestion = ({ q }: propType) => {
  const [isFlagged, setIsFlagged] = useState(q.isFlagged);
  const bookMarked = async (questionId: string, isFlagged: boolean) => {
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
        // router.refresh();
        setIsFlagged(!isFlagged);

        if (!isFlagged) {
          toast.success("you successfully bookmarked a question");
        } else {
          toast.success("you successfully unselect a question");
        }
      }
    } catch (error) {
      toast.success("your request is not successful");
    }
  };
  return (
    <>
      <CardTitle className="relative mb-4">
        <BookmarkCheck
          className={`${
            isFlagged ? " text-teal-600" : "text-black"
          } absolute   -left-6 top-0 `}
          onClick={() => bookMarked(q.id, isFlagged)}
        />
        {q.questionTitle}
      </CardTitle>
      {q.choices.map((c: ChoiceType, index: number) => {
        let choiceLetter = String.fromCharCode(65 + index);
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
    </>
  );
};

export default ReviewChoiceQuestion;
