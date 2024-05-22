import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { choiceId } = body;

    // Find the choice to be deleted
    const existingChoice = await prisma.choice.findUnique({
      where: {
        id: choiceId,
      },
      include: {
        question: {
          include: {
            note: true, // Assuming the Note is related to the Question
          },
        },
      },
    });
    if (!existingChoice) {
      return Response.json({ error: "Choice not found" }, { status: 404 });
    }
    // Check user authorization or any other conditions
    // Add your authorization logic here
    // Delete the choice
    await prisma.choice.delete({
      where: {
        id: choiceId,
      },
    });
    // Update any related entities as needed
    // For example, you might want to update the note or question
    // Return success
    return Response.json({ message: "choice deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
