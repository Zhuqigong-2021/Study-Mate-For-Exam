import prisma from "@/lib/db/prisma";
// import type { NextApiRequest, NextApiResponse } from "next";

import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  const url = new URL(req.url ?? "");

  const page = url.searchParams.get("page");
  const pageSize = url.searchParams.get("pageSize");
  const noteId = url.searchParams.get("noteId");
  //   const page = parseInt(req.query.page) || 1;
  //   const pageSize = parseInt(req.query.pageSize) || 10;

  const questions = await prisma.question.findMany({
    where: { noteId: noteId ?? "" }, // Make sure to pass the noteId
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
    select: {
      id: true,
      questionTitle: true,
      isFlagged: true,
      comment: true,
      noteId: true,
      choices: {
        select: {
          id: true,
          content: true,
          answer: true,
        },
      },
    },
    // ...other select fields
  });

  // Return the questions as JSON

  return Response.json({ questions }, { status: 200 });
}
