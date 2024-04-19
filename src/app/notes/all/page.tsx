import AIChatButton from "@/components/AIChatButton";
import FilterNote from "@/components/Note/FilterNote";
import { auth } from "@clerk/nextjs";
import React from "react";
import prisma from "@/lib/db/prisma";
import { checkRole } from "@/app/utils/roles/role";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Study Mate - All Notes",
};
const page = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  // const allNotes = await prisma.note.findMany({});
  const allNotes = await prisma.note.findMany({
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

  const isAdmin = checkRole("admin");
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  return (
    <div>
      <FilterNote
        allNotes={allNotes}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
      />
      <div className="fixed bottom-4 right-4  lg:right-20 ">
        {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && <AIChatButton />}
      </div>
    </div>
  );
};

export default page;
