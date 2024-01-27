import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

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

    // Check user authorization or any other conditions
    // Add your authorization logic here

    // Delete the question and its associated choices
    // Delete the associated choices

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
    // await prisma.choice.deleteMany({
    //   where: {
    //     questionId: questionId,
    //   },
    // });
    // await prisma.question.delete({
    //   where: {
    //     id: questionId,
    //   },
    //   include: {
    //     choices: true,
    //   },
    // });

    return Response.json(
      { message: "successfully delete a  question" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
