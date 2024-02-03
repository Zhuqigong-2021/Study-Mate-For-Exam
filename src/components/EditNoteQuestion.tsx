"use client";
import { Choice, Note, Question } from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  createNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { NoteType } from "./EditNote";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import Link from "next/link";

interface questionDataProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit: NoteType;
}
const EditNoteQuestion = ({
  open,
  setOpen,
  noteToEdit,
  // questionsToEdit,
}: questionDataProps) => {
  const router = useRouter();
  const [currentNote, setCurrentNote] = useState(noteToEdit);

  const form = useForm<NoteType>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      id: noteToEdit?.id || "",
      title: noteToEdit?.title || "",
      description: noteToEdit?.description || "",
      questions:
        noteToEdit?.questions.map((question) => ({
          id: question.id || "haha",
          questionTitle: question.questionTitle || "", // Set default value based on existing questionTitle
          comment: question.comment || "",
          isFlagged: question.isFlagged || false,
          choices: question.choices.map((choice) => ({
            id: choice.id || "",
            content: choice.content || "",
            answer: choice.answer || false,
          })),
        })) || [],
    },
  });

  async function onSubmit(input: UpdateNoteSchema) {
    //alert(JSON.stringify(input));
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ ...input }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "edit");
        }

        toast.success("A record is updated successfully");
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok)
          throw Error("Status code: " + response.status + "post");
        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong. Please try again ");
    }
  }
  const deleteChoice = async (choiceId: string | undefined) => {
    try {
      if (choiceId) {
        console.log(choiceId);
        const response = await fetch("/api/choice", {
          method: "DELETE",
          body: JSON.stringify({ choiceId }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "delete");
        }
        setOpen(false);
        router.refresh();
        toast.success("you have successfully deleted a choice");
      }
    } catch (error) {
      console.error(error);
      alert("something went wrong. Please try again ");
    }
  };

  const deleteQuestion = async (questionId: string | undefined) => {
    try {
      if (questionId) {
        console.log(questionId);
        const response = await fetch("/api/question", {
          method: "DELETE",
          body: JSON.stringify({ questionId }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "delete");
        }
        setOpen(false);
        router.refresh();
        toast.success(
          "you have successfully deleted a question with all the choices",
        );
      }
    } catch (error) {
      console.error(error);
      alert("something went wrong. Please try again ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen max-w-[800px] overflow-y-scroll py-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3  px-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel className="mt-4">Questions</FormLabel>
            {noteToEdit.questions.map((question, index) => (
              <FormField
                key={question.id}
                control={form.control}
                name={`questions.${index}`}
                render={({ field }) => {
                  return (
                    <FormField
                      control={form.control}
                      name={`questions.${index}.questionTitle`}
                      render={({ field }) => {
                        return (
                          <>
                            <FormItem
                              className="relative rounded-md border border-teal-600 shadow shadow-gray-500"
                              {...field}
                            >
                              <FormControl>
                                <Input
                                  placeholder="question title"
                                  {...field}
                                />
                              </FormControl>
                              <FaRegTrashAlt
                                className="absolute -right-6 top-0 text-red-400"
                                onClick={() => {
                                  deleteQuestion(question.id);
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                            {noteToEdit.questions[index].choices.map(
                              (choice, i: number) => {
                                return (
                                  <FormField
                                    key={choice.id}
                                    control={form.control}
                                    name={`questions.${index}.choices.${i}.content`}
                                    render={({ field }) => {
                                      // console.log(field);
                                      return (
                                        <FormItem className="relative">
                                          <FormControl>
                                            <Input
                                              placeholder="question choice"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FaRegTrashAlt
                                            className="absolute -right-6 top-0 text-red-400"
                                            onClick={() => {
                                              deleteChoice(choice.id);
                                            }}
                                          />
                                          <FormMessage />
                                        </FormItem>
                                      );
                                    }}
                                  />
                                );
                              },
                            )}
                          </>
                        );
                      }}
                    />
                  );
                }}
              />
            ))}
            {noteToEdit.questions.length === 0 && (
              <div className="font-bold text-red-500">
                You have no question for the time beiing{" "}
              </div>
            )}

            <DialogFooter className="gap-1 pt-8 sm:gap-0">
              <Button asChild className="bg-teal-600 text-white">
                <Link href={`/notes/${noteToEdit.id}`}>Add question</Link>
              </Button>
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                // disabled={deleteInProgress}
              >
                {noteToEdit ? "Update" : "Submit"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteQuestion;
