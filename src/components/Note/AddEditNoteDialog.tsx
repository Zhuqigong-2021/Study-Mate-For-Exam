"use client";
import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "../ui/loading-button";
// import { redirect, useRouter } from "next/navigation";
import { Note, Question } from "@prisma/client";
import { useState } from "react";
import { Router } from "next/router";
import { Button } from "../ui/button";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
  isAdmin: boolean;
  // questions?: Question[];
}

export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
  isAdmin,
  // questions,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();
  const h = useTranslations("Homepage");
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      description: noteToEdit?.description || "",
    },
  });
  // console.log(questions);
  async function onSubmit(input: CreateNoteSchema) {
    //alert(JSON.stringify(input));
    try {
      if (noteToEdit) {
        const response = await fetch(`/api/notes`, {
          method: "PUT",
          body: JSON.stringify({ id: noteToEdit.id, ...input }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "edit");
        }
        router.push(`/notes/${noteToEdit.id}`);
      } else {
        const response = await fetch(`/api/notes`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "post");
        } else {
          form.reset();
          router.replace(`/notes`);
        }
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong. Please try again ");
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch(`/api/notes`, {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();

      setOpen(false);
      toast.success(h("note.toast.suc"));
    } catch (error) {
      console.error(error);

      toast.error(h("note.toast.err"));
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark:circle-sm-note ">
        <DialogHeader>
          <DialogTitle>
            {noteToEdit ? h("note.title.edit") : h("note.title.add")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{h("note.note-title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={h("note.title-placeholder")}
                      {...field}
                    />
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
                  <FormLabel>{h("note.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={h("note.description-placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && isAdmin && (
                <LoadingButton
                  variant="destructive"
                  className="hover:bg-red-500 dark:bg-transparent dark:text-red-400 dark:shadow-sm dark:shadow-red-400 dark:hover:bg-transparent dark:hover:text-red-100 dark:hover:shadow-md dark:hover:shadow-red-400"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  {h("note.delete")}
                </LoadingButton>
              )}
              {noteToEdit && (
                <Button
                  asChild
                  variant="outline"
                  className="dark:border-none dark:bg-background dark:text-teal-300 dark:shadow-sm dark:shadow-teal-200 dark:hover:bg-transparent dark:hover:text-teal-100 dark:hover:shadow-md dark:hover:shadow-teal-300"
                >
                  <Link href={`/notes/${noteToEdit.id}/review `}>
                    {h("note.review")}
                  </Link>
                </Button>
              )}
              {isAdmin && (
                <LoadingButton
                  type="submit"
                  className="dark:bg-transparent dark:text-green-300 dark:shadow-sm dark:shadow-green-300 dark:hover:bg-transparent dark:hover:text-green-200 dark:hover:shadow-md dark:hover:shadow-green-400"
                  loading={form.formState.isSubmitting}
                  disabled={deleteInProgress}
                >
                  {noteToEdit
                    ? h("note.action.update")
                    : h("note.action.submit")}
                </LoadingButton>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
