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
  // questions?: Question[];
}

interface TimerValueSchema {
  timeValue: number;
}
export default function SetTimer({
  open,
  setOpen,
  noteToEdit,
  // questions,
}: AddEditNoteDialogProps) {
  const [timeValue, setTimeValue] = useState<number>(0);
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

  // }

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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={timeValue == 0}
              onClick={() => {
                if (localStorage.getItem("timer"))
                  localStorage.removeItem("timer");
              }}
            >
              <Link
                href={{
                  pathname: `/exam/${noteToEdit?.id}/ongoing`,
                  query: { timer: timeValue },
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
