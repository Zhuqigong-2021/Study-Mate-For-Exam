import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React, { useState } from "react";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FilterNote from "@/components/FilterNote";

export const metadata: Metadata = {
  title: "Study Mate - Notes",
};
const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div>
      <FilterNote allNotes={allNotes} />
    </div>
  );
};

export default NotesPage;
