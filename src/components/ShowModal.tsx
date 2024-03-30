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
