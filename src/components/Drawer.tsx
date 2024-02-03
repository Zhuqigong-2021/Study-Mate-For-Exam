"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { usePathname } from "next/navigation";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { Menu } from "lucide-react";
const Drawer = () => {
  const pathname = usePathname();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-col items-center">
          <SheetTitle>Edit profile</SheetTitle>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: "2.5rem", height: "2.5rem" },
              },
            }}
          />
          <SheetDescription className="max-w-48">
            {"Make changes to your profile by clicking the icon above"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center space-y-10 py-10">
          <Link
            href="/notes"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            Note
          </Link>
          <Link
            href="/wildcard"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            Wildcard
          </Link>
          <Link
            href="/exam"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            Exam
          </Link>
          <Link
            href="/review"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            Review
          </Link>

          <Link
            href="/bookmark"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            Bookmark
          </Link>

          {pathname.includes("/notes") && (
            <Button
              onClick={() => setShowAddEditNoteDialog(true)}
              className=" "
            >
              Add a Note
            </Button>
          )}
          <AddEditNoteDialog
            open={showAddEditNoteDialog}
            setOpen={setShowAddEditNoteDialog}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
