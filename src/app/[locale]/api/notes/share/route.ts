import prisma from "@/lib/db/prisma";
export async function PUT(req: Request) {
  try {
    const { noteId, isShared } = await req.json();
    // Attempt to fetch the note along with its questions and choices
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });

    // Check if the note was found
    if (!note) {
      // Handle the case where the note does not exist
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { isShared },
    });
    if (updatedNote) {
      return Response.json({ updatedNote }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
