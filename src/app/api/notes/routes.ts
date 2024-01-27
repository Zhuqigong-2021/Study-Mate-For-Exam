import { createNoteSchema, deleteNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import React from "react";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.log(parseResult.error);
      return Response.json({ message: "invalide input" }, { status: 400 });
    }
    const { userId } = auth();
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { title, description, questions } = parseResult.data;
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

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, title, description, questions } = body;
  const { userId } = auth();
  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const existingNote = await prisma.note.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          choices: true,
        },
      },
    },
  });
  if (!existingNote) {
    return Response.json({ message: "Not Found" }, { status: 404 });
  }
  let updateNote;
  updateNote = await prisma.note.update({
    where: { id: existingNote.id },
    data: {
      title,
      description,
    },
  });

  if (questions) {
    for (const updateQuestion of questions) {
      const existingQuestion = existingNote.questions.find(
        (q) => q.id === updateQuestion.id,
      );
      if (existingQuestion) {
        await prisma.question.update({
          where: { id: existingQuestion.id },
          data: {
            questionTitle: existingQuestion.questionTitle,
          },
        });
        for (const updatedChoice of existingQuestion.choices) {
          const existingChoice = existingQuestion.choices.find(
            (c) => c.id === updatedChoice.id,
          );
          if (existingChoice) {
            await prisma.choice.update({
              where: { id: existingChoice.id },
              data: {
                content: existingChoice.content,
                answer: existingChoice.answer,
              },
            });
          }
        }
      } else {
        updateNote = await prisma.note.update({
          where: { id: existingNote.id },
          data: {
            title,
            description,
            questions: {
              create: [
                {
                  questionTitle: questions[0].questionTitle,
                },
              ],
            },
            userId,
          },
        });
      }
    }
  }

  return Response.json({ updateNote }, { status: 200 });
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
    await prisma.$transaction([
      prisma.choice.deleteMany({
        where: {
          question: {
            noteId: id,
          },
        },
      }),

      prisma.question.deleteMany({
        where: { noteId: id },
      }),
      prisma.note.delete({
        where: { id, userId },
      }),
    ]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
