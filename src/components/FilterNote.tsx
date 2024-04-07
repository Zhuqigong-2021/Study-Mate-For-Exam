"use client";
import React, { useEffect, useState } from "react";
import Note from "./Note";
import { Check, Filter, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSchema, formSchema } from "@/lib/validation/note";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import Image from "next/image";
import Notebackground from "../assets/notesearch.png";
import NotFound from "../assets/NOTFOUNDFinal.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
type Note = {
  userId: string;
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    questionTitle: string;
    noteId: string;
    isFlagged: boolean;
    comment: string;
    choices: {
      id: string;
      content: string;
      answer: boolean;
    }[];
  }[];
  isShared: boolean;
  createdAt: Date;
  updateAt: Date;
};
type allNotesProps = {
  allNotes: Note[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

const FilterNote = ({ allNotes, isAdmin, isSuperAdmin }: allNotesProps) => {
  const [userInput, setUserInput] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const selecedNotes = !userInput
    ? allNotes
    : allNotes.filter((note) => {
        return (
          note.title
            .toLowerCase()
            .trim()
            .includes(userInput.toLowerCase().trim()) ||
          note.description
            .toLowerCase()
            .trim()
            .includes(userInput.toLowerCase().trim())
        );
      });
  const form = useForm<formSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchParam: "",
    },
  });
  function onSubmit(data: formSchema) {
    setUserInput(data.searchParam);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    // Register the event listener
    window.addEventListener("scroll", handleScroll);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div>
      <div className="absolute left-0 right-0 top-[4.6rem]   flex h-[24rem] w-full items-center justify-center bg-teal-500/40">
        <Image
          src={Notebackground}
          alt="note background"
          className=" absolute left-0 right-0   top-0 flex  h-[24rem] w-full items-center justify-center object-cover opacity-90 "
        />
        <div className="relative  mx-4 flex h-10 w-full justify-center  md:w-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="searchParam"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="search your note "
                        className=" absolute bottom-0 left-0 right-0 top-0  bg-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                // asChild
                className="absolute bottom-0 right-0 top-0 z-[1] bg-white   px-3 text-black hover:text-white"
              >
                <Search size={25} />
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className={`${isSticky ? "mt-[29.6rem]" : "mt-[25rem]"} bg-white`}>
        {isAdmin && (
          <div className="my-5 flex items-center justify-between">
            <span className=" font-bold">
              {pathname && pathname === "/notes"
                ? "My Notes"
                : pathname && pathname === "/notes/public"
                  ? "Public Notes"
                  : "All Notes"}
            </span>
            <DropdownMenu>
              <div className="flex flex-col items-end">
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter size={15} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-4 w-48  lg:mr-24">
                  <DropdownMenuLabel>Filter Notes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/notes/public")}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>public</span>{" "}
                      {pathname && pathname === "/notes/public" ? (
                        <Check size={15} />
                      ) : (
                        ""
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/notes")}>
                    <div className="flex w-full items-center justify-between">
                      <span>my notes</span>{" "}
                      {pathname && pathname === "/notes" ? (
                        <Check size={15} />
                      ) : (
                        ""
                      )}
                    </div>
                  </DropdownMenuItem>
                  {isSuperAdmin && (
                    <DropdownMenuItem onClick={() => router.push("/notes/all")}>
                      <div className="flex w-full items-center justify-between">
                        <span>all notes</span>{" "}
                        {pathname && pathname === "/notes/all" ? (
                          <Check size={15} />
                        ) : (
                          ""
                        )}
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
          </div>
        )}
        <div className=" grid  gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selecedNotes.map((note, index) => (
            <Note note={note} key={note.id} isAdmin={isAdmin} index={index} />
          ))}
          {selecedNotes.length === 0 && (
            <div className="col-span-full flex w-full flex-col items-center  justify-center text-center">
              <Image src={NotFound} alt="not found" />
              <span className="text-xl font-black text-red-500">No Result</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterNote;
