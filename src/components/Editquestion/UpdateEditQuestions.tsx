"use client";
import React, { useEffect } from "react";
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

import { redirect, useRouter } from "next/navigation";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Badge } from "../ui/badge";
import { AllDataTable } from "./AllDataTable";
import EditSelectQuestion from "./EditSelectQuestion";
import Cookie from "js-cookie";
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

const UpdateEditQuestions = ({
  flaggedQuestions,
  isSuperAdmin,
  isAdmin,
}: flaggedQuestionsType) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [isClient, setIsClient] = useState(false);
  const e = useTranslations("Editquestion");
  const [lang, setLang] = useState(Cookie.get("NEXT_LOCALE") ?? "en");
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [filterOutNote, setFilterOutNote] = useState<any[]>([]);
  const [showMatchingNote, setShowMatchingNote] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
    useState(false);
  const router = useRouter();

  if (!isSuperAdmin && !isAdmin) {
    redirect(`/${lang}/notes/public`);
  }

  const deleteQuestion = async (questionId: string | undefined) => {
    try {
      if (questionId) {
        // console.log(questionId);
        const response = await fetch("/api/question", {
          method: "DELETE",
          body: JSON.stringify({ questionId }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "delete");
        }

        router.refresh();
        toast.success(e("table.action.toast.delete-suc"));
      }
    } catch (error) {
      console.error(error);
      toast.error(e("table.action.toast.server"));
    }
  };

  const columns: ColumnDef<Question>[] = [
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
      accessorKey: "questionTitle",
      size: 1250,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={e("table.title")} />
      ),
    },
    {
      accessorKey: "note",
      size: 130,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={e("table.note")} />
      ),
      cell: (props: any) => {
        const noteTitle = props.row.original.note.title;
        // Get the color class based on the value
        const question = props.row.original;
        const colorClass = getColorForTitle(noteTitle);

        return (
          <ContextMenu>
            <ContextMenuTrigger className="h-full w-full ">
              <Badge
                className={
                  colorClass +
                  " flex w-12 items-center justify-center   text-white"
                }
              >
                {noteTitle.length < 5 ? (
                  <span className="m-0 p-0">{noteTitle}</span>
                ) : (
                  noteTitle.substring(0, 3) + "."
                )}
              </Badge>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-full">
              <ContextMenuItem
                className="p-2"
                onClick={() => {
                  setSelectedQuestion(question);
                  setShowAddEditQuestionDialog(true);
                }}
              >
                <span className="flex items-center space-x-2">
                  <SkipForward size={14} />{" "}
                  <span>{e("table.action.rightclick.forward")}</span>
                </span>{" "}
              </ContextMenuItem>
              <ContextMenuItem
                className="p-2"
                onClick={() => {
                  setFilterOutNote([]);
                  setShowMatchingNote("");
                  setTopicFilter("");
                }}
              >
                <span className="flex w-full items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <RotateCw size={14} />{" "}
                    <span>{e("table.action.rightclick.reload")}</span>
                  </span>

                  <span className="text-[12px]">F5</span>
                </span>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                className="p-2"
                onClick={() => {
                  setFilterOutNote([...filterOutNote, noteTitle.trim()]);
                  setShowMatchingNote("");
                }}
              >
                <span className="flex items-center space-x-2">
                  <Filter size={14} />{" "}
                  <span>{e("table.action.rightclick.filterout")}</span>
                </span>
              </ContextMenuItem>
              <ContextMenuItem
                className="p-2"
                onClick={() => {
                  setShowMatchingNote(noteTitle.trim());
                  setFilterOutNote([]);
                }}
              >
                <span className="flex items-center space-x-2">
                  <Waypoints size={14} />{" "}
                  <span>{e("table.action.rightclick.showmatching")}</span>
                </span>
              </ContextMenuItem>
              <ContextMenuItem
                className="p-2"
                onClick={() => {
                  setFilterOutNote([]);
                  setShowMatchingNote("");
                  setTopicFilter("");
                }}
              >
                <span className="flex items-center space-x-40">
                  <span className="flex items-center space-x-2">
                    <LayoutGrid size={14} />{" "}
                    <span>{e("table.action.rightclick.show-all")}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-xs">
                    <LayoutGrid size={10} /> <span>A</span>
                  </span>
                </span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      },
    },
    {
      accessorKey: "note.updateAt",
      size: 150,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={e("table.update")} />
      ),

      cell: ({ row }) => {
        const date: any = row.getValue("note");
        const formatted = date.updateAt.toLocaleDateString();
        return <div className=" font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      size: 20,
      cell: ({ row }) => {
        const question = row.original;
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
                    navigator.clipboard.writeText(question.id);
                    toast.success(e("table.action.toast.copyId"));
                  }}
                >
                  {e("table.action.copyId")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(question.comment);
                    toast.success(e("table.action.toast.copy-comment"));
                  }}
                >
                  {e("table.action.copy-comment")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(question.questionTitle);
                    toast.success(e("table.action.toast.copy-title"));
                  }}
                >
                  {e("table.action.copy-title")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    setSelectedQuestion(question);
                    setShowAddEditQuestionDialog(true);
                  }}
                >
                  {e("table.action.update")}
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline w-full border-none p-0 px-2 text-left"
                    >
                      {e("table.action.delete")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {e("table.action.verify.title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {e("table.action.verify.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {e("table.action.verify.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white"
                        onClick={() => {
                          if (isSuperAdmin) {
                            deleteQuestion(question.id);
                          } else {
                            toast.error(e("table.action.toast.delete-err"));
                          }
                        }}
                      >
                        {e("table.action.verify.continue")}
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
  const generateTitleToColorMapping = (
    flaggedQuestions: any[],
  ): TitleToColorMapping => {
    const uniqueTitlesArray = Array.from(
      new Set(flaggedQuestions.map((q) => q.note.title.trim().toUpperCase())),
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
    generateTitleToColorMapping(flaggedQuestions);

  const getColorForTitle = (title: string) => {
    // Normalize the title to remove extra spaces and handle case insensitivity
    const normalizedTitle: string = title.trim().toUpperCase();
    // If the title is in the mapping, return its color, otherwise return a default color
    return titleToColorMapping[normalizedTitle] || "bg-gray-200 text-black"; // default color
  };

  let data: any;

  // console.log(
  //   "filter out:" + filterOutNote + "show matching: " + showMatchingNote,
  // );
  const noteTitle = Array.from(
    new Set(flaggedQuestions.map((f) => f.note.title)),
  );
  // console.log("topicfilter: " + topicFilter);
  if (topicFilter) {
    data = flaggedQuestions.filter(
      (q) => q.note.title.trim() == topicFilter.trim(),
    );
  } else {
    // data = flaggedQuestions;
    if (showMatchingNote) {
      data = flaggedQuestions.filter(
        (q) => q.note.title.trim() === showMatchingNote.trim(),
      );
    } else if (!showMatchingNote && filterOutNote) {
      // data = flaggedQuestions.filter(
      //   (q) => q.note.title.trim() !== filterOutNote.trim(),
      // );
      data = flaggedQuestions.filter(
        (q) =>
          !filterOutNote
            .map((note) => note.trim())
            .includes(q.note.title.trim()),
      );
    } else {
      data = flaggedQuestions;
    }
  }

  return (
    <div>
      {isClient && (
        <AllDataTable
          columns={columns}
          data={data}
          noteTitle={noteTitle}
          topicFilter={topicFilter}
          setTopicFilter={setTopicFilter}
          setShowMatchingNote={setShowMatchingNote}
          setFilterOutNote={setFilterOutNote}
        />
      )}
      {selectedQuestion && isClient && (
        <EditSelectQuestion
          open={showAddEditQuestionDialog}
          setOpen={setShowAddEditQuestionDialog}
          question={selectedQuestion!}
        />
      )}
    </div>
  );
};

export default UpdateEditQuestions;
