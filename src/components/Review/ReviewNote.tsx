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
import SetTimer from "../Exam/SetTimer";
import { Loader2 } from "lucide-react";
// import { getUser } from "@/app/notes/_actions";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import { Button } from "../ui/button";
import { getUser } from "@/app/[locale]/notes/_actions";
import { useFormatter, useTranslations } from "next-intl";

export interface NoteProps {
  note: {
    userId: string;
    id: string;
    title: string;
    description: string;
    questions: {
      id: string;
      questionTitle: string;
      noteId: string;
      isFlagged: boolean;
      comment: string;
      choices: {
        id: string;
        content: string;
        answer: boolean;
      }[];
    }[];
    isShared: boolean;
    createdAt: Date;
    updateAt: Date;
  };
}

const ReviewNote = ({ note }: NoteProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [isClient, setIsClient] = useState(false);
  const r = useTranslations("Review");
  const format = useFormatter();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const wasUpdated = note.updateAt > note.createdAt;
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
  }, [note.userId]); // Dependencies array, re-create getUserObj only when note.userId changes

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
          className="relative cursor-pointer   rounded-xl border-none bg-white shadow-gray-400  transition-all duration-700   ease-in-out hover:shadow-gray-600  dark:bg-background dark:shadow-teal-500 dark:hover:shadow-md dark:hover:shadow-teal-200"
          onClick={() => router.push(`/review/${note.id}`)}
        >
          <CardHeader className="relative h-32 ">
            <CardTitle className="scale-y-90  text-lg text-gray-800 dark:text-foreground">
              {note.title}
            </CardTitle>

            <div
              className="absolute  -left-1 -right-1 top-14 w-[55%] rounded-l-sm rounded-br-sm  rounded-tr-lg bg-gradient-to-r from-teal-500 to-transparent pl-6 text-sm text-white lg:w-[36%]"
              style={{
                clipPath: `polygon(100% 0%, 85% 48%, 100% 100%, 0.5% 100%, 0% 50%, 0.5% 0)`,
              }}
            >
              {/* {note.questions.length + " " + r("card.content.number")} */}
              {r("card.content.number", { count: note.questions.length })}
            </div>
          </CardHeader>

          <CardContent className=" h-14 rounded-b-xl bg-teal-500/5 px-6 py-2">
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
                  className="animate-spin rounded-full border border-white bg-gray-100 text-teal-600 dark:border-none dark:bg-transparent dark:text-teal-300"
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
              {/* {wasUpdated && "( updated )"} */}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ReviewNote;

interface localeType {
  locale: string;
}
export function getStaticProps({ locale }: localeType) {
  return {
    props: {
      messages: {
        ...require(`../../../messages/${locale}.json`),
      },
    },
  };
}
