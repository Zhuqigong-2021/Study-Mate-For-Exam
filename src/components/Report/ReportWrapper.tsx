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
import { ColumnDef } from "@tanstack/react-table";
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
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

import { Badge } from "../ui/badge";
import { ReportDataTable } from "./ReportDataTable";
import { Note, Prisma } from "@prisma/client";

// import { dateFormatter } from "@/app/utils/dateFormatter";

import Link from "next/link";
import { nameFormatter } from "@/app/[locale]/utils/nameFormatter";
import { dateFormatter } from "@/app/[locale]/utils/dateFormatter";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

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

interface flaggedQuestionsType {
  flaggedQuestions: {
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
  }[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
}
interface reportProps {
  reports: Report[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
}
type Report = {
  id: string;
  result: number;
  userId: string;
  noteTitle: string;
  time: string;
  userName: string;
  userEmail: string;
  noteId: string;
  choiceId: Prisma.JsonValue;
  batch: number;
  reportListId: string;
  submittedAt: Date;
};

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

const ReportWrapper = ({ reports, isSuperAdmin, isAdmin }: reportProps) => {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const r = useTranslations("Report");

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [filterOutNote, setFilterOutNote] = useState<any[]>([]);
  const [showMatchingNote, setShowMatchingNote] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
    useState(false);
  const router = useRouter();

  const deleteReport = async (reportId: string | undefined) => {
    try {
      if (reportId) {
        const response = await fetch("/api/report", {
          method: "DELETE",
          body: JSON.stringify({ reportId }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "delete");
        }

        router.refresh();
        toast.success(r("table.action.toast.success"));
      }
    } catch (error) {
      console.error(error);
      toast.error(r("table.action.toast.server"));
    }
  };

  const columns: ColumnDef<Report>[] = [
    {
      id: "select",
      size: 45,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          className="dark:border-stone-400"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "result",
      size: 200,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={r("table.result")} />
      ),
      cell: (props: any) => {
        const score = props.row.original.result;
        return (
          <div className="flex h-10 w-10 items-center justify-center font-semibold ">
            <CircularProgressbar
              value={Number(score)}
              text={`${score}%`}
              strokeWidth={10}
              styles={buildStyles({
                textColor:
                  Number(score) == 100
                    ? "#14b8a6"
                    : Number(score) == 0
                      ? "#f87171"
                      : theme === "dark"
                        ? "white"
                        : "#404040",
                // rotation: 0.05,
                textSize: "28px",
                pathColor: Number(score) >= 50 ? "#5eead4" : "#f3f4f6",
                trailColor:
                  Number(score) !== 0 && Number(score) >= 50
                    ? "#f3f4f6"
                    : Number(score) < 50
                      ? "#f87171"
                      : "#f87171",
              })}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      size: 250,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={r("table.candidate")} />
      ),
      cell: (props: any) => {
        const username = props.row.original.userName;
        return <div>{nameFormatter(username)}</div>;
      },
    },
    {
      accessorKey: "noteTitle",
      size: 1250,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={r("table.note")} />
      ),
      cell: (props: any) => {
        const noteTitle = props.row.original.noteTitle;
        const colorClass = getColorForTitle(noteTitle);
        return (
          <div className="text-red-400">
            <Badge
              className={`${colorClass} + " " + flex w-12 justify-center text-white`}
            >
              {noteTitle.length < 5
                ? noteTitle
                : noteTitle.substring(0, 3) + "."}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "time",
      size: 250,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={r("table.time")} />
      ),
      cell: (props: any) => {
        const time = props.row.original.time;

        return <div>{time}</div>;
      },
    },
    {
      accessorKey: "batch",
      size: 150,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={r("table.batch")} />
      ),
      cell: (props: any) => {
        const batch = props.row.original.batch;

        return <div>{Number(batch + 1)}</div>;
      },
    },

    {
      accessorKey: "submittedAt",
      size: 150,
      sortDescFirst: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={r("table.submit")} />
      ),

      cell: ({ row }) => {
        const date: any = row.getValue("submittedAt");
        const formatted = dateFormatter(date);
        return <div className=" font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      size: 20,
      cell: ({ row }) => {
        const report = row.original;
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
                className="flex flex-col items-start dark:border-stone-800"
              >
                <DropdownMenuLabel className="w-full">
                  {r("table.action.title")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-auto my-1 h-[1px] w-full bg-gray-300 dark:bg-stone-600" />
                <DropdownMenuItem
                  className="w-full dark:text-stone-400"
                  onClick={() => {
                    navigator.clipboard.writeText(report.id);
                    toast.success(r("table.action.toast.copyId"));
                  }}
                >
                  {r("table.action.copy")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="w-full dark:text-stone-400"
                  onClick={() => {
                    // setSelectedQuestion(question);
                    // setShowAddEditQuestionDialog(true);
                  }}
                >
                  <Link
                    href={{
                      pathname: `/exam/${report.noteId}/report`,
                      query: {
                        noteId: `${report.noteId}`,
                        choiceId: JSON.stringify(report.choiceId),
                        batch: `${report.batch}`,
                      },
                    }}
                  >
                    {r("table.action.check")}
                  </Link>
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline w-full border-none p-0 px-2 text-left dark:text-stone-400"
                    >
                      {r("table.action.delete")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="circle-sm-exam dark:border-none"
                    aria-describedby="content"
                    aria-description="content"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {r("table.action.verify.title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {r("table.action.verify.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="dark:border-none dark:shadow-sm dark:shadow-red-200">
                        {r("table.action.verify.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white dark:border-none dark:shadow-sm dark:shadow-red-300 dark:hover:text-red-500"
                        onClick={() => {
                          if (isSuperAdmin) {
                            deleteReport(report.id);
                          } else {
                            toast.error(r("table.action.toast.deleteErr"));
                          }
                        }}
                      >
                        {r("table.action.verify.continue")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
  const titleToColorMapping: TitleToColorMapping =
    generateTitleToColorMapping(reports);

  const getColorForTitle = (title: string) => {
    // Normalize the title to remove extra spaces and handle case insensitivity
    const normalizedTitle: string = title.trim().toUpperCase();
    // If the title is in the mapping, return its color, otherwise return a default color
    return titleToColorMapping[normalizedTitle] || "bg-gray-200 text-black"; // default color
  };

  let data: any;
  // console.log(reports);
  let noteTitlesArray = [...new Set(reports.map((r) => r.noteTitle))];

  if (topicFilter) {
    data = reports.filter((q) => q.noteTitle.trim() == topicFilter.trim());
  } else {
    if (showMatchingNote) {
      data = reports.filter(
        (q) => q.noteTitle.trim() === showMatchingNote.trim(),
      );
    } else if (!showMatchingNote && filterOutNote) {
      // data = flaggedQuestions.filter(
      //   (q) => q.note.title.trim() !== filterOutNote.trim(),
      // );
      data = reports.filter(
        (q) =>
          !filterOutNote
            .map((note) => note.trim())
            .includes(q.noteTitle.trim()),
      );
    } else {
      data = reports;
    }
  }

  return (
    <div>
      {isClient && (
        <ReportDataTable
          columns={columns}
          data={data}
          noteTitle={noteTitlesArray}
          topicFilter={topicFilter}
          setTopicFilter={setTopicFilter}
          setShowMatchingNote={setShowMatchingNote}
          setFilterOutNote={setFilterOutNote}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default ReportWrapper;
