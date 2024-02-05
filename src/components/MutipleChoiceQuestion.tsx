"use client";
import React, { useEffect, useMemo, useState } from "react";
import { CardContent, CardTitle } from "./ui/card";
import { ChoiceType, QuestionType } from "./ExamNoteQuestion";
import { Choice } from "@prisma/client";
import { BookmarkCheck } from "lucide-react";
import { auth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface multipleProps {
  question: QuestionType;
  selectedChoices: string[];
  //   handleCheckboxChange: (choiceId: string) => void;
  onChange: (questionId: string, choicesId: string[]) => void;
}
const MutipleChoiceQuestion = ({
  question,
  selectedChoices,

  onChange,
}: multipleProps) => {
  const [isFlagged, setIsFlagged] = useState(question.isFlagged);
  const router = useRouter();
  const correctAnswerCount = question.choices.filter(
    (choice) => choice.answer,
  ).length;
  const handleCheckboxChange = (choiceId: string) => {
    const currentChoices: string[] = selectedChoices as string[];
    const isCurrentlySelected = currentChoices.includes(choiceId);

    if (isCurrentlySelected) {
      // Allow deselection
      onChange(
        question.id,
        currentChoices.filter((id) => id !== choiceId),
      );
    } else {
      if (correctAnswerCount === 1) {
        // If only one answer is correct, replace the current selection
        onChange(question.id, [choiceId]);
      } else if (currentChoices.length < correctAnswerCount) {
        // For multiple correct answers, add to the current selections
        onChange(question.id, [...currentChoices, choiceId]);
      }
    }
  };
  // Shuffle choices
  const shuffledChoices = useMemo(() => {
    const choices = [...question.choices];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }, [question.choices]);

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
    <CardContent>
      <CardTitle className="relative mb-4">
        <BookmarkCheck
          className={`${
            isFlagged ? " text-teal-600" : "text-black"
          } absolute   -left-6 top-0 `}
          onClick={() => bookMarked(question.id, isFlagged)}
        />{" "}
        <span className=" pl-4">{question.questionTitle}</span>
      </CardTitle>
      {/* question.choices */}
      {shuffledChoices.map((c: ChoiceType, index: number) => {
        let choiceLetter = String.fromCharCode(65 + index); // ASCII 65 is 'A'
        // let choiceLetter = getChoiceLetter(index);

        let answer = c.answer;

        return (
          <CardContent
            key={c.id}
            className={`border-grey-600  relative my-2 flex h-[40px] items-center rounded-md border  text-left  `}
          >
            <input
              type="checkbox"
              className="absolute -left-5 top-[50%] -translate-y-[50%] "
              value={c.id}
              checked={selectedChoices.includes(c.id as string)}
              onChange={() => handleCheckboxChange(c.id)}
            />
            <span
              className="absolute top-[50%] -translate-y-[50%]"
              // className={`absolute  top-[50%] -translate-y-[50%] ${
              //   c.answer == true ? "bg-teal-400" : "bg-white"
              // }`}
            >
              {choiceLetter + "."} &nbsp;&nbsp;
              {c.content}
            </span>
          </CardContent>
        );
      })}
    </CardContent>
  );
};

export default MutipleChoiceQuestion;
