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
import EditBookMarkedQuestion from "@/components/EditBookMarkedQuestion";
import { useState } from "react";
import toast from "react-hot-toast";

import { redirect, useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Badge } from "../ui/badge";
import { ReportDataTable } from "./ReportDataTable";
import { Note, Prisma } from "@prisma/client";
import { User } from "@clerk/nextjs/server";
import { dateFormatter } from "@/app/utils/dateFormatter";
import { getNote } from "@/app/report/_actions";
import { report } from "process";
import Link from "next/link";

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

const ReportWrapper = ({ reports, isSuperAdmin }: reportProps) => {
  const [isClient, setIsClient] = useState(false);

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
        toast.success("you have successfully deleted a test report");
      }
    } catch (error) {
      console.error(error);
      toast.error("something went wrong. Please try again ");
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
        <DataTableColumnHeader column={column} title="result" />
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
        <DataTableColumnHeader column={column} title="candidate" />
      ),
    },
    {
      accessorKey: "noteTitle",
      size: 1250,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="note" />
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
        <DataTableColumnHeader column={column} title="time" />
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
        <DataTableColumnHeader column={column} title="batch" />
      ),
      cell: (props: any) => {
        const batch = props.row.original.batch;

        return <div>{Number(batch + 1)}</div>;
      },
    },
    // {
    //   accessorKey: "username",
    //   size: 130,
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="username" />
    //   ),
    //   cell: (props: any) => {
    //     const noteTitle = props.row.original.note.title;

    //     const question = props.row.original;

    //     return (
    //       <ContextMenu>
    //         <ContextMenuTrigger className="h-full w-full">
    //           <Badge
    //           // className={
    //           //   colorClass + " " + "flex w-12 justify-center text-white"
    //           // }
    //           >
    //             {noteTitle.length < 5
    //               ? noteTitle
    //               : noteTitle.substring(0, 3) + "."}
    //           </Badge>
    //         </ContextMenuTrigger>

    //         <ContextMenuContent className="w-full">
    //           <ContextMenuItem
    //             className="p-2"
    //             onClick={() => {
    //               setSelectedQuestion(question);
    //               setShowAddEditQuestionDialog(true);
    //             }}
    //           >
    //             <span className="flex items-center space-x-2">
    //               <SkipForward size={14} /> <span>Forward</span>
    //             </span>{" "}
    //           </ContextMenuItem>
    //           <ContextMenuItem
    //             className="p-2"
    //             onClick={() => {
    //               setFilterOutNote([]);
    //               setShowMatchingNote("");
    //               setTopicFilter("");
    //             }}
    //           >
    //             <span className="flex w-full items-center justify-between">
    //               <span className="flex items-center space-x-2">
    //                 <RotateCw size={14} /> <span>Reload</span>
    //               </span>

    //               <span className="text-[12px]">F5</span>
    //             </span>
    //           </ContextMenuItem>
    //           <ContextMenuSeparator />
    //           <ContextMenuItem
    //             className="p-2"
    //             onClick={() => {
    //               setFilterOutNote([...filterOutNote, noteTitle.trim()]);
    //               setShowMatchingNote("");
    //             }}
    //           >
    //             <span className="flex items-center space-x-2">
    //               <Filter size={14} /> <span>Filter out</span>
    //             </span>
    //           </ContextMenuItem>
    //           <ContextMenuItem
    //             className="p-2"
    //             onClick={() => {
    //               setShowMatchingNote(noteTitle.trim());
    //               setFilterOutNote([]);
    //             }}
    //           >
    //             <span className="flex items-center space-x-2">
    //               <Waypoints size={14} /> <span>Show matching</span>
    //             </span>
    //           </ContextMenuItem>
    //           <ContextMenuItem
    //             className="p-2"
    //             onClick={() => {
    //               setFilterOutNote([]);
    //               setShowMatchingNote("");
    //               setTopicFilter("");
    //             }}
    //           >
    //             <span className="flex items-center space-x-40">
    //               <span className="flex items-center space-x-2">
    //                 <LayoutGrid size={14} /> <span>Show All records</span>
    //               </span>
    //               <span className="flex items-center space-x-1 text-xs">
    //                 <LayoutGrid size={10} /> <span>A</span>
    //               </span>
    //             </span>
    //           </ContextMenuItem>
    //         </ContextMenuContent>
    //       </ContextMenu>
    //     );
    //   },
    // },

    {
      accessorKey: "submittedAt",
      size: 150,
      sortDescFirst: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="submit At" />
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
                className="flex flex-col items-start"
              >
                <DropdownMenuLabel className="w-full">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(report.id);
                    toast.success("You have copied this report id");
                  }}
                >
                  Copy Report Id
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="w-full"
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
                        // result: `${report.result}`,
                      },
                    }}
                  >
                    Check Report Details
                  </Link>
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline w-full border-none p-0 px-2 text-left"
                    >
                      Delete Report
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your question and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white"
                        onClick={() => {
                          if (isSuperAdmin) {
                            // deleteQuestion(report.id);
                            deleteReport(report.id);
                          } else {
                            toast.error(
                              "Sorry, you're not authorized to delete this test report",
                            );
                          }
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* </DropdownMenuItem> */}
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
        />
      )}
    </div>
  );
};

export default ReportWrapper;
