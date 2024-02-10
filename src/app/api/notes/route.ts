import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

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

    const embedding = await getEmbeddingForNote(title, description);
    const note = await prisma.$transaction(async (tx) => {
      //mongodb transaction
      const note = await tx.note.create({
        data: {
          title,
          description,
          questions: {
            create: [] as Prisma.QuestionCreateInput[],
          },

          userId,
        },
      });
      //pinecone transaction execute pinecone second it will work for the purpose of transaction
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// export async function PUTReal(req: Request) {
//   try {
//     const body = await req.json();

//     // const parseResult = updateNoteSchema.safeParse(body);

//     // if (!parseResult.success) {
//     //   console.error(parseResult.error);
//     //   console.log(parseResult);
//     //   console.log("error parseResult is not success");
//     //   return Response.json({ error: "Invalid input" }, { status: 400 });
//     // }

//     // const { id, title, description, questions } = parseResult.data;
//     const { id, title, description, questions } = body;

//     // Fetch the existing note with its associated questions
//     const existingNote = await prisma.note.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         questions: {
//           // questionTitle: true,
//           include: {
//             choices: true,
//           },
//           // select: {
//           //   id: true, // Include the 'id' field in the result
//           // },
//         },
//       },
//     });

//     if (!existingNote) {
//       return Response.json({ error: "Note is not found" }, { status: 404 });
//     }

//     const { userId } = auth();
//     if (!userId || userId !== existingNote.userId) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     // Update the note's title
//     let updatedNote;
//     updatedNote = await prisma.note.update({
//       where: { id: existingNote.id },
//       data: {
//         title,
//         description,
//       },
//     });

//     // Update each question and its associated title and choices
//     if (questions) {
//       console.log("questions: " + JSON.stringify(questions));
//       for (const updatedQuestion of questions) {
//         const existingQuestion = existingNote.questions.find(
//           (q) => q.id === updatedQuestion.id,
//         );

//         if (existingQuestion) {
//           // Update the question title

//           await prisma.question.update({
//             where: {
//               id: existingQuestion?.id,
//             },
//             data: {
//               questionTitle: updatedQuestion.questionTitle,
//             },
//           });

//           // Update each choice
//           for (const updatedChoice of updatedQuestion.choices) {
//             const existingChoice = existingQuestion.choices.find(
//               (c) => c.id === updatedChoice.id,
//             );

//             if (existingChoice) {
//               await prisma.choice.update({
//                 where: {
//                   id: existingChoice.id,
//                 },
//                 data: {
//                   content: updatedChoice.content,
//                   answer: updatedChoice.answer,
//                 },
//               });
//             }
//           }
//         } else {
//           // console.log("question doesn't exist we have to create new question");
//           updatedNote = await prisma.note.update({
//             where: { id: existingNote.id },
//             data: {
//               title,
//               description,
//               questions: {
//                 create: [
//                   {
//                     questionTitle: questions[0].questionTitle,
//                     isFlagged: false,
//                     comment: "",
//                     choices: {
//                       create: questions[0].choices,
//                     },
//                   },
//                 ],
//               },

//               userId,
//             },
//           });

//           //this place
//         }
//       }
//     }

//     return Response.json({ updatedNote }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, questions } = body;

    const existingNote = await prisma.note.findUnique({
      where: { id },
      include: {
        questions: {
          include: { choices: true },
        },
      },
    });

    if (!existingNote) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== existingNote.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    let updatedNote;
    await prisma.$transaction(async (tx) => {
      // Update the note's title and description

      updatedNote = await tx.note.update({
        where: { id },
        data: { title, description },
      });

      // Assuming you have logic here to handle updates to questions and choices
      // This includes updating existing questions and choices, adding new ones, and deleting removed ones

      // After updates, fetch the updated note structure for embedding
      // Note: You might optimize this to avoid refetching if you can aggregate changes effectively
      if (questions) {
        for (const updatedQuestion of questions) {
          const existingQuestion = existingNote.questions.find(
            (q) => q.id === updatedQuestion.id,
          );

          if (existingQuestion) {
            // Update the question title

            await tx.question.update({
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
                await tx.choice.update({
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
            updatedNote = await tx.note.update({
              where: { id: existingNote.id },
              data: {
                title,
                description,
                questions: {
                  create: [
                    {
                      questionTitle: questions[0].questionTitle,
                      isFlagged: false,
                      comment: "",
                      choices: {
                        create: questions[0].choices,
                      },
                    },
                  ],
                },

                userId,
              },
            });
          }
        }
      }

      // Generate the updated embedding for the note including correct answers
      const updatedEmbedding = await getEmbeddingForNoteUpdating(id);

      // Update the vector search index with the new embedding
      // Replace `notesIndex.upsert` with the actual method you use to update the embedding in your search index
      await notesIndex.upsert([
        { id, values: updatedEmbedding, metadata: { userId } },
      ]);

      return updatedNote;
    });

    // try {
    //   // Generate the updated embedding for the note including correct answers
    //   const updatedEmbedding = await getEmbeddingForNoteUpdating(id);

    //   // Update the vector search index with the new embedding
    //   // Replace `notesIndex.upsert` with the actual method you use to update the embedding in your search index
    //   await notesIndex.upsert([{ id, values: updatedEmbedding }]);
    // } catch (error) {
    //   console.error("Failed to update vector embedding:", error);
    // }

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

    // Use Prisma transaction to handle cascading deletes
    // await prisma.$transaction([
    //   // Delete associated choices first
    //   prisma.choice.deleteMany({
    //     where: {
    //       question: {
    //         noteId: id,
    //       },
    //     },
    //   }),
    //   // Delete associated questions
    //   prisma.question.deleteMany({
    //     where: {
    //       noteId: id,
    //     },
    //   }),
    //   // Delete the note
    //   prisma.note.delete({
    //     where: {
    //       id,
    //       userId,
    //     },
    //   }),
    // ]);

    // Use Prisma transaction to handle cascading deletes
    await prisma.$transaction(async (tx) => {
      // Delete associated choices first
      await tx.choice.deleteMany({
        where: {
          question: {
            noteId: id,
          },
        },
      }),
        // Delete associated questions
        await tx.question.deleteMany({
          where: {
            noteId: id,
          },
        }),
        // Delete the note
        await tx.note.delete({
          where: {
            id,
            userId,
          },
        }),
        await notesIndex.deleteOne(id);
    });
    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(
  title: string,
  description: string | undefined,
) {
  return getEmbedding(title + "\n\n" + description ?? "");
}

async function getEmbeddingForNoteUpdating(noteId: string) {
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
    throw new Error("Note not found");
  }

  // If the note exists, proceed to generate the content string
  let noteContent = note.title + "\n\n" + note.description;

  note.questions.forEach((question) => {
    noteContent += "\n\n" + question.questionTitle;
    question.choices.forEach((choice) => {
      // Append a marker or modify the content to indicate the correct answer
      let choiceContent = choice.content;
      if (choice.answer) {
        // You can adjust this part to mark the choice in a way that suits your application
        choiceContent += " (Correct Answer)";
      }
      noteContent += "\n- " + choiceContent;
    });
  });

  // Generate embedding for the combined content
  return getEmbedding(noteContent);
}


