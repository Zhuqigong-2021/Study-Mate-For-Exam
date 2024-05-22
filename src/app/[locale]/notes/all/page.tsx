import AIChatButton from "@/components/AIChatButton";
import FilterNote from "@/components/Note/FilterNote";
import { auth } from "@clerk/nextjs";
import React from "react";
import prisma from "@/lib/db/prisma";

import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { checkRole } from "../../utils/roles/role";
import { getTranslations } from "next-intl/server";
// export const metadata: Metadata = {
//   title: "Study Mate - All Notes",
// };

interface Params {
  locale: string;
}

interface Context {
  params: Params;
}

export async function generateMetadata({ params: { locale } }: Context) {
  const t = await getTranslations({ locale, namespace: "Homepage" });

  return {
    title: t("metaData.all"),
  };
}
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

  const user = await currentUser();
  let banned = false;
  if (user) {
    if (user.privateMetadata.banned && user.privateMetadata.banned == true) {
      banned = true;
    }
  }

  const isAdmin = checkRole("admin");
  const isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  return (
    <div>
      <FilterNote
        allNotes={allNotes}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
        banned={banned}
      />
      <div className="fixed bottom-4 right-4  lg:right-20 ">
        {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && <AIChatButton />}
      </div>
    </div>
  );
};

export default page;
