"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "../ui/card";
import { Report } from "@prisma/client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { RadioGroupItem } from "../ui/radio-group";
import MutipleChoiceQuestion from "../MutipleChoiceQuestion";
import { User, auth } from "@clerk/nextjs/server";
import { getUser } from "@/app/notes/_actions";
import { fullnameFormatter } from "@/app/utils/fullnameFormatter";
import { Span } from "next/dist/trace";
import { Loader2 } from "lucide-react";

export interface NoteType {
  id: string;
  title: string;
  description: string;
  questions: QuestionType[];
  updateAt: Date;
  createdAt: Date;
  isShared: boolean;
  userId: string;
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
  isFlagged: boolean;
  comment: string;
  noteId: string;
};

export interface NoteProps {
  id: string;
  note: NoteType;
  isAdmin: boolean;
  reportList: reportListType;
  userId: string;
  // questions: QuestionModel[];
  // choices: Choice[][];
}
export interface reportListType {
  id: string;
  reports: Report[];
}
const shuffleArray = (array: any) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const ExamNoteQuestion = ({
  id,
  note,
  isAdmin,
  reportList,
  userId,
}: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [startTime, setStartTime] = useState(() => {
    // Check if there's a start time in localStorage
    const savedStartTime = localStorage.getItem("startTime");
    if (savedStartTime) {
      return Number(savedStartTime);
    }
    // If not, set the current time as the start time and save it
    const now = Date.now();
    localStorage.setItem("startTime", now.toString());
    return now;
  });
  const [correctNumber, setCurrentNumber] = useState(0);
  const [user, setUser] = useState<User>();
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
  let batch = searchParams.get("batch");
  // console.log("batch: " + batch);

  const timerFromStorage = window?.localStorage.getItem("timer");
  const [time, setTime] = useState(
    timerFromStorage ? Number(timerFromStorage) : Number(timer),
  );

  if (!timer && timerFromStorage) {
    // Use the timer value from localStorage if available
    // timer = timerFromStorage;

    () => setTime(Number(timerFromStorage));
  } else {
    // console.log("we have timer");
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
      localStorage.removeItem("timer");
      router.push(
        `/exam/${note.id}/result` +
          "?" +
          createQueryString("correct", correctNumber.toString()) +
          "&" +
          createQueryString("total", totalQuestionNumber.toString()) +
          "&" +
          createQueryString("result", result.toString()) +
          "&" +
          createQueryString("id", note.id) +
          "&" +
          createQueryString("batch", batch ? batch : "") +
          "&" +
          createQueryString("choiceId", JSON.stringify(selectedChoices)),
      );

      toast.error("Time is up !!!");
    }
    return () => {
      clearInterval(timer);
    };
  }, [
    time,
    router,
    note,
    correctNumber,
    totalQuestionNumber,
    result,
    selectedChoices,
    batch,
  ]);

  // Save the current timer value to localStorage whenever it changes
  useEffect(() => {
    if (time) localStorage.setItem("timer", time.toString());
  }, [time]);

  const handleChoiceChange = (questionId: string, choiceIds: string[]) => {
    setSelectedChoices((prevSelectedChoices) => ({
      ...prevSelectedChoices,
      [questionId]: choiceIds,
    }));
  };

  // Determine the subset of questions for the given batch

  const batchSize = 60;

  // Check if 'batch' is null and provide a default value (e.g., 0) or handle accordingly
  // const currentBatch = useMemo(() => {
  //   return batch !== null ? Number(batch) : 0;
  // }, [batch]);
  // Convert the `batch` query parameter to a number
  const currentBatchIndex = Number(batch);

  // Calculate the total number of batches

  const totalQuestions = note.questions.length;
  const totalBatches = Math.ceil(totalQuestions / batchSize);

  // Determine the subset of questions for the given batch
  const batchQuestions = useMemo(() => {
    if (isNaN(currentBatchIndex)) {
      // If 'currentBatchIndex' is -1, return all questions
      return note.questions;
    }
    const start = currentBatchIndex * batchSize;
    let end = start + batchSize;

    // If this is the last batch, extend 'end' to include all remaining questions
    if (currentBatchIndex === totalBatches - 2) {
      end = totalQuestions; // Set 'end' to the total number of questions
    }

    // Slice the array to get the questions for the current batch
    return note.questions.slice(start, end);
  }, [currentBatchIndex, note.questions, totalBatches, totalQuestions]);
  // Render logic here
  // ...

  // const shuffledQuestions = useMemo(
  //   () => shuffleArray([...note.questions]),
  //   [note.questions],
  // );
  const shuffledBatchQuestions = useMemo(() => {
    return shuffleArray(batchQuestions);
  }, [batchQuestions]);

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
      setTotalQuestionNumber(shuffledBatchQuestions.length);
      setResult(
        Math.round((correctCount / shuffledBatchQuestions.length) * 100),
      );
    };

    // Call the function directly here to avoid missing dependencies warnings
    checkAnswers();
    // console.log("selectedChoices" + JSON.stringify(selectedChoices));
  }, [
    selectedChoices,
    note.questions,
    setCurrentNumber,
    setTotalQuestionNumber,
    setResult,
    shuffledBatchQuestions.length,
  ]);

  const getUserObj = useCallback(async () => {
    const user = await getUser(userId ?? "");

    return user;
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      const userObj = await getUserObj();
      if (userObj) {
        setUser(userObj);
      }
    };

    fetchUser();
  }, [getUserObj]);

  // console.log("noteId:" + id);
  // console.log("result:" + result);
  // console.log("choiceId:" + JSON.stringify(selectedChoices));
  // console.log("batch:" + batch);
  // console.log("userId:" + note.userId);
  // console.log("submitted:" + new Date());
  // useEffect(() => {
  //   return () => {
  //     // Clear any intervals or timeouts
  //     localStorage.removeItem("startTime"); // Optional: Clear only if the exam is completed
  //   };
  // }, []);
  const handleSubmitReport = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const endTime = Date.now();
      const timeSpent = endTime - startTime; // time spent in milliseconds
      // Formatting time spent into the desired string format
      const seconds = timeSpent / 1000;
      const minutes = seconds / 60;
      const hours = minutes / 60;

      let timeString;
      if (seconds < 60) {
        timeString = `${Math.round(seconds)}s`;
      } else if (minutes < 60) {
        timeString = `${Math.round(minutes)}min`;
      } else if (Math.floor(hours) === hours) {
        timeString = `${Math.floor(hours)}h`; // No decimal for whole numbers
      } else {
        timeString = `${hours.toFixed(1)}h`; // One decimal place for partial hours
      }
      if (!reportList) {
        const response = await fetch("/api/report", {
          method: "POST",
          body: JSON.stringify({
            noteId: id,
            noteTitle: note.title,
            time: timeString,
            // Number(timer) / 60000 >= 1 && Number(timer) / 60000 <= 60
            //   ? Number(timer) / 60000 + "min"
            //   : Number(timer) / 60000 > 60
            //     ? Number(timer) / 3600000 + "h"
            //     : Number(timer) / 1000 + "s",
            userName: fullnameFormatter(user?.firstName, user?.lastName),
            userEmail: user?.emailAddresses[0]?.emailAddress || "noEmail",
            result: Number(batch),
            choiceId: selectedChoices,
            batch: Number(batch),
            userId: note.userId,
            submittedAt: new Date(),
          }),
        });
        if (!response.ok) {
          toast.error("Sorry , something is wrong ");
          return;
        }

        toast.success("Congrats, You've finished your exam!");

        router.push(
          `/exam/${note.id}/result` +
            "?" +
            createQueryString("correct", correctNumber.toString()) +
            "&" +
            createQueryString("total", totalQuestionNumber.toString()) +
            "&" +
            createQueryString("result", result.toString()) +
            "&" +
            createQueryString("id", note.id) +
            "&" +
            createQueryString("batch", batch ? batch : "") +
            "&" +
            createQueryString("choiceId", JSON.stringify(selectedChoices)),
        );
      } else {
        const response = await fetch("/api/report", {
          method: "POST",
          body: JSON.stringify({
            noteId: id,
            noteTitle: note.title,
            userName: fullnameFormatter(user?.firstName, user?.lastName),
            userEmail: user?.emailAddresses[0]?.emailAddress || "noEmail",
            time: timeString,
            // Number(timer) / 60000 >= 1 && Number(timer) / 60000 <= 60
            //   ? Number(timer) / 60000 + "min"
            //   : Number(timer) / 60000 > 60
            //     ? Number(timer) / 3600000 + "h"
            //     : Number(timer) / 1000 + "s",
            result: Number(result),
            choiceId: selectedChoices,
            batch: Number(batch),
            userId: note.userId,
            submittedAt: new Date(),
            reportListId: reportList.id,
          }),
        });
        if (!response.ok) {
          toast.error("Sorry , something is wrong ");
          return;
        }
        setIsSubmitting(false);
        toast.success("Congrats, You've finished your exam!");
        router.push(
          `/exam/${note.id}/result` +
            "?" +
            createQueryString("correct", correctNumber.toString()) +
            "&" +
            createQueryString("total", totalQuestionNumber.toString()) +
            "&" +
            createQueryString("result", result.toString()) +
            "&" +
            createQueryString("id", note.id) +
            "&" +
            createQueryString("batch", batch ? batch : "") +
            "&" +
            createQueryString("choiceId", JSON.stringify(selectedChoices)),
        );
      }

      localStorage.removeItem("startTime");
    } catch (error) {
      toast.error("Sorry , something is wrong ");
    }
  }, [
    batch,
    correctNumber,
    id,
    note.id,
    note.title,
    note.userId,
    reportList,
    result,
    router,
    selectedChoices,
    startTime,
    totalQuestionNumber,
    user?.emailAddresses,
    user?.firstName,
    user?.lastName,
  ]);
  // console.log("emailASddress:" + user?.emailAddresses[0].emailAddress);
  // console.log(fullnameFormatter(user?.firstName, user?.lastName));
  return (
    <>
      {isClient && (
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
            {shuffledBatchQuestions.map(
              (question: QuestionType, index: number) => {
                return (
                  <MutipleChoiceQuestion
                    key={question.id}
                    isAdmin={isAdmin}
                    question={question}
                    index={index}
                    selectedChoices={selectedChoices[question.id] || []}
                    onChange={handleChoiceChange}
                  />
                );
              },
            )}
          </CardHeader>
          <CardFooter className="py-4"></CardFooter>

          <Button
            disabled={isSubmitting}
            className="absolute bottom-5 right-5"
            // onClick={() =>
            //   alert("result:" + `${(correctNumber / totalQuestionNumber) * 100}%`)
            // }

            onClick={() => {
              handleSubmitReport();
              if (localStorage.getItem("timer"))
                localStorage.removeItem("timer");
            }}
          >
            {/* <Link
            href={{
              pathname: `/exam/${id}/result`,
              query: {
                id: id,
                correct: correctNumber,
                total: totalQuestionNumber,
                result: result,
                choiceId: JSON.stringify(selectedChoices),
                batch: batch,
              },
            }}
          > */}
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Loader2 className=" h-4 w-4 animate-spin" />{" "}
                <span>Submit</span>
              </span>
            ) : (
              <span>Submit</span>
            )}
          </Button>
          <CardContent className="absolute right-5 top-5 text-teal-500">
            {convertMsToTime(Number(time))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ExamNoteQuestion;
