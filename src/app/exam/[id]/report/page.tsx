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
    noteId: string;
    choiceId: string;
    batch: string;
  };
}) => {
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
  //   console.log(mappedData);

  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  //   const note = await prisma.note.findUnique({ where: { id } });
  //   if (!note) throw Error("Note not found");

  const singleNoteWithDetails = await prisma.note.findUnique({
    where: {
      id: `${searchParams.noteId}`,
    },
    select: {
      id: true,
      title: true,
      description: true,
      questions: {
        include: {
          // questionTitle: true,
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
  });
  if (!singleNoteWithDetails) throw Error("Note Details not Found");
  // console.log(searchParams.batch);
  console.log("batch: " + searchParams.batch);
  // let newQuestions = singleNoteWithDetails.questions.slice(0, 60);
  // let newNote = { ...singleNoteWithDetails, questions: newQuestions };
  // Assume batch is the batch number you received.
  let newNote;
  const batchNumber = searchParams.batch;
  if (isNaN(Number(batchNumber))) {
    newNote = singleNoteWithDetails;
  } else {
    // For example, this would be passed into your function
    const batchSize = 60;
    const totalQuestions = singleNoteWithDetails.questions.length;

    // Calculate the start index of the questions for the current batch
    const start = Number(batchNumber) * batchSize;

    // Calculate the end index for the current batch.
    // If it's the last batch, the end index should be the length of the questions array.
    // Otherwise, it's the start index plus the batch size.
    let end =
      Number(batchNumber) + 2 === Math.ceil(totalQuestions / batchSize)
        ? totalQuestions
        : start + batchSize;

    // Slice the questions for the current batch
    let newQuestions = singleNoteWithDetails.questions.slice(start, end);

    // Create a new note with the batch's questions
    newNote = { ...singleNoteWithDetails, questions: newQuestions };
  }

  return (
    <div className=" grid gap-3" suppressHydrationWarning={true}>
      <ReportNoteQuestion note={newNote} mappedData={mappedData} />
    </div>
  );
};

export default page;
