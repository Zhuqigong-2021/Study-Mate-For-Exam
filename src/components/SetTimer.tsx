"use client";
import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { RiTimerLine, RiBookmarkLine } from "react-icons/ri";

import {
  Dialog,
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
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "./ui/loading-button";
import { redirect, useRouter } from "next/navigation";
import { Note, Question } from "@prisma/client";
import { useState } from "react";
import { Router } from "next/router";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { usePathname } from "next/navigation";
import { time } from "console";
import toast from "react-hot-toast";

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
  // const router = useRouter();

  // const form = useForm<TimerValueSchema>({
  //   resolver: zodResolver(createNoteSchema),
  //   defaultValues: {
  //     timeValue: 0,
  //   },
  // });
  // // console.log(questions);
  // async function onSubmit(input: TimerValueSchema) {
  //   alert(JSON.stringify(input));

  // let batch = 60;
  // let totalBatch: number = 0;
  // if (questions) {
  //   if (questions?.length / batch == 0) {
  //     totalBatch = 1;
  //   } else {
  //     totalBatch = Math.floor(questions.length / batch);
  //   }
  //   return totalBatch;
  // }

  // Function to divide the questions array into batches
  // const divideIntoBatches = (questionsCopy: any, batchSize: number) => {
  //   // const batches = [];
  //   // for (let i = 0; i < questionsCopy.length; i += batchSize) {
  //   //   batches.push(questionsCopy.slice(i, i + batchSize));
  //   // }
  //   // return batches;
  //   const batches: (string | any[])[] = [];
  //   for (let i = 0; i < questionsCopy.length; i += batchSize) {
  //     // If it's the last batch and adding the next batch won't exceed the length of questions
  //     if (
  //       i + batchSize >= questionsCopy.length &&
  //       questionsCopy.length % batchSize < batchSize &&
  //       questionsCopy.length % batchSize !== 0
  //     ) {
  //       // Merge the last two batches
  //       batches[batches.length - 1] = batches[batches.length - 1].concat(
  //         questionsCopy.slice(i, questionsCopy.length),
  //       );
  //     } else {
  //       batches.push(questionsCopy.slice(i, i + batchSize));
  //     }
  //   }
  //   return batches;
  // };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Timer</DialogTitle>
        </DialogHeader>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Exam Topic</CardTitle>
            <CardDescription>Start your exam in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>

                <div className="flex   ">
                  <div className="flex  items-center space-x-1 rounded-sm bg-red-500 px-2 text-sm text-white">
                    <RiBookmarkLine />
                    <span>{noteToEdit?.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework" className="mb-2 flex space-x-1">
                  <span>Set your timer</span> <RiTimerLine />
                </Label>
                <Select onValueChange={(value) => setTimeValue(Number(value))}>
                  <SelectTrigger id="framework">
                    <SelectValue
                      placeholder="Select"
                      className="border-transparent focus:border-transparent focus:ring-0"
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="30000">30 s</SelectItem>
                    <SelectItem value="300000">05 min</SelectItem>
                    <SelectItem value="600000">10 min</SelectItem>
                    <SelectItem value="900000">15 min</SelectItem>
                    <SelectItem value="1200000">20 min</SelectItem>
                    <SelectItem value="1800000">30 min</SelectItem>
                    <SelectItem value="3600000">60 min</SelectItem>
                    <SelectItem value="5400000">1.5 h</SelectItem>
                    <SelectItem value="7200000">2 h</SelectItem>
                  </SelectContent>
                </Select>

                {error && (
                  <div className="text-red-500">
                    You have not set your timer
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework1" className="mb-2 flex space-x-1">
                  <span>Set your batch</span> <RiTimerLine />
                </Label>
                <Select onValueChange={(value) => setBatchValue(Number(value))}>
                  <SelectTrigger id="framework1">
                    <SelectValue
                      placeholder="Select"
                      className="border-transparent focus:border-transparent focus:ring-0"
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {/* value={`${questions?.length}`} */}
                    {questionsBatches &&
                      questionsBatches.map((batch, index) => {
                        return (
                          <SelectItem value={`${index}`} key={index}>
                            batch {index + 1} ({batch.length})
                          </SelectItem>
                        );
                      })}
                    {/* {`${questions?.length}`} */}
                    <SelectItem value="All">
                      All Questions ({`${questions?.length}`})
                    </SelectItem>
                  </SelectContent>
                </Select>

                {error && (
                  <div className="text-red-500">
                    You have not set your timer
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={timeValue == 0 || batchValue == -1}
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
                Confirm
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
//    <Form {...form}>
//      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
//        <FormField
//          control={form.control}
//          name="title"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel className="mb-3 mt-6 flex space-x-1">
//                Exam Topic
//              </FormLabel>
//              <p className="inline-flex items-center space-x-1 rounded-sm bg-red-500 px-2 text-sm text-white ">
//                <RiBookmarkLine />
//                <span>{noteToEdit?.title}</span>
//              </p>
//            </FormItem>
//          )}
//        />

//        <FormField
//          control={form.control}
//          name="description"
//          render={({ field }) => (
//            <FormItem>
//              <Label htmlFor="framework" className="mb-4 mt-6 flex gap-x-1">
//                <span>Timer Count Down</span> <RiTimerLine />
//              </Label>
//              <Select>
//                <SelectTrigger id="framework">
//                  <SelectValue placeholder="Select" />
//                </SelectTrigger>
//                <SelectContent
//                  position="popper"
//                  className="text-center"
//                  {...field}
//                >
//                  <SelectItem value="300000">05 min</SelectItem>
//                  <SelectItem value="600000">10 min</SelectItem>
//                  <SelectItem value="900000">15 min</SelectItem>
//                  <SelectItem value="1200000">20 min</SelectItem>
//                  <SelectItem value="1800000">30 min</SelectItem>
//                  <SelectItem value="3600000">60 min</SelectItem>
//                  <SelectItem value="5400000">1.5 h</SelectItem>
//                  <SelectItem value="7200000">2 h</SelectItem>
//                </SelectContent>
//              </Select>
//              <FormMessage />
//            </FormItem>
//          )}
//        />

//        <DialogFooter className="mt-4 gap-1 pt-5 sm:gap-0">
//          {noteToEdit && (
//            <Button
//              variant="destructive"
//              //   loading={deleteInProgress}
//              //   disabled={form.formState.isSubmitting}
//              onClick={() => setOpen(false)}
//              type="button"
//            >
//              Cancel
//            </Button>
//          )}
//          {noteToEdit && (
//            <Button asChild variant="outline">
//              <Link href={`/notes/${noteToEdit.id}/review `}>Review</Link>
//            </Button>
//          )}
//          <LoadingButton
//            type="submit"
//            loading={form.formState.isSubmitting}
//            disabled={deleteInProgress}
//          >
//            Confirm
//          </LoadingButton>
//        </DialogFooter>
//      </form>
//    </Form>;
