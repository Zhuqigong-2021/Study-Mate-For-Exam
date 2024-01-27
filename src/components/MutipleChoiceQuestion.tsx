"use client";
import React, { useMemo } from "react";
import { CardContent, CardTitle } from "./ui/card";
import { ChoiceType, QuestionType } from "./ExamNoteQuestion";
import { Choice } from "@prisma/client";

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
  const getChoiceLetter = (index: number) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letter = "";
    let currentIndex = index;

    do {
      letter = letters[currentIndex % 26] + letter;
      currentIndex = Math.floor(currentIndex / 26) - 1; // -1 is important because it's zero-based index
    } while (currentIndex >= 0);

    return letter;
  };
  return (
    <CardContent>
      <CardTitle className="mb-4">{question.questionTitle}</CardTitle>
      {/* question.choices */}
      {shuffledChoices.map((c: ChoiceType, index: number) => {
        let choiceLetter = String.fromCharCode(65 + index); // ASCII 65 is 'A'
        // let choiceLetter = getChoiceLetter(index);

        let answer = c.answer;

        return (
          <CardContent
            key={c.id}
            className={`border-grey-600  relative my-2 flex h-[40px] items-center rounded-md border  text-left `}
          >
            <input
              type="checkbox"
              className="absolute -left-5 top-[50%] -translate-y-[50%] "
              value={c.id}
              checked={selectedChoices.includes(c.id as string)}
              onChange={() => handleCheckboxChange(c.id)}
            />
            <span className="absolute top-[50%] -translate-y-[50%]">
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
