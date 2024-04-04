import AIChatButton from "@/components/AIChatButton";
import FilterNote from "@/components/FilterNote";
import { auth } from "@clerk/nextjs";
import React from "react";
import prisma from "@/lib/db/prisma";
import { checkRole } from "@/app/utils/roles/role";
const page = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({});
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
