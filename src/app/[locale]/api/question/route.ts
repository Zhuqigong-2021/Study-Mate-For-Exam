import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { ChoiceSchema } from "@/lib/validation/note";

export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId } = body;

    // Find the question to be deleted
    const existingQuestion = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        choices: true,
        note: true, // Assuming the Note is related to the Question
      },
    });

    if (!existingQuestion) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    // Use Prisma transaction to handle cascading deletes
    await prisma.$transaction([
      // Delete associated choices first
      prisma.choice.deleteMany({
        where: {
          questionId: questionId,
        },
      }),
      // Delete the question
      prisma.question.delete({
        where: {
          id: questionId,
        },
        include: {
          choices: true,
        },
      }),
    ]);

    return Response.json(
      { message: "successfully delete a  question" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { questionId, isFlagged } = await req.json();

    if (typeof isFlagged !== "boolean") {
      return Response.json(
        { error: "the flag is not boolean type" },
        { status: 400 },
      );
    }
    if (!questionId)
      return Response.json(
        { error: "there is no questionId" },
        { status: 400 },
      );

    const updateQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { isFlagged },
    });
    if (updateQuestion) {
      return Response.json({ updateQuestion }, { status: 200 });
    }
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { questionId, questionTitle, choices, comment } = await req.json();
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!existingQuestion) {
      return Response.json({ error: "Question not Found" }, { status: 404 });
    }
    const updateData = {
      questionTitle,
      comment,
      choices: {
        // Assuming 'choices' is a related field and requires a nested update
        upsert: choices.map((choice: ChoiceSchema) => ({
          where: { id: choice.id || undefined },
          update: { content: choice.content, answer: choice.answer },
          create: { content: choice.content, answer: choice.answer },
        })),
      },
    };
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      // data: { questionTitle, choices, comment },
      data: updateData,
    });
    if (updatedQuestion) {
      return Response.json(
        { message: "successfully updated  the question" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
