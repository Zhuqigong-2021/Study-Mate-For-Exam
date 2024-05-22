"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PiMedalFill } from "react-icons/pi";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { Globe, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

// import { getUser } from "@/app/notes/_actions";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import { getUser } from "@/app/[locale]/notes/_actions";
import { percentageGetter } from "@/app/[locale]/utils/percentageGetter";
import { useTranslations } from "next-intl";
import { useFormatter } from "next-intl";

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
  lang: string;
}

const Note = ({ note, isAdmin, index, lang }: NoteProps) => {
  const pathname = usePathname();
  const format = useFormatter();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [user, setUser] = useState<User>();
  const [isShared, setIsShared] = useState(note.isShared);
  const [isClient, setIsClient] = useState(false);
  const h = useTranslations("Homepage");

  useEffect(() => {
    setIsClient(true);
  }, []);
  const wasUpdated = note.updateAt > note.createdAt;
  const router = useRouter();
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
  async function ToggleShare(noteId: string, isShared: boolean) {
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
        toast.success(h("card.cardTitle.toast.public"));
      } else {
        toast.success(h("card.cardTitle.toast.unpublic"));
      }
      router.refresh();
    } else {
      toast.error(h("card.cardTitle.toast.server"));
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
          className="relative cursor-pointer   rounded-xl border-none bg-white shadow-sm shadow-gray-400 hover:shadow-gray-600"
          onClick={() => setShowAddEditNoteDialog(true)}
        >
          {isAdmin && percentageGetter(note.description) && (
            <div className="w-18 absolute -right-1 bottom-16 flex h-5 flex-col justify-center rounded-r-sm border-r border-red-600 bg-gradient-to-l  from-red-500   via-red-400 to-orange-100  px-2 py-1 pl-3 text-center text-xs font-light text-white shadow-sm">
              <span className="flex items-center space-x-[4px] font-normal">
                <PiMedalFill className=" text-yellow-50" size={12} />{" "}
                <span>{percentageGetter(note.description)}</span>
              </span>
            </div>
          )}
          {!isAdmin && percentageGetter(note.description) && (
            <>
              <div className="w-18 absolute -right-1 top-5 flex h-5 flex-col justify-center rounded-r-sm border-r border-red-600 bg-gradient-to-l from-red-500  via-red-400   to-orange-100 px-2  py-1 pl-3 text-center text-xs font-light text-white shadow-sm">
                <span className="flex items-center space-x-[4px] font-normal">
                  <PiMedalFill className=" text-yellow-50" size={12} />{" "}
                  <span>{percentageGetter(note.description)}</span>
                </span>
              </div>
            </>
          )}
          <CardHeader className="h-32 space-y-0">
            <CardTitle className="scale-y-90  text-lg text-gray-800">
              {note.title}
            </CardTitle>

            <div
              className={`${
                pathname == `/${lang}/notes/public`
                  ? colorClasses[9]
                  : pathname == `/${lang}/notes`
                    ? colorClasses[1]
                    : "from-slate-900"
              } absolute  -left-1 -right-1 top-16 w-[55%] rounded-l-sm rounded-br-sm  rounded-tr-lg bg-gradient-to-r to-transparent pl-6 text-sm text-white ${
                lang == "en" ? "lg:w-1/3" : "lg:w-[38%]"
              }`}
              style={{
                clipPath: `polygon(100% 0%, 85% 48%, 100% 100%, 0.5% 100%, 0% 50%, 0.5% 0)`,
              }}
            >
              {/* {note.questions.length + " " + h("card.content.number")} */}
              {h("card.content.number", { count: note.questions.length })}
            </div>
          </CardHeader>
          <CardContent
            className={`${
              pathname == `/${lang}/notes/public`
                ? "bg-amber-500/5"
                : pathname == `/${lang}/notes`
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
              {/* {createdUpdatedAtTimestamp} */}
              {formattedDate}
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
