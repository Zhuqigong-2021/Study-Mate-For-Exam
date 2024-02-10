import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React, { useState } from "react";
import prisma from "@/lib/db/prisma";

import FilterNote from "@/components/FilterNote";
import AIChatButton from "@/components/AIChatButton";
import { checkRole } from "../utils/roles/role";

export const metadata: Metadata = {
  title: "Study Mate - Notes",
};
const NotesPage = async () => {
  const { userId } = auth();
  const isAdmin = checkRole("admin");
  if (!userId) throw Error("userId undefined");

  console.log("my current userId :" + userId);
  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div>
      <FilterNote allNotes={allNotes} isAdmin={isAdmin} />
      <div className="absolute bottom-4 right-20">
        <AIChatButton />
      </div>
    </div>
  );
};

export default NotesPage;
