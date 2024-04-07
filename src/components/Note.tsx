"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import AddEditNoteDialog from "./AddEditNoteDialog";
import { Globe, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

import { getUser } from "@/app/notes/_actions";
import { User } from "@clerk/nextjs/server";
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
  isAdmin: boolean;
  index: number;
}

const Note = ({ note, isAdmin, index }: NoteProps) => {
  const pathname = usePathname();

  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [user, setUser] = useState<User>();
  const [isShared, setIsShared] = useState(note.isShared);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const wasUpdated = note.updateAt > note.createdAt;
  const router = useRouter();
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createdAt
  ).toDateString();

  async function ToggleShare(noteId: string, isShared: boolean) {
    // toast.custom("you got click");
    // Use the PUT method and include the 'action' parameter in the body
    const response = await fetch("/api/notes/share", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId, isShared: !isShared }),
    });
    if (response.ok) {
      setIsShared(!isShared);

      if (!isShared) {
        toast.success("you have successfully public a note");
      } else {
        toast.success("you have successfully unpublic a note");
      }
      router.refresh();
    } else {
      toast.error("something is wrong");
    }
  }

  const colorClasses = [
    "from-red-600",
    "from-teal-600",
    "from-indigo-600",
    "from-sky-600",
    "from-emerald-600",
    "from-lime-600",
    "from-pink-600",
    "from-violet-600",
    "from-orange-600",
    "from-yellow-600",
    "from-green-600",
    "from-blue-600",
  ];

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
          className="relative cursor-pointer  rounded-xl  shadow-gray-300 hover:shadow-gray-600 "
          onClick={() => setShowAddEditNoteDialog(true)}
        >
          <CardHeader className="h-32 space-y-0">
            <CardTitle className="scale-y-90  text-lg text-gray-800">
              {note.title}
            </CardTitle>

            <div
              className={`${
                pathname == "/notes/public"
                  ? colorClasses[9]
                  : pathname == "/notes"
                    ? colorClasses[1]
                    : "from-slate-900"
              } absolute  -left-1 -right-1 top-16 w-1/2 rounded-l-sm rounded-br-sm  rounded-tr-lg bg-gradient-to-r to-transparent pl-6 text-sm text-white lg:w-1/3`}
              style={{
                clipPath: `polygon(100% 0%, 85% 48%, 100% 100%, 0.5% 100%, 0% 50%, 0.5% 0)`,
              }}
            >
              {note.questions.length + " " + "items"}
            </div>
          </CardHeader>
          <CardContent
            className={`${
              pathname == "/notes/public"
                ? "bg-amber-500/5"
                : pathname == "/notes"
                  ? "bg-teal-500/5"
                  : "bg-stone-500/5"
            } h-14 rounded-b-xl  px-6 py-2`}
          >
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
          {isAdmin && (
            <Globe
              size={15}
              className={`absolute right-6 top-6 ${
                isShared ? "text-teal-500" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation(); // This stops the click event from propagating to the parent
                ToggleShare(note.id, isShared); // Assuming you want to toggle the current state
              }}
            />
          )}
        </Card>
      )}

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default Note;
