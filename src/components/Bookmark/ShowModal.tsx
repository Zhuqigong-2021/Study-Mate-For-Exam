"use client";
import React from "react";
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
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
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
} from "../ui/alert-dialog";
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
}

const ShowModal = ({
  flaggedQuestions,
  isSuperAdmin,
}: flaggedQuestionsType) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [filterOutNote, setFilterOutNote] = useState<any[]>([]);
  const [showMatchingNote, setShowMatchingNote] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
    useState(false);
  const router = useRouter();
  const b = useTranslations("Bookmark");
  const bookMarked = async (questionId: string) => {
    try {
      if (!isSuperAdmin) {
        toast.error(b("table.action.toast.unbook-err"));
        return;
      }
      const response = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, isFlagged: false }),
      });
      // setIsFlagged(!isFlagged);
      if (response.ok) {
        toast.success(b("table.action.toast.unbook-suc"));
        router.refresh();
      }
    } catch (error) {
      toast.error(b("table.action.toast.server"));
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
        <DataTableColumnHeader column={column} title={b("table.title")} />
      ),
    },
    {
      accessorKey: "note",
      size: 130,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={b("table.note")} />
      ),
      cell: (props: any) => {
        const noteTitle = props.row.original.note.title;
        // Get the color class based on the value
        const question = props.row.original;
        const colorClass = getColorForTitle(noteTitle);

        return (
          <ContextMenu>
            <ContextMenuTrigger className="h-full w-full">
              <Badge
                className={
                  colorClass + " " + "flex w-12 justify-center text-white"
                }
              >
                {noteTitle.length < 5
                  ? noteTitle
                  : noteTitle.substring(0, 3) + "."}
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
                  <span>{b("table.action.rightclick.forward")}</span>
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
                    <span>{b("table.action.rightclick.reload")}</span>
                  </span>
                  {/* <span className="flex items-center space-x-1 text-xs">
                    <LayoutGrid size={10} /> <span>R</span>
                  </span> */}
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
                  <span>{b("table.action.rightclick.filterout")}</span>
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
                  <span>{b("table.action.rightclick.showmatching")}</span>
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
                    <span>{b("table.action.rightclick.show-all")}</span>
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
        <DataTableColumnHeader column={column} title={b("table.update")} />
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(question.questionTitle);
                    toast.success(b("table.action.toast.copy-title"));
                  }}
                >
                  {b("table.action.copy")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    setSelectedQuestion(question);
                    setShowAddEditQuestionDialog(true);
                  }}
                >
                  {b("table.action.view")}
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline w-full border-none p-0 px-2 text-left"
                    >
                      <span>{b("table.action.unbookmark")}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {b("table.action.verify.title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {b("table.action.verify.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {b("table.action.verify.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white"
                        onClick={() => {
                          if (isSuperAdmin) {
                            bookMarked(question.id);
                          } else {
                            toast.error(b("table.action.toast.unbook-err"));
                          }
                        }}
                      >
                        {b("table.action.verify.continue")}
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
  // console.log(data);
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        noteTitle={noteTitle}
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        setShowMatchingNote={setShowMatchingNote}
        setFilterOutNote={setFilterOutNote}
      />
      {selectedQuestion && (
        <EditBookMarkedQuestion
          open={showAddEditQuestionDialog}
          setOpen={setShowAddEditQuestionDialog}
          question={selectedQuestion!}
        />
      )}
    </>
  );
};

export default ShowModal;
