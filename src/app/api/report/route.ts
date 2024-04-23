import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      noteId,
      result,
      noteTitle,
      userName,
      choiceId,
      userEmail,
      time,
      batch,
      submittedAt,
      reportListId,
    } = await req.json();
    let reportList;

    // Check if a reportListId is provided and if it exists
    if (reportListId) {
      reportList = await prisma.reportList.findUnique({
        where: { id: reportListId },
      });
      // If a reportListId was provided but the reportList doesn't exist, return an error
      if (!reportList) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // If no reportListId is provided or the reportList doesn't exist, create a new ReportList
    if (!reportListId || !reportList) {
      reportList = await prisma.reportList.create({
        data: {
          // You might want to add other fields here if necessary
        },
      });
    }

    // Now that we have a reportList, create a report and link it to the reportList
    const report = await prisma.report.create({
      data: {
        noteId,
        result,
        choiceId, // Assuming this is a valid JSON object
        batch,
        time,
        userId,
        userName,
        userEmail,
        noteTitle,
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(), // Use provided submittedAt or the current date
        reportListId: reportList.id, // Link the report to the reportList
      },
    });
    return Response.json({ reportList }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { reportId } = await req.json();

    // Check if a reportListId is provided and if it exists

    let reportFound = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!reportFound) {
      return Response.json({ error: "Report Not Found" }, { status: 404 });
    }

    // delete this report
    await prisma.report.delete({
      where: { id: reportId },
    });

    return Response.json(
      { message: "Report is deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
