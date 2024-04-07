import { auth } from "@clerk/nextjs";
import React, { Fragment } from "react";
import prisma from "@/lib/db/prisma";

import UpdateEditQuestions from "@/components/UpdateEditQuestions";
import { redirect } from "next/dist/server/api-utils";
import { checkRole } from "@/app/utils/roles/role";

const page = async () => {
  const { userId } = auth();
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  const isAdmin = checkRole("admin");
  if (!userId) throw Error("userId undefined");

  const AllQuestions = await prisma.question.findMany({
    select: {
      id: true, // Assuming you might need the ID as well
      questionTitle: true,
      comment: true,
      isFlagged: true,
      noteId: true,
      note: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updateAt: true,
        },
      },
      choices: {
        select: {
          id: true,
          content: true,
          answer: true,
        },
      },
    },
  });
  return (
    <div className="w-full max-w-[84rem]" suppressHydrationWarning={true}>
      {/* <EditNote note={singleNoteWithDetails} /> */}
      <UpdateEditQuestions
        flaggedQuestions={AllQuestions}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default page;
