import { auth, useClerk } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React, { useState } from "react";
import prisma from "@/lib/db/prisma";

import FilterNote from "@/components/Note/FilterNote";
import AIChatButton from "@/components/AIChatButton";
import { checkMetaDataRole, checkRole } from "../utils/roles/role";

export const metadata: Metadata = {
  title: "Study Mate - My Notes",
};
const NotesPage = async () => {
  const { userId } = auth();
  // const isAdmin = checkRole("admin");
  const isAdmin = await checkMetaDataRole("admin");
  if (!userId) throw Error("userId undefined");

  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const allNotes = await prisma.note.findMany({
    where: { userId },
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
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  const user = await currentUser();
  let banned = false;
  if (user) {
    if (user.privateMetadata.banned && user.privateMetadata.banned == true) {
      banned = true;
    }
  }
  return (
    <>
      <FilterNote
        allNotes={allNotes}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
        banned={banned}
      />

      <div className="fixed bottom-4 right-4  lg:right-20 ">
        {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && <AIChatButton />}
      </div>
    </>
  );
};

export default NotesPage;
