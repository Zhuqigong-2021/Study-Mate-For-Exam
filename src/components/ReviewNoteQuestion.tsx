"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { BookmarkCheck, Loader, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ReviewChoiceQuestion from "./ReviewChoiceQuestion";
import Cookie from "js-cookie";
import { useInfiniteScroll } from "@/app/[locale]/utils/useInfiniteScroll";
// import { useInfiniteScroll } from "@/app/utils/useInfiniteScroll";
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
  const [showAnswerOnly, setShowAnswerOnly] = useState(false);
  const [isLoadAll, setIsLoadAll] = useState(false);
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [page, setPage] = useState(0); // start from page 0 to handle the initial load correctly
  const [hasMore, setHasMore] = useState(true);
  const [lang, setLang] = useState(Cookie.get("NEXT_LOCALE") ?? "en");

  const pageSize = 10;
  const fetchMoreQuestions = useCallback(async () => {
    if (!hasMore) return;

    const nextPage = page + 1;
    const response = await fetch(
      `/${lang}/api/questions?noteId=${note.id}&page=${nextPage}&pageSize=10`,
    );
    const newQuestions = await response.json();
    if (newQuestions && newQuestions.questions.length > 0) {
      setQuestions((prevQuestions) => {
        const existingQuestionIds = new Set(prevQuestions.map((q) => q.id));
        const uniqueNewQuestions = newQuestions.questions.filter(
          (q: any) => !existingQuestionIds.has(q.id),
        );
        return [...prevQuestions, ...uniqueNewQuestions];
      });
      setPage(nextPage);
      setHasMore(newQuestions.questions.length === pageSize);
    }
  }, [hasMore, page, lang, note.id]);

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreQuestions);

  useEffect(() => {
    if (page === 0) fetchMoreQuestions(); // Initial load
  }, [fetchMoreQuestions, page]);

  useEffect(() => {
    if (hasMore && isFetching) {
      fetchMoreQuestions();
    }
  }, [fetchMoreQuestions, hasMore, isFetching]);

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
        <CardContent>
          <div className="space-x-2  rounded-md border-b-0 border-black bg-stone-100 px-1 py-2">
            <Button
              variant="outline"
              // className="border border-stone-600 hover:bg-black hover:text-white"
              className={`${
                showAnswerOnly ? " bg-transparent" : "bg-white"
              }   border-none hover:bg-black hover:text-white`}
              onClick={() => setShowAnswerOnly((prev) => !prev)}
            >
              {showAnswerOnly ? "Show All Options" : "Show Answer Only"}
            </Button>
            <Button
              variant="outline"
              className={`${
                isLoadAll ? " bg-white " : " bg-transparent"
              } hidden  border-none  hover:bg-black  hover:text-white lg:inline`}
              onClick={() => setIsLoadAll((prev) => !prev)}
            >
              {isLoadAll ? "Priotize First Loading" : "Enable Page Search"}
            </Button>
          </div>
        </CardContent>

        <CardHeader className="relative">
          {questions.length !== 0 &&
            !isLoadAll &&
            questions.map((q: QuestionType, index: number) => {
              // const [isFlagged, setIsFlagged] = useState(question.isFlagged);
              //console.log(JSON.stringify(note.questions));

              return (
                // <CardContent key={q.id}>
                <ReviewChoiceQuestion
                  key={q.id}
                  q={q}
                  index={index}
                  isSuperAdmin={isSuperAdmin}
                  showAnswerOnly={showAnswerOnly}
                  // setShowAnswerOnly={setShowAnswerOnly}
                />
              );
            })}

          {isFetching && hasMore && !isLoadAll && (
            <div className="flex w-full justify-center py-4 ">
              <Loader2
                // size={40}
                className="h-5 w-5 animate-spin text-teal-500 lg:h-10 lg:w-10"

                // className="absolute -bottom-2 left-[50%] -translate-x-[50%]"
              />
            </div>
          )}

          {isLoadAll &&
            note.questions.map((q: QuestionType, index: number) => {
              // const [isFlagged, setIsFlagged] = useState(question.isFlagged);
              //console.log(JSON.stringify(note.questions));
              return (
                // <CardContent key={q.id}>
                <ReviewChoiceQuestion
                  key={q.id}
                  q={q}
                  index={index}
                  isSuperAdmin={isSuperAdmin}
                  showAnswerOnly={showAnswerOnly}
                  // setShowAnswerOnly={setShowAnswerOnly}
                />
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
        {!hasMore && (
          <Button asChild className="absolute bottom-5 right-10">
            <Link href={`/${lang}/review`}>
              {lang == "fr" ? "Retour" : "Back"}
            </Link>
          </Button>
        )}
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
