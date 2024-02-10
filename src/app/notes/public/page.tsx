import AIChatButton from "@/components/AIChatButton";
import FilterNote from "@/components/FilterNote";
import { auth } from "@clerk/nextjs";
import React from "react";
import prisma from "@/lib/db/prisma";
import { checkRole } from "@/app/utils/roles/role";
const page = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({ where: { isShared: true } });
  const isAdmin = checkRole("admin");
  return (
    <div>
      <FilterNote allNotes={allNotes} isAdmin={isAdmin} />
      <div className="absolute bottom-4 right-20">
        <AIChatButton />
      </div>
    </div>
  );
};

export default page;
