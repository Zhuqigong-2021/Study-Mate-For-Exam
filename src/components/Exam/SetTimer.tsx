"use client";
import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { RiTimerLine, RiBookmarkLine } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa6";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { usePathname } from "next/navigation";
import { time } from "console";

import Cookie from "js-cookie";
import { useTranslations } from "next-intl";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
  questions?: Question[];
}

interface TimerValueSchema {
  timeValue: number;
}
export default function SetTimer({
  open,
  setOpen,
  noteToEdit,
  questions,
}: AddEditNoteDialogProps) {
  const [timeValue, setTimeValue] = useState<number>(0);
  const [batchValue, setBatchValue] = useState<number | string>(-1);
  const [error, setError] = useState("");

  const e = useTranslations("Exam");
  const divideIntoBatches = (questionsCopy: any, batchSize: number) => {
    const batches: any[] = [];

    // If there's only one question or less than a batch size, just return a single batch.
    if (questionsCopy.length <= batchSize) {
      return [questionsCopy];
    }

    for (let i = 0; i < questionsCopy.length; i += batchSize) {
      // If adding another batch doesn't exceed the total questions, push this batch
      if (i + batchSize < questionsCopy.length) {
        batches.push(questionsCopy.slice(i, i + batchSize));
      } else {
        // If we're at the end and there's less than a full batch left, add all remaining questions to the last batch
        // This is either going to be the only batch, or it's going to be added to the previous batch in the array
        const remainingQuestions = questionsCopy.slice(i, questionsCopy.length);
        if (batches.length === 0) {
          // If no batches have been added, this is the only batch
          batches.push(remainingQuestions);
        } else {
          // If there are already batches, add remaining questions to the last batch
          batches[batches.length - 1] =
            batches[batches.length - 1].concat(remainingQuestions);
        }
        break; // No more batches after this
      }
    }

    return batches;
  };
  const questionsBatches = divideIntoBatches(questions, 60);
  const keys = [
    "30s",
    "05min",
    "10min",
    "15min",
    "20min",
    "30min",
    "60min",
    "90min",
    "2h",
  ] as const;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark:circle-sm-exam dark:border-none">
        <DialogHeader>
          <DialogTitle>{e("timer.title")}</DialogTitle>
        </DialogHeader>

        <Card className="w-full dark:border-none">
          <CardHeader>
            <CardTitle>{e("timer.card-title")}</CardTitle>
            <CardDescription>{e("timer.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">{e("timer.name")}</Label>

                <div className="flex   ">
                  <div className="flex  items-center space-x-1 rounded-sm bg-red-500 px-2 text-sm text-white">
                    <RiBookmarkLine />
                    <span>{noteToEdit?.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework" className="mb-2 flex space-x-1">
                  <span>{e("timer.action.timer.title")}</span> <RiTimerLine />
                </Label>
                <Select onValueChange={(value) => setTimeValue(Number(value))}>
                  <SelectTrigger id="framework">
                    <SelectValue
                      placeholder={e("timer.placeholder")}
                      className="border-transparent focus:border-transparent focus:ring-0"
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {/* <SelectItem value="30000">30 s</SelectItem>
                    <SelectItem value="300000">05 min</SelectItem>
                    <SelectItem value="600000">10 min</SelectItem>
                    <SelectItem value="900000">15 min</SelectItem>
                    <SelectItem value="1200000">20 min</SelectItem>
                    <SelectItem value="1800000">30 min</SelectItem>
                    <SelectItem value="3600000">60 min</SelectItem>
                    <SelectItem value="5400000">1.5 h</SelectItem>
                    <SelectItem value="7200000">2 h</SelectItem> */}
                    {keys.map((key) => {
                      return (
                        <SelectItem
                          key={key}
                          value={e(`timer.action.timer.option.${key}.value`)}
                        >
                          {e(`timer.action.timer.option.${key}.title`)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {error && (
                  <div className="text-red-500">
                    {e("timer.action.timer.err")}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework1" className="mb-2 flex space-x-1">
                  <span>{e("timer.action.batch.title")}</span> <FaLayerGroup />
                </Label>
                <Select onValueChange={(value) => setBatchValue(Number(value))}>
                  <SelectTrigger id="framework1">
                    <SelectValue
                      placeholder={e("timer.placeholder")}
                      className="border-transparent focus:border-transparent focus:ring-0"
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {/* value={`${questions?.length}`} */}
                    {questionsBatches &&
                      questionsBatches.map((batch, index) => {
                        return (
                          <SelectItem value={`${index}`} key={index}>
                            {e("timer.action.batch.batch")} {index + 1} (
                            {batch.length})
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>

                {error && (
                  <div className="text-red-500">
                    {e("timer.action.batch.batch")}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="dark:bg-red-500 dark:bg-transparent dark:text-foreground dark:text-red-400 dark:shadow-md dark:shadow-red-500 dark:hover:bg-transparent dark:hover:shadow-lg dark:hover:shadow-red-500"
            >
              {e("timer.action.cancel")}
            </Button>
            <Button
              disabled={timeValue == 0 || batchValue == -1}
              className="dark:border-none dark:bg-transparent dark:text-teal-300 dark:shadow-md dark:shadow-teal-300 dark:hover:bg-background dark:hover:text-teal-200 dark:hover:shadow-lg dark:hover:shadow-teal-300"
              onClick={() => {
                if (localStorage.getItem("timer"))
                  localStorage.removeItem("timer");
              }}
            >
              <Link
                href={{
                  pathname: `/exam/${noteToEdit?.id}/ongoing`,
                  query: {
                    timer: timeValue,
                    batch:
                      batchValue === "all"
                        ? questions?.length.toString()
                        : batchValue.toString(),
                  },
                }}
              >
                {e("timer.action.confirm")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
