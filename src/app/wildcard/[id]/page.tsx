import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { idProps } from "@/app/notes/[id]/page";

const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const note = await prisma.note.findUnique({ where: { id } });
  const allQuestions = await prisma.question.findMany({
    where: { noteId: id },

    select: {
      id: true,
      questionTitle: true,
      isFlagged: true,
      comment: true,
      noteId: true,
      choices: {
        select: {
          id: true,
          content: true,
          answer: true,
        },
      },
    },
  });

  return (
    <div className="w-full gap-3  " suppressHydrationWarning={true}>
      <Card
        className="relative flex  cursor-pointer flex-col items-center justify-center text-center transition-shadow hover:shadow-lg"
        suppressHydrationWarning={true}
      >
        <CardHeader>
          <CardTitle className="text-3xl font-black">{note?.title}</CardTitle>

          <CardDescription>{note?.description}</CardDescription>
        </CardHeader>
        <Carousel className="flex min-h-[400px] w-full max-w-[800px] flex-col p-2">
          <CarouselContent>
            {allQuestions.map((q, index) => {
              let questionPage =
                allQuestions.length == 1 ? "question" : "questions";
              return (
                <CarouselItem
                  key={index}
                  className="flex flex-col items-center   "
                >
                  <div>
                    {index +
                      1 +
                      "/" +
                      allQuestions.length +
                      "  " +
                      questionPage}
                  </div>
                  <Card className=" min-h-[350px] w-full  p-4">
                    <CardTitle className=" my-8  pl-4 text-start text-[18px] capitalize lg:pl-0 lg:text-center  lg:text-[22px] ">
                      {q.questionTitle}
                    </CardTitle>

                    {allQuestions[index].choices.map((c, index) => {
                      let choiceLetter = String.fromCharCode(65 + index);

                      let answer = c.answer;

                      return (
                        <CardContent
                          key={c.id}
                          className={`border-grey-600 relative my-2 flex min-h-[40px] items-center rounded-md border py-2  text-left hover:shadow-lg ${
                            answer ? "hover:bg-green-50" : "hover:bg-red-100"
                          }`}
                        >
                          <span>
                            {choiceLetter + "."} &nbsp;&nbsp;
                            {c.content}
                          </span>
                        </CardContent>
                      );
                    })}
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="absolute -left-3 top-[20%] z-10" />
          <CarouselNext className="absolute -right-3 top-[20%]" />
        </Carousel>

        <CardFooter className="py-10"></CardFooter>

        <Button asChild className="absolute bottom-2 right-2">
          <Link href="/notes">Back</Link>
        </Button>
      </Card>
    </div>
  );
};

export default page;
{
  /* <CarouselContent>
            {allQuestions.map(async (q, index) => {
              const choices = await prisma.choice.findMany({
                where: { questionId: q.id },
              });
              let questionPage =
                allQuestions.length == 1 ? "question" : "questions";
              return (
                <CarouselItem key={index}>
                  <div>
                    {index +
                      1 +
                      "/" +
                      allQuestions.length +
                      "  " +
                      questionPage}
                  </div>
                  <Card className=" min-h-[350px] w-full p-4">
                    <CardTitle className=" my-8   text-[22px] capitalize">
                      {q.questionTitle}
                    </CardTitle>

                    {choices.map((c, index) => {
                      let choiceLetter = String.fromCharCode(65 + index);

                      let answer = c.answer;

                      return (
                        <CardContent
                          key={c.id}
                          className={`border-grey-600 relative my-2 flex min-h-[40px] items-center rounded-md border py-2  text-left hover:shadow-lg ${
                            answer ? "hover:bg-green-50" : "hover:bg-red-100"
                          }`}
                        >
                          <span>
                            {choiceLetter + "."} &nbsp;&nbsp;
                            {c.content}
                          </span>
                        </CardContent>
                      );
                    })}
                  </Card>

                  <Card className="min-h-[350px] w-full p-4">
                    <CardTitle className=" my-8   text-[22px] capitalize">
                      {q.questionTitle}
                    </CardTitle>

                    {choices.map((c, index) => {
                      let choiceLetter = String.fromCharCode(65 + index);

                      let answer = c.answer;

                      return (
                        <CardContent
                          key={c.id}
                          className={`border-grey-600 relative my-2 flex min-h-[40px] items-center rounded-md border py-2  text-left hover:shadow-lg ${
                            answer ? "hover:bg-green-50" : "hover:bg-red-100"
                          }`}
                        >
                          <span>
                            {choiceLetter + "."} &nbsp;&nbsp;
                            {c.content}
                          </span>
                        </CardContent>
                      );
                    })}
                  </Card>
                </CarouselItem>
              );
            })}
            {allQuestions.length == 0 && (
              <Card className="flex min-h-[100px] w-full items-center justify-center border-none text-center">
                <CardTitle>You have no questions in this note</CardTitle>
              </Card>
            )}
          </CarouselContent> */
}
