"use client";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuEye } from "react-icons/lu";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateNoteSchema,
  CreateQuestionSchema,
  createQuestionSchema,
} from "@/lib/validation/note";
import { idProps } from "@/app/notes/[id]/page";
import { number } from "zod";
import LoadingButton from "./ui/loading-button";

import { useRouter } from "next/navigation";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type FormValues = {
  id: string;
  questionTitle: string;
  choices: {
    // id?: string;
    content: string;
    answer: boolean;
  }[];
};
const CreateQuestion = ({ params }: idProps) => {
  const { id } = params;
  const router = useRouter();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      questionTitle: "",
      choices: [{ content: "", answer: false }],
    },
  });
  const { fields, append, prepend, remove } = useFieldArray({
    name: "choices",
    control,
    rules: {
      required: "Please append at least 1 choice",
    },
  });
  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      // id: id,
      questionTitle: "",
      choices: [
        {
          content: "",
          answer: false,
        },
      ],
    },
  });
  async function onSubmit(data: CreateQuestionSchema) {
    setIsFormSubmitting(true);
    try {
      const response = await fetch("/api/notes", {
        method: "PUT",
        body: JSON.stringify({
          id,
          // title: "CSA 123",
          // description: "OK",
          questions: [{ ...data }],
        }),
      });
      // router.reload();
      //console.log("isLoading : " + form.formState.isSubmitting);
      if (!response.ok) throw Error("Status code: " + response.status);
      toast.success("You have submitted this question");

      // form.reset({
      //   questionTitle: "",
      //   choices: [],
      // });
      reset();
      router.replace(window.location.pathname);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wront. Please try again .");
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create A New Question</CardTitle>
        <CardDescription>
          Create your next question in one-click. Click Submit when you finish
          !!!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <CardContent>
            <FormField
              control={control}
              name="questionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input your question"
                      // {...field}
                      {...register(`questionTitle`, {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="choices"
              render={({ field }) => (
                <>
                  <FormItem className="mt-4">
                    <FormLabel>Choices</FormLabel>
                    {fields.map((field, index) => {
                      return (
                        <section
                          key={field.id}
                          className="my-4 flex items-end space-x-2"
                        >
                          <label className="flex w-full flex-col">
                            <span>choice {index + 1}</span>
                            <Input
                              {...register(`choices.${index}.content`, {
                                required: true,
                              })}
                            />
                          </label>
                          <label className="flex flex-col items-center justify-center">
                            <Input
                              type="checkbox"
                              className="relative "
                              defaultChecked={false}
                              {...register(`choices.${index}.answer`)}
                            />
                          </label>

                          <FaRegTrashAlt
                            type="button"
                            className="mb-3 scale-105 text-red-500"
                            onClick={() => remove(index)}
                          />
                        </section>
                      );
                    })}

                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <button
              type="button"
              className="mt-4  flex h-10 w-10 items-center justify-center rounded-full bg-teal-400 text-white shadow-sm hover:opacity-95"
              onClick={() => {
                append({
                  content: " ",
                  answer: false,
                });
              }}
            >
              <IoMdAdd />
            </button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <LoadingButton
                className="via-green-700"
                type="submit"
                loading={isFormSubmitting}
                disabled={form.formState.isSubmitting}
              >
                {!isSubmitting && "Next"}
              </LoadingButton>
              <Button
                type="button"
                onClick={() => router.push(`/notes/${id}/edit`)}
              >
                <LuEye />
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateQuestion;
