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
import { idProps } from "@/app/[locale]/notes/[id]/page";
import { number } from "zod";
import LoadingButton from "./ui/loading-button";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

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
  const a = useTranslations("Homepage");
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

          questions: [{ ...data }],
        }),
      });

      if (!response.ok) throw Error("Status code: " + response.status);
      toast.success(a("add-question.toast.suc"));

      reset();
      router.replace(window.location.pathname);
      router.refresh();
    } catch (error) {
      // console.error(error);
      toast.error(a("add-question.toast.err"));
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Card className="dark:circle-sm-note mt-2 w-full">
      <CardHeader>
        <CardTitle>{a("add-question.title")}</CardTitle>
        <CardDescription>{a("add-question.description")}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <CardContent>
            <FormField
              control={control}
              name="questionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{a("add-question.question-title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={a("add-question.question-placeholder")}
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
                            <span>
                              {a("add-question.option")} {index + 1}
                            </span>
                            <Input
                              {...register(`choices.${index}.content`, {
                                required: true,
                              })}
                            />
                          </label>
                          <label className="flex flex-col items-center justify-center">
                            <Input
                              type="checkbox"
                              className="relative"
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
              className="mt-4  flex h-10 w-10 items-center justify-center rounded-full bg-teal-400 text-white shadow-sm hover:opacity-95 dark:bg-transparent dark:font-bold dark:text-teal-200 dark:shadow-md dark:shadow-teal-300 dark:hover:bg-teal-300 dark:hover:text-background dark:hover:shadow-teal-300"
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
              className="dark:bg-red-500 dark:bg-transparent dark:text-foreground dark:text-red-400 dark:shadow-md dark:shadow-red-500 dark:hover:bg-transparent dark:hover:shadow-lg dark:hover:shadow-red-500"
              variant="outline"
              onClick={() => {
                router.replace(`/notes/public`);
              }}
            >
              {a("add-question.cancel")}
            </Button>
            <div className="flex gap-2">
              <LoadingButton
                className="via-green-700 dark:bg-transparent dark:text-foreground dark:text-green-400 dark:shadow-md dark:shadow-green-400 dark:hover:bg-transparent dark:hover:text-background dark:hover:text-green-300 dark:hover:shadow-lg dark:hover:shadow-green-400"
                type="submit"
                loading={isFormSubmitting}
                disabled={form.formState.isSubmitting}
              >
                {!isSubmitting && a("add-question.next")}
              </LoadingButton>
              <Button
                type="button"
                className="dark:bg-transparent  dark:text-teal-400 dark:shadow-sm dark:shadow-teal-300 dark:hover:bg-transparent dark:hover:text-background dark:hover:text-teal-300 dark:hover:shadow-lg dark:hover:shadow-teal-300"
                onClick={() => router.replace(`/review/${id}`)}
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
