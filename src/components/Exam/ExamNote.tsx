"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { useRouter } from "next/navigation";
import SetTimer from "./SetTimer";
import { NoteType } from "./ExamNoteQuestion";
import { Loader2 } from "lucide-react";
import { User } from "@clerk/nextjs/server";
// import { getUser } from "@/app/notes/_actions";
import Image from "next/image";
import { getUser } from "@/app/[locale]/notes/_actions";
import { useFormatter, useTranslations } from "next-intl";

export interface NoteProps {
  note: NoteType;
}

const ExamNote = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [user, setUser] = useState<User>();
  const format = useFormatter();
  const wasUpdated = note.updateAt > note.createdAt;
  const [isClient, setIsClient] = useState(false);
  const e = useTranslations("Exam");
  useEffect(() => {
    setIsClient(true);
  }, []);

  // const createdUpdatedAtTimestamp = (
  //   wasUpdated ? note.updateAt : note.createdAt
  // ).toDateString();

  const createdUpdatedAtTimestamp = wasUpdated ? note.updateAt : note.createdAt;

  // Using `format.dateTime` to format the date based on locale
  const formattedDate = format.dateTime(createdUpdatedAtTimestamp, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  const getUserObj = useCallback(async () => {
    const user = await getUser(note.userId);
    return user;
  }, [note.userId]);

  useEffect(() => {
    // Define an async function inside the useEffect to call getUserObj
    const fetchUser = async () => {
      const userObj = await getUserObj();
      if (userObj) {
        setUser(userObj);
      }
    };

    fetchUser();
  }, [getUserObj]);

  return (
    <>
      {isClient && (
        <Card
          className="relative cursor-pointer rounded-xl border-none bg-white shadow-gray-400  transition-shadow hover:shadow-gray-600 "
          onClick={() => setShowAddEditNoteDialog(true)}
        >
          <CardHeader className="relative h-32 ">
            <CardTitle className="scale-y-90  text-lg text-gray-800">
              {note.title}
            </CardTitle>
            <div
              className="absolute  -left-1 -right-1 top-14 w-[55%] rounded-l-sm rounded-br-sm  rounded-tr-lg bg-gradient-to-r from-red-500 to-transparent pl-6 text-sm text-white lg:w-[38%]"
              style={{
                clipPath: `polygon(100% 0%, 85% 48%, 100% 100%, 0.5% 100%, 0% 50%, 0.5% 0)`,
              }}
            >
              {/* {note.questions.length + " " + e("card.content.number")} */}
              {e("card.content.number", { count: note.questions.length })}
            </div>
          </CardHeader>

          <CardContent className=" h-14 rounded-b-xl bg-rose-500/5 px-6 py-2">
            <span className="absolute bottom-4 left-6 flex items-center space-x-2">
              {user && isClient ? (
                <Image
                  src={user.imageUrl}
                  alt="profile"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <Loader2
                  size={23}
                  className="animate-spin rounded-full border border-white bg-gray-100 text-rose-600"
                />
              )}
              <CardDescription className="text-xs">
                {/* {createdUpdatedAtTimestamp}
              {wasUpdated && "( updated )"} */}
                {user && user.firstName + " " + (user.lastName ?? "")}
              </CardDescription>
            </span>

            <CardDescription className="absolute bottom-4 right-6 text-xs ">
              {/* {createdUpdatedAtTimestamp} */}
              {formattedDate}
            </CardDescription>
          </CardContent>
        </Card>
      )}
      {isClient && (
        <SetTimer
          open={showAddEditNoteDialog}
          setOpen={setShowAddEditNoteDialog}
          questions={note.questions}
          noteToEdit={note}
        />
      )}
    </>
  );
};

export default ExamNote;
