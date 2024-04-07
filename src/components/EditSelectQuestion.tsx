"use client";
import React, { useEffect } from "react";
import { QuestionType } from "./ExamNoteQuestion";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { FaRegTrashAlt } from "react-icons/fa";
import { Card } from "./ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Checkbox } from "./ui/checkbox";
interface questionDataProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: QuestionType;
}
const EditSelectQuestion = ({ open, setOpen, question }: questionDataProps) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    formState: { isSubmitting },
  } = useForm<UpdateQuestionSchema>({
    resolver: zodResolver(updateQuestionSchema),
    defaultValues: {
      id: question.id || "haha",
      questionTitle: question.questionTitle || "haha",
      isFlagged: question.isFlagged || false,
      //   choices: question.choices,
      choices: question.choices.map((choice) => {
        return {
          id: choice.id || "",
          content: choice.content || "",
          answer: choice.answer || false,
        };
      }),
      comment: question.comment || "",
    },
  });

  useEffect(() => {
    // Reset the form with new values whenever the `question` prop changes
    reset({
      id: question.id,
      questionTitle: question.questionTitle,
      isFlagged: question.isFlagged,
      choices: question.choices,
      comment: question.comment,
    });
  }, [question, reset]);
  // console.log(questions);
  async function onSubmit(input: UpdateQuestionSchema) {
    // alert(JSON.stringify(input));
    try {
      const response = await fetch("/api/question", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: input.id,
          questionTitle: input.questionTitle,
          choices: input.choices,
          comment: input.comment,
        }),
      });
      if (response.ok) {
        setOpen(false);
        toast.success("you successfully update this question");
        router.refresh();
      }
    } catch (error) {
      toast.error("Sorry you failed updating your question");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="no-scrollbar max-h-screen max-w-[700px] overflow-y-scroll px-8 ">
        <DialogHeader className="pb-3">
          <div className="pt-4"></div>
          <DialogTitle>
            <span className=" text-lg font-bold ">Update Your Question</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3  ">
          <div className="py-1"></div>
          <span className="text-[15px] font-bold">Question Title</span>
          <Textarea
            placeholder="Your question title"
            {...register("questionTitle")}
            aria-multiline={true}
          />
          <div className="py-1"></div>
          <span className="text-[15px] font-bold">Choices</span>
          <Card className="space-y-2 p-6">
            {question.choices.map((choice, i: number) => {
              let choiceLetter = String.fromCharCode(65 + i);
              return (
                <>
                  <div className="relative">
                    <span className="absolute -left-3 top-2 text-sm">
                      {choiceLetter}
                    </span>
                    <Textarea
                      defaultValue={1}
                      aria-multiline={true}
                      contentEditable={true}
                      placeholder="question choice"
                      {...register(`choices.${i}.content`)}
                    />

                    <Input
                      className="absolute -right-5 top-2 h-3 w-3 rounded border-gray-300 bg-gray-100  accent-black "
                      type="checkbox"
                      defaultChecked={choice.answer}
                      {...register(`choices.${i}.answer`)}
                    />
                  </div>
                </>
              );
            })}
          </Card>

          <div className="py-1"></div>
          <span className="text-[15px] font-bold">Comments</span>
          <Textarea
            placeholder="please give comments"
            {...register("comment")}
          />
          <DialogFooter>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              className="mt-4"
            >
              Save
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSelectQuestion;
