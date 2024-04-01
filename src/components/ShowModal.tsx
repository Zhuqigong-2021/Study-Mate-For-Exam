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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import EditBookMarkedQuestion from "@/components/EditBookMarkedQuestion";
import { useState } from "react";
import toast from "react-hot-toast";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";

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

// const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
//     useState(false);
let showAddEditQuestionDialog = false;
function setShowAddEditQuestionDialog(question: Question) {
  showAddEditQuestionDialog = !showAddEditQuestionDialog;
  //   return showAddEditQuestionDialog;
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
  const [showAddEditQuestionDialog, setShowAddEditQuestionDialog] =
    useState(false);
  const router = useRouter();
  const bookMarked = async (questionId: string) => {
    try {
      if (!isSuperAdmin) {
        toast.error("Sorry! You're not authorized to unbookmark a question ");
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
        toast.success("you successfully unbookmarked a question");
        router.refresh();
      }
    } catch (error) {
      toast.error("your request is not successful");
    }
  };

  const columns: ColumnDef<Question>[] = [
    {
      id: "select",
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="questionTitle" />
      ),
    },
    {
      accessorKey: "note.title",
      header: "Note",
      cell: (props: any) => {
        const noteTitle = props.row.original.note.title;
        // Get the color class based on the value
        const colorClass = getColorForTitle(noteTitle);
        return (
          // className=" bg-red-400  text-white"
          // Access the nested value

          <Badge
            className={colorClass + " " + "flex w-12 justify-center text-white"}
          >
            {noteTitle}
          </Badge>
        );
      },
    },
    {
      accessorKey: "note",

      header: "UpdateAt",

      cell: ({ row }) => {
        const date: any = row.getValue("note");
        const formatted = date.updateAt.toLocaleDateString();

        return <div className=" font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
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
                  onClick={() => {
                    navigator.clipboard.writeText(question.questionTitle);
                    toast.success("You have copied this question title");
                  }}
                >
                  Copy Question Title
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setSelectedQuestion(question);
                    setShowAddEditQuestionDialog(true);
                  }}
                >
                  View Questions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => bookMarked(question.id)}>
                  Unbookmark this question
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
  // this is for auto-assigned different color to the tag

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
  // console.log(titleToColorMapping);
  return (
    <div>
      <DataTable columns={columns} data={flaggedQuestions} />
      {selectedQuestion && (
        <EditBookMarkedQuestion
          open={showAddEditQuestionDialog}
          setOpen={setShowAddEditQuestionDialog}
          question={selectedQuestion!}
        />
      )}
    </div>
  );
};

export default ShowModal;
