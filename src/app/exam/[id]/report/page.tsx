import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import React from "react";

import ReportNoteQuestion from "@/components/ReportNoteQuestion";
export interface idProps {
  params: { id: string };
}
// { params }: idProps
const page = async ({
  searchParams,
}: {
  searchParams: {
    id: string;
    choiceId: string;
  };
}) => {
  // const { id } = params;
  let id = searchParams.id;

  let data =
    searchParams.choiceId != "undefined"
      ? JSON.parse(searchParams.choiceId)
      : [];

  let mappedData: any[];
  if (data.length != 0) {
    mappedData = Object.keys(data).map((questionId) => ({
      questionId,
      selectedChoices: data[questionId],
    }));
  } else {
    mappedData = [];
  }
  console.log(mappedData);

  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  //   const note = await prisma.note.findUnique({ where: { id } });
  //   if (!note) throw Error("Note not found");

  //   const singleNoteWithDetails = await prisma.note.findUnique({
  //     where: {
  //       id: `${searchParams.id}`,
  //     },
  //     select: {
  //       id: true,
  //       title: true,
  //       description: true,
  //       questions: {
  //         include: {
  //           // questionTitle: true,
  //           choices: {
  //             select: {
  //               id: true,
  //               content: true,
  //               answer: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   if (!singleNoteWithDetails) throw Error("Note Details not Found");
  return (
    <div className=" grid gap-3" suppressHydrationWarning={true}>
      {/* <ReportNoteQuestion
        note={singleNoteWithDetails}
        mappedData={mappedData}
      /> */}
      <p>{"id:" + searchParams.id}</p>
      <p>{"choiceId: " + searchParams.choiceId}</p>
    </div>
  );
};

export default page;
