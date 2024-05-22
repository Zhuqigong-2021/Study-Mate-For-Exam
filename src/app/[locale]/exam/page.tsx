import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note/Note";
import ExamNote from "@/components/Exam/ExamNote";
import { SkeletonCard } from "@/components/SkeletonCard";
import ExamWrapper from "@/components/Exam/ExamWrapper";
import { checkRole } from "../utils/roles/role";
import { getTranslations } from "next-intl/server";

// export const metadata: Metadata = {
//   title: "Study Mate - Exam",
// };

interface Params {
  locale: string;
}

interface Context {
  params: Params;
}

export async function generateMetadata({ params: { locale } }: Context) {
  const t = await getTranslations({ locale, namespace: "Exam" });

  return {
    title: t("metadata"),
  };
}
const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  // const allNotes = await prisma.note.findMany({ where: { userId } });

  // const isAdmin = checkRole("admin");
  // if (!isAdmin) redirect("/");

  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  let allNotes;
  if (isSuperAdmin) {
    allNotes = allNotes = await prisma.note.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        isShared: true,
        updateAt: true,
        createdAt: true,
        userId: true,
        questions: {
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
        },
      },
    });
  } else {
    allNotes = await prisma.note.findMany({
      where: { isShared: true },
      select: {
        id: true,
        title: true,
        description: true,
        isShared: true,
        updateAt: true,
        createdAt: true,
        userId: true,
        questions: {
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
        },
      },
    });
  }

  return (
    <div>
      <ExamWrapper
        allNotes={allNotes}
        // isAdmin={isAdmin}
        // isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default NotesPage;
