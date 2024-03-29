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
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
type Note = {
  id: string;
  title: string;
  description: string;
  userId: string;
  isShared: boolean;
  createdAt: Date;
  updateAt: Date;
};
type allNotesProps = {
  allNotes: Note[];
  isAdmin: boolean;
};

const FilterNote = ({ allNotes, isAdmin }: allNotesProps) => {
  const [userInput, setUserInput] = useState("");
  const [link, setLink] = useState("/notes");
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
  //   useEffect(() => {
  //     if (userInput) {
  //       const change = allNotes.filter(
  //         (note) =>
  //           note.title.trim().toLowerCase() == userInput.toLowerCase().trim(),
  //       );
  //       console.log(change);
  //     }
  //   }, [userInput, allNotes]);
  // useEffect(() => {
  //   if (link) {
  //     router.push(link);
  //   }
  // }, [link, router]);
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
                className="absolute bottom-0 right-0 top-0 z-10 bg-white   px-3 text-black hover:text-white"
              >
                <Search size={25} />
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="mt-[24rem] flex flex-col">
        {isAdmin && (
          <div className="my-5 flex items-center justify-between">
            <span className=" font-bold">
              {pathname && pathname === "/notes" ? "My Notes" : "Public Notes"}
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

                  <div className="flex flex-col p-2">
                    <Link href="/notes/public">
                      <div className="flex items-center justify-between">
                        <span>public</span>{" "}
                        {pathname && pathname === "/notes/public" ? (
                          <Check size={15} />
                        ) : (
                          ""
                        )}
                      </div>
                    </Link>
                    <Link href="/notes">
                      <div className="flex items-center justify-between">
                        <span>my notes</span>{" "}
                        {pathname && pathname === "/notes" ? (
                          <Check size={15} />
                        ) : (
                          ""
                        )}
                      </div>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
          </div>
        )}
        <div className=" grid  gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selecedNotes.map((note) => (
            <Note note={note} key={note.id} isAdmin={isAdmin} />
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
