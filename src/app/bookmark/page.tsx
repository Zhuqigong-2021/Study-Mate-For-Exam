import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db/prisma";

import BookMarkedQuestion from "@/components/BookMarkedQuestion";
import { checkRole } from "../utils/roles/role";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Study Mate - Exam",
};
const BookMarkPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const isAdmin = checkRole("admin");
  if (!isAdmin) redirect("/");
  // const allNotes = await prisma.note.findMany({ where: { userId } });
  const flaggedQuestions = await prisma.question.findMany({
    where: {
      note: {
        userId: userId, // This assumes that the Note model has a userId field
      }, // Assuming direct relation to userId or use note: { userId } for indirect relation
      isFlagged: true,
    },
    select: {
      id: true, // Assuming you might need the ID as well
      questionTitle: true,
      comment: true,
      isFlagged: true, // Include if needed
      noteId: true,
      note: {
        select: {
          id: true, // Include fields from Note you're interested in
          title: true,
          createdAt: true,
          updateAt: true, // Adjust field names as per your Note model
          // Any other fields from Note you need
        },
      },
      choices: {
        select: {
          id: true,
          content: true,
          answer: true,
          // Include other fields from Choice you're interested in
        },
      },
    },
  });
  return (
    <div className="grid     gap-3  sm:grid-cols-2 lg:grid-cols-3">
      {flaggedQuestions.map((question) => (
        <BookMarkedQuestion question={question} key={question.id} />
      ))}
      {flaggedQuestions.length === 0 && (
        <div className="col-span-full text-center">
          {"You have no bookmarked questions yet"}
        </div>
      )}
    </div>
  );
};

export default BookMarkPage;

// export async function getServerSideProps() {
//   const userId = auth();

//   if (!userId) {
//     return {
//       redirect: {
//         destination: "/sign-in", // Adjust the sign-in route as necessary
//         permanent: false,
//       },
//     };
//   }

//   const flaggedQuestions = await prisma.question.findMany({
//     where: {
//       // note: {
//       //   userId,
//       // },
//       isFlagged: true,
//     },
//     select: {
//       id: true,
//       questionTitle: true,
//       comment: true,
//       isFlagged: true,
//       note: {
//         select: {
//           id: true,
//           title: true,
//           createdAt: true,
//           updateAt: true,
//         },
//       },
//       choices: {
//         select: {
//           id: true,
//           content: true,
//           answer: true,
//         },
//       },
//     },
//   });

//   return {
//     props: {
//       flaggedQuestions,
//     },
//   };
// }
