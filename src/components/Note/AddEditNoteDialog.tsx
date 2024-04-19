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
import { redirect, useRouter } from "next/navigation";
import { Note, Question } from "@prisma/client";
import { useState } from "react";
import { Router } from "next/router";
import { Button } from "../ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

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
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ id: noteToEdit.id, ...input }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "edit");
        }
        router.push(`/notes/${noteToEdit.id}`);
        //if (response.ok) redirect("/");
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "post");
        } else {
          form.reset();
          router.push("/notes");
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
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();

      setOpen(false);
      toast.success("You have just deleted a note !");
    } catch (error) {
      console.error(error);

      toast.error("This is not your note ! you can not delete other's note ");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && isAdmin && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete note
                </LoadingButton>
              )}
              {noteToEdit && (
                <Button asChild variant="outline">
                  <Link href={`/notes/${noteToEdit.id}/review `}>Review</Link>
                </Button>
              )}
              {isAdmin && (
                <LoadingButton
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={deleteInProgress}
                >
                  {noteToEdit ? "Update" : "Submit"}
                </LoadingButton>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
