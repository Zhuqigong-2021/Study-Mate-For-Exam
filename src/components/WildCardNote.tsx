"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { useRouter } from "next/navigation";

import { getUser } from "@/app/notes/_actions";
import { User } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface NoteProps {
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

const WildCardNote = ({ note }: NoteProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const wasUpdated = note.updateAt > note.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createdAt
  ).toDateString();
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
        console.log(userObj);
      }
    };

    fetchUser();
  }, [getUserObj]);
  return (
    <>
      <Card
        className="relative cursor-pointer rounded-xl  shadow-gray-300  transition-shadow hover:shadow-gray-600 "
        onClick={() => router.push(`/wildcard/${note.id}`)}
        // onClick={() => setShowAddEditNoteDialog(true)}
      >
        {/* <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && "( updated )"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent> */}
        <CardHeader className="relative h-32 ">
          <CardTitle className="scale-y-90  text-lg text-gray-800">
            {note.title}
          </CardTitle>
          <div
            className="absolute  -left-1 -right-1 top-14 w-1/4 rounded-l-sm rounded-br-sm  rounded-tr-lg bg-gradient-to-r from-black to-transparent pl-6 text-sm text-white lg:w-1/3"
            style={{
              clipPath: `polygon(100% 0%, 85% 48%, 100% 100%, 0.5% 100%, 0% 50%, 0.5% 0)`,
            }}
          >
            {note.questions.length + " " + "items"}
          </div>
        </CardHeader>

        <CardContent className=" h-14 rounded-b-xl bg-stone-500/5 px-6 py-2">
          <span className="absolute bottom-4 left-6 flex items-center space-x-2">
            {user ? (
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
                className="animate-spin rounded-full border border-white bg-gray-100 text-gray-600"
              />
            )}
            <CardDescription className="text-xs">
              {/* {createdUpdatedAtTimestamp}
              {wasUpdated && "( updated )"} */}
              {user && user.firstName + " " + (user.lastName ?? "")}
            </CardDescription>
          </span>

          <CardDescription className="absolute bottom-4 right-6 text-xs ">
            {createdUpdatedAtTimestamp}
            {/* {wasUpdated && "( updated )"} */}
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
};

export default WildCardNote;
