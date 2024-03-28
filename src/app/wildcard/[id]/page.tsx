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
  });

  return (
    <div className="  w-full gap-3  " suppressHydrationWarning={true}>
      <Card
        className="relative flex  cursor-pointer flex-col items-center justify-center text-center transition-shadow hover:shadow-lg"
        suppressHydrationWarning={true}
      >
        <CardHeader>
          <CardTitle className="text-3xl font-black">{note?.title}</CardTitle>

          <CardDescription className="flex flex-wrap ">
            {note?.description}
          </CardDescription>
        </CardHeader>

        <Carousel className="flex min-h-[400px]  w-full max-w-[800px]  ">
          <CarouselContent>
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
                  <div className="w-full ">
                    <Card className="min-h-[350px] p-4">
                      <CardTitle className=" my-8  text-[22px] capitalize">
                        {q.questionTitle}
                      </CardTitle>

                      {choices.map((c, index) => {
                        let choiceLetter = String.fromCharCode(65 + index);

                        let answer = c.answer;
                        console.log(c.answer);
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
                  </div>
                </CarouselItem>
              );
            })}
            {allQuestions.length == 0 && (
              <Card className="flex min-h-[100px] w-full items-center justify-center border-none text-center">
                <CardTitle>You have no questions in this note</CardTitle>
              </Card>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-5 top-[20%]" />
          <CarouselNext className="absolute -right-5 top-[20%]" />
        </Carousel>

        {/* <CardFooter className="py-10"></CardFooter> */}

        <Button asChild className="absolute bottom-2 right-2">
          <Link href="/notes">Back</Link>
        </Button>
      </Card>
    </div>
  );
};

export default page;
