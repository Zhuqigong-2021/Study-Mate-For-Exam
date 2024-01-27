"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { RadioGroupItem } from "./ui/radio-group";
import MutipleChoiceQuestion from "./MutipleChoiceQuestion";

export interface NoteType {
  id: string;
  title: string;
  description: string;
  questions: QuestionType[];
}

export type ChoiceType = {
  id: string;
  content: string;
  answer: boolean;
};

export type QuestionType = {
  id: string;
  questionTitle: string;
  choices: ChoiceType[];
};

interface NoteProps {
  note: NoteType;
  // questions: QuestionModel[];
  // choices: Choice[][];
}

const ExamNoteQuestion = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [correctNumber, setCurrentNumber] = useState(0);
  const [totalQuestionNumber, setTotalQuestionNumber] = useState(
    note.questions.length,
  );
  const [result, setResult] = useState(0);
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };
  //   const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<
    Record<string, string[]>
  >({});
  const router = useRouter();
  // const navigator = Router();
  const searchParams = useSearchParams();
  let timer = searchParams.get("timer");

  const timerFromStorage = localStorage.getItem("timer");
  const [time, setTime] = useState(
    timerFromStorage ? Number(timerFromStorage) : Number(timer),
  );

  if (!timer && timerFromStorage) {
    // Use the timer value from localStorage if available
    // timer = timerFromStorage;
    console.log("we hit the timer assignment ");
    () => setTime(Number(timerFromStorage));
  } else {
    console.log("we have timer");
  }

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }
  function convertMsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds,
    )}`;
  }

  useEffect(() => {
    let timer: any;

    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
    }
    if (time === 0) {
      // router.push("/exam");
      // router.push(`/exam/${note.id}/result `);
      localStorage.removeItem("timer");
      router.push(
        `/exam/${note.id}/result` +
          "?" +
          createQueryString("correct", correctNumber.toString()) +
          "&" +
          createQueryString("total", totalQuestionNumber.toString()) +
          "&" +
          createQueryString("result", result.toString()),
      );

      toast.error("Time is up !!!");
    }
    return () => {
      clearInterval(timer);
    };
  }, [time, router, note, correctNumber, totalQuestionNumber, result]);

  // Save the current timer value to localStorage whenever it changes
  useEffect(() => {
    if (time) localStorage.setItem("timer", time.toString());
  }, [time]);

  // const handleChoiceChange = (questionId: string, choiceId: string | null) => {
  //   setSelectedChoices((prevSelectedChoices) => ({
  //     ...prevSelectedChoices,
  //     [questionId]: choiceId,
  //   }));
  // };
  const handleChoiceChange = (questionId: string, choiceIds: string[]) => {
    setSelectedChoices((prevSelectedChoices) => ({
      ...prevSelectedChoices,
      [questionId]: choiceIds,
    }));
  };
  useEffect(() => {
    const checkAnswers = () => {
      let correctCount = 0;

      for (const question of note.questions) {
        const selectedChoicesForQuestion = selectedChoices[question.id] || [];
        const correctAnswerIds = question.choices
          .filter((choice) => choice.answer)
          .map((choice) => choice.id);

        const isCorrect =
          correctAnswerIds.every((id) =>
            selectedChoicesForQuestion.includes(id),
          ) &&
          selectedChoicesForQuestion.every((id) =>
            correctAnswerIds.includes(id),
          );

        if (isCorrect) {
          correctCount++;
        }
      }

      setCurrentNumber(correctCount);
      setTotalQuestionNumber(note.questions.length);
      setResult(Math.round((correctCount / note.questions.length) * 100));
    };

    // Call the function directly here to avoid missing dependencies warnings
    checkAnswers();
  }, [
    selectedChoices,
    note.questions,
    setCurrentNumber,
    setTotalQuestionNumber,
    setResult,
  ]);

  return (
    <>
      <Card
        className="relative cursor-pointer  pb-10 transition-shadow hover:shadow-lg"
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
        <CardHeader>
          {note.questions.map((question: QuestionType, index: number) => {
            // console.log("question id:" + question.id);
            return (
              <MutipleChoiceQuestion
                key={question.id}
                question={question}
                selectedChoices={selectedChoices[question.id] || []}
                onChange={handleChoiceChange}
              />
            );
          })}
        </CardHeader>
        <CardFooter className="py-4"></CardFooter>

        <Button
          //   asChild
          className="absolute bottom-5 right-5"
          // onClick={() =>
          //   alert("result:" + `${(correctNumber / totalQuestionNumber) * 100}%`)
          // }
          onClick={() => {
            if (localStorage.getItem("timer")) localStorage.removeItem("timer");
          }}
        >
          <Link
            href={{
              pathname: `/exam/${note.id}/result`,
              query: {
                correct: correctNumber,
                total: totalQuestionNumber,
                result: result,
              },
            }}
          >
            Confirm
          </Link>
        </Button>
        <CardContent className="absolute right-5 top-5 text-teal-500">
          {convertMsToTime(Number(time))}
        </CardContent>
      </Card>
    </>
  );
};

export default ExamNoteQuestion;