import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

// export default async function handler(req: Request) {
//   if (req.method !== "GET") {
//     return Response.json({ message: "Method Not Allowed" }, { status: 405 });
//   }

//   const { noteId } = req.query;

//   try {
//     // Fetch the note and related questions and choices
//     const noteData = await prisma.note.findUnique({
//       where: { id: noteId },
//       include: {
//         questions: {
//           include: {
//             choices: true,
//           },
//         },
//       },
//     });

//     if (!noteData) {
//       return Response.json({ message: "Note not found" });
//     }

//     return Response.json(noteData);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { title, description, questions } = parseResult.data;
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        description,
        questions: {
          create: [] as Prisma.QuestionCreateInput[],
        },

        userId,
      },
    });
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// const updateNoteWithQuestions = async (noteId: string) => {
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // const parseResult = updateNoteSchema.safeParse(body);

    // if (!parseResult.success) {
    //   console.error(parseResult.error);
    //   console.log(parseResult);
    //   console.log("error parseResult is not success");
    //   return Response.json({ error: "Invalid input" }, { status: 400 });
    // }

    // const { id, title, description, questions } = parseResult.data;
    const { id, title, description, questions } = body;
    // console.log(id, title, description, questions);
    // console.log("id:" + id);
    // Fetch the existing note with its associated questions
    const existingNote = await prisma.note.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          // questionTitle: true,
          include: {
            choices: true,
          },
          // select: {
          //   id: true, // Include the 'id' field in the result
          // },
        },
      },
    });

    if (!existingNote) {
      return Response.json({ error: "Note is not found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== existingNote.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Update the note's title
    let updatedNote;
    updatedNote = await prisma.note.update({
      where: { id: existingNote.id },
      data: {
        title,
        description,
      },
    });

    // Update each question and its associated title and choices
    if (questions) {
      console.log("questions: " + JSON.stringify(questions));
      for (const updatedQuestion of questions) {
        const existingQuestion = existingNote.questions.find(
          (q) => q.id === updatedQuestion.id,
        );

        if (existingQuestion) {
          // Update the question title

          await prisma.question.update({
            where: {
              id: existingQuestion?.id,
            },
            data: {
              questionTitle: updatedQuestion.questionTitle,
            },
          });

          // Update each choice
          for (const updatedChoice of updatedQuestion.choices) {
            const existingChoice = existingQuestion.choices.find(
              (c) => c.id === updatedChoice.id,
            );

            if (existingChoice) {
              await prisma.choice.update({
                where: {
                  id: existingChoice.id,
                },
                data: {
                  content: updatedChoice.content,
                  answer: updatedChoice.answer,
                },
              });
            }
          }
        } else {
          // console.log("question doesn't exist we have to create new question");
          updatedNote = await prisma.note.update({
            where: { id: existingNote.id },
            data: {
              title,
              description,
              questions: {
                create: [
                  {
                    questionTitle: questions[0].questionTitle,

                    choices: {
                      create: questions[0].choices,
                    },
                  },
                ],
              },

              userId,
            },
          });

          //this place
        }
      }
    }

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // await prisma.note.delete({
    //   where: { id },
    //   include: {
    //     questions: {
    //       include: {
    //         choices: true,
    //       },
    //     },
    //   },
    // });

    // Use Prisma transaction to handle cascading deletes
    await prisma.$transaction([
      // Delete associated choices first
      prisma.choice.deleteMany({
        where: {
          question: {
            noteId: id,
          },
        },
      }),
      // Delete associated questions
      prisma.question.deleteMany({
        where: {
          noteId: id,
        },
      }),
      // Delete the note
      prisma.note.delete({
        where: {
          id,
          userId,
        },
      }),
    ]);
    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
