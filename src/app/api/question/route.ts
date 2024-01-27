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
      return { success: false, message: "Choice not found" };
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

    return Response.json({
      success: true,
      message: "Question and associated choices deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: true,
      message: "Internal server error",
    });
  }
}
