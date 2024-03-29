"use client";
import React from "react";
import { QuestionType } from "./ExamNoteQuestion";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";

import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdateQuestionSchema,
  updateQuestionSchema,
} from "@/lib/validation/note";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { Input } from "./ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface questionDataProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: QuestionType;
}
const EditBookMarkedQuestion = ({
  open,
  setOpen,
  question,
}: questionDataProps) => {
  const router = useRouter();
  const form = useForm<UpdateQuestionSchema>({
    resolver: zodResolver(updateQuestionSchema),
    defaultValues: {
      id: question.id || "haha",
      questionTitle: question.questionTitle || "haha",
      isFlagged: question.isFlagged || false,

      choices: question.choices,
      comment: question.comment || "",
    },
  });
  // console.log(questions);
  async function onSubmit(input: UpdateQuestionSchema) {
    try {
      if (question.comment === input.comment) {
        toast.error("Comment do not change");
        return;
      }
      const response = await fetch("/api/question", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: input.id,
          comment: input.comment,
        }),
      });
      if (response.ok) {
        setOpen(false);
        toast.success("you successfully add a comment");
      }
    } catch (error) {}
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="py-4"></div>
          <DialogTitle>
            <span className="text-xl font-bold ">{question.questionTitle}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="my-4">
          {question.choices.map((choice, index) => {
            let choiceLetter = String.fromCharCode(65 + index);
            return (
              <div
                key={choice.id}
                className={`mb-2 rounded-sm border border-slate-200 px-2 py-1 ${
                  choice.answer ? "bg-teal-200" : "bg-white"
                }`}
              >
                {choiceLetter}. {choice.content}
              </div>
            );
          })}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3  ">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea placeholder="please give comments" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                className="mt-4"
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookMarkedQuestion;
