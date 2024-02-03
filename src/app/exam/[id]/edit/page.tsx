import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";

import { idProps } from "../page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";
import EditNote from "@/components/EditNote";

const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw Error("Note not found");
  const allQuestions = await prisma.question.findMany({
    where: { noteId: id },
  });

  const singleNoteWithDetails = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      questions: {
        select: {
          id: true,
          questionTitle: true,
          comment: true,
          isFlagged: true,
          choices: {
            select: {
              id: true,
              content: true,
              answer: true,
            },
          },
        },
      },
    },

    // include: {
    //   questions: {
    //     include: {
    //       // questionTitle: true,
    //       choices: {
    //         select: {
    //           content: true,
    //           answer: true,
    //         },
    //       },
    //     },
    //   },
    // },
  });
  if (!singleNoteWithDetails) throw Error("Note Details not Found");
  return (
    <div className=" grid gap-3" suppressHydrationWarning={true}>
      {
        // <Card
        //   className="relative cursor-pointer transition-shadow hover:shadow-lg"
        //   suppressHydrationWarning={true}
        // >
        //   <CardHeader>
        //     <CardTitle className="text-3xl font-black">{note?.title}</CardTitle>

        //     <CardDescription className="flex flex-wrap ">
        //       {note?.description}
        //     </CardDescription>
        //   </CardHeader>
        //   <CardContent>
        //     {allQuestions.map(async (q) => {
        //       const choices = await prisma.choice.findMany({
        //         where: { questionId: q.id },
        //       });
        //       return (
        //         <Fragment key={q.id}>
        //           <CardContent className="my-4">
        //             <CardTitle className="mb-4 text-[22px] capitalize">
        //               {q.questionTitle}
        //             </CardTitle>
        //             {choices.map((c, index) => {
        //               let choiceLetter =
        //                 index === 0
        //                   ? "A"
        //                   : index === 1
        //                     ? "B"
        //                     : index === 2
        //                       ? "C"
        //                       : index === 3
        //                         ? "D"
        //                         : index === 4
        //                           ? "E"
        //                           : index === 5
        //                             ? "F"
        //                             : index === 6
        //                               ? "G"
        //                               : "H";
        //               let answer = c.answer;
        //               console.log(c.answer);
        //               return (
        //                 <CardContent
        //                   key={c.id}
        //                   className={`border-grey-600 relative my-2 flex h-[40px] items-center rounded-md border  text-left hover:shadow-lg ${
        //                     answer ? "hover:bg-green-50" : "hover:bg-red-100"
        //                   }`}
        //                 >
        //                   <span className="absolute top-[50%] -translate-y-[50%]">
        //                     {choiceLetter + "."} &nbsp;&nbsp;
        //                     {c.content}
        //                   </span>
        //                 </CardContent>
        //               );
        //             })}
        //           </CardContent>
        //         </Fragment>
        //       );
        //     })}

        //     {/* <CardDescription>
        //     {createdUpdatedAtTimestamp}
        //     {wasUpdated && "( updated )"}
        //   </CardDescription> */}
        //   </CardContent>
        //   <CardFooter className="py-4"></CardFooter>

        //   <Button asChild className="absolute bottom-2 right-2">
        //     <Link href="/notes">Back</Link>
        //   </Button>
        // </Card>
        <EditNote note={singleNoteWithDetails} />
      }
    </div>
  );
};

export default page;
