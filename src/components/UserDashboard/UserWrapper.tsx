"use client";
import React, { useCallback, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Divide,
  Filter,
  LayoutDashboard,
  LayoutGrid,
  MoreHorizontal,
  RotateCw,
  SkipForward,
  Waypoints,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import EditBookMarkedQuestion from "@/components/Bookmark/EditBookMarkedQuestion";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { Badge } from "../ui/badge";

// import { nameFormatter } from "@/app/utils/nameFormatter";
import { AllUserDataTable } from "./AllUserDataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { User } from "@clerk/nextjs/server";
import {
  blockThisUser,
  setUserRole,
  unblockThisUser,
} from "@/app/[locale]/admin/dashboard/_actions";
import { nameFormatter } from "@/app/[locale]/utils/nameFormatter";
import { useTranslations } from "next-intl";

export type Question = {
  id: string;
  note: {
    id: string;
    title: string;
    createdAt: Date;
    updateAt: Date;
  };
  questionTitle: string;
  noteId: string;
  isFlagged: boolean;
  comment: string;
  choices: {
    id: string;
    content: string;
    answer: boolean;
  }[];
};
interface optionsType {
  weekday: "short" | "long" | "narrow";
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "narrow" | "short" | "long";
  day: "numeric" | "2-digit";
  hour: "numeric" | "2-digit";
  minute: "numeric" | "2-digit";
  second: "numeric" | "2-digit";
  hour12: boolean;
}

function formatDateTime(dateTimeString: string | number | Date) {
  const options: optionsType = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", options);
}

let showAddEditQuestionDialog = false;
function setShowAddEditQuestionDialog(question: Question) {
  showAddEditQuestionDialog = !showAddEditQuestionDialog;
}

interface UsersProps {
  usersList: User[];
  isSuperAdmin: boolean;
}

const colorClasses = [
  "bg-red-400",
  "bg-teal-400",
  "bg-indigo-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-lime-400",
  "bg-pink-400",
  "bg-violet-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-green-400",
  "bg-blue-400",
];

const ReportWrapper = ({ usersList, isSuperAdmin }: UsersProps) => {
  const [isClient, setIsClient] = useState(false);
  const d = useTranslations("Dashboard");
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [filterOutNote, setFilterOutNote] = useState<any[]>([]);
  const [showMatchingNote, setShowMatchingNote] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
    useState(false);
  const router = useRouter();

  const handleRole = async (user: User) => {
    try {
      if (!isSuperAdmin) {
        toast.error(d("data.table.toast.auth-err"));
        return;
      }
      if (user.id == "user_2aFBx8E20RdENmTS0CRlRej0Px4") {
        toast.error(d("data.table.toast.admin-err"));
        return;
      }
      const response = await setUserRole(
        user.id,
        String(user.publicMetadata.role ? "" : "admin"),
      );
      if (!response) {
        toast.error(d("data.table.toast.auth-err"));
        return;
      }
      let userId: string = user.id;
      let role: string = user.publicMetadata.role ? "" : "admin";

      toast.success(d("data.table.toast.role-suc"));
      router.refresh();
    } catch (error) {
      toast.error(d("data.table.toast.server"));
    }
  };

  async function handleBlock(user: User) {
    try {
      if (!isSuperAdmin) {
        toast.error(d("data.table.toast.auth-err"));
        return;
      }

      if (user.id == "user_2aFBx8E20RdENmTS0CRlRej0Px4") {
        toast.error(d("data.table.toast.super-block-err"));
        return;
      }

      // const response = await fetch("/api/block", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     currentUserId: user.id,
      //   }),
      // });

      // if (!response.ok) throw Error("Status code: " + response.status);

      const response = await blockThisUser(user.id);
      if (!response) {
        toast.error(d("data.table.toast.block-twice"));
        return;
      }
      // let bannedValue = user.privateMetadata.banned
      //   ? user.privateMetadata.banned
      //   : false;

      toast.success(d("data.table.toast.block-suc"));
    } catch (error) {
      toast.error(d("data.table.toast.server"));
    }
  }

  async function handleUnblock(user: User) {
    try {
      if (!isSuperAdmin) {
        toast.error(d("data.table.toast.auth-err"));
        return;
      }

      const response = await unblockThisUser(user.id);
      if (!response) {
        toast.error(d("data.table.toast.unblock-err"));
        return;
      }
      toast.success(d("data.table.toast.unblock-suc"));
    } catch (error) {
      toast.error(d("data.table.toast.server"));
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      id: "fullName",
      header: d("data.table.column.full-name"),
      size: 1250,
      accessorFn: (row) => {
        return (
          nameFormatter(`${row.firstName} ${row.lastName} `) +
          "," +
          `${row.emailAddresses[0].emailAddress}`
        );
      },

      cell: (row) => {
        function splitFullNameAndEmail(fullNameWithEmail: any) {
          const [fullName, email] = fullNameWithEmail.split(",");
          return { fullName, email };
        }
        // const firstName = row.firstName;
        let fullNameWithEmail = row.getValue();
        const obj = splitFullNameAndEmail(fullNameWithEmail);
        const fullname = obj.fullName;
        const email = obj.email;

        // return <div> {nameFormatter(`${fullname}`)} </div>;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="m-0 inline rounded-none border-none  bg-transparent bg-white  p-0 text-sm text-muted-foreground shadow-none hover:bg-transparent hover:bg-white hover:text-sm hover:text-muted-foreground hover:shadow-none focus:outline-none focus:ring-0 dark:bg-background">
                  {nameFormatter(`${fullname}`)}
                </button>
              </TooltipTrigger>
              <TooltipContent>{email}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "publicMetadata",
      size: 5,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={d("data.table.column.role")}
        />
      ),
      cell: (props: any) => {
        let role = props.row.original.publicMetadata.role;
        if (role == "admin") {
          role = "admin";
        } else {
          role = "user";
        }

        return (
          <div>
            <Badge
              variant="outline"
              className={`${
                role == "admin"
                  ? " bg-gradient-to-r from-indigo-500 to-violet-400"
                  : " bg-gradient-to-r from-teal-500 to-emerald-400"
              }    border-none text-white outline-none`}
            >
              {role.length < 5 ? role : role.substring(0, 3) + "."}
              {/* {role} */}
            </Badge>
          </div>
        );
      },
    },

    {
      id: "actions",
      size: 15,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="flex flex-col items-start"
              >
                <DropdownMenuLabel className="w-full">
                  {d("data.table.actions.title")}
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator className="bg-white" /> */}
                <DropdownMenuSeparator className="mx-auto my-1 h-[1px] w-full bg-gray-300 dark:bg-stone-600" />
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => handleRole(user)}
                >
                  {d("data.table.actions.authorization")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="w-full"
                  onClick={() => handleBlock(user)}
                >
                  {d("data.table.actions.block")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => handleUnblock(user)}
                >
                  {d("data.table.actions.unblock")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const colorClasses = [
    "bg-red-400",
    "bg-teal-400",
    "bg-indigo-400",
    "bg-sky-400",
    "bg-emerald-400",
    "bg-lime-400",
    "bg-pink-400",
    "bg-violet-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-green-400",
    "bg-blue-400",
    // ... more color classes
  ];

  // Function to generate the mapping
  const generateTitleToColorMapping = (reports: any[]): TitleToColorMapping => {
    const uniqueTitlesArray = Array.from(
      new Set(reports.map((r) => r.noteTitle.trim().toUpperCase())),
    );
    const mapping: TitleToColorMapping = {};

    uniqueTitlesArray.forEach((title, index) => {
      mapping[title] = colorClasses[index % colorClasses.length];
    });

    return mapping;
  };
  // Define a mapping from titles to colors
  type TitleToColorMapping = {
    [key: string]: string;
  };
  //   const titleToColorMapping: TitleToColorMapping =
  //     generateTitleToColorMapping(reports);

  //   const getColorForTitle = (title: string) => {
  //     // Normalize the title to remove extra spaces and handle case insensitivity
  //     const normalizedTitle: string = title.trim().toUpperCase();
  //     // If the title is in the mapping, return its color, otherwise return a default color
  //     return titleToColorMapping[normalizedTitle] || "bg-gray-200 text-black"; // default color
  //   };

  let data: any;

  if (topicFilter) {
    if (topicFilter == "admin")
      data = usersList.filter((u) => {
        return u.publicMetadata.role === topicFilter.trim();
      });
    if (topicFilter == "user") {
      data = usersList.filter((u) => u.publicMetadata.role !== "admin");
    }
  } else {
    data = usersList;
  }

  return (
    <div>
      {isClient && (
        <AllUserDataTable
          columns={columns}
          data={data}
          topicFilter={topicFilter}
          setTopicFilter={setTopicFilter}
          setShowMatchingNote={setShowMatchingNote}
          setFilterOutNote={setFilterOutNote}
        />
      )}
    </div>
  );
};

export default ReportWrapper;
