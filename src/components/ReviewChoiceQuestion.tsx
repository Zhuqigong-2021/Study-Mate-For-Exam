"use client";
import React, { useState } from "react";
import { CardContent, CardTitle } from "./ui/card";

import { BookmarkCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { QuestionType, ChoiceType } from "./ReviewNoteQuestion";
import { processString } from "@/app/utils/processString";
interface propType {
  q: QuestionType;
  index: number;
  isSuperAdmin: boolean;
}
const ReviewChoiceQuestion = ({ q, index, isSuperAdmin }: propType) => {
  const [isFlagged, setIsFlagged] = useState(q.isFlagged);
  const [isLoading, setIsLoading] = useState(false);
  const bookMarked = async (questionId: string, isFlagged: boolean) => {
    setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.success("your request is not successful");
    }
  };
  return (
    <div className="max-w-[1200px]">
      <CardTitle className="relative mb-4 flex items-center  text-[18px] lg:text-[22px]">
        {isSuperAdmin && !isLoading && (
          <BookmarkCheck
            className={`${
              isFlagged ? " text-teal-600" : "text-black"
            } absolute   -left-6 top-1 `}
            onClick={() => bookMarked(q.id, isFlagged)}
          />
        )}
        {isLoading && (
          <Loader2 className=" absolute -left-6 top-2 h-4   w-4 animate-spin " />
        )}

        <span>
          {index + 1 + ". "}
          {processString(q.questionTitle)}
        </span>
      </CardTitle>
      {q.choices.map((c: ChoiceType, index: number) => {
        let choiceLetter = String.fromCharCode(65 + index);
        let answer = c.answer;
        return (
          <CardContent
            key={c.id}
            className={`border-grey-600  relative my-2 flex min-h-[40px] items-center rounded-md border py-2  text-left hover:shadow-lg ${
              answer ? "hover:bg-green-50" : "hover:bg-red-100"
            }`}
          >
            <span className="">
              {choiceLetter + "."} &nbsp;&nbsp;
              {processString(c.content)}
            </span>
          </CardContent>
        );
      })}
    </div>
  );
};

export default ReviewChoiceQuestion;
