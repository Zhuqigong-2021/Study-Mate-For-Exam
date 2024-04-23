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
import AddEditNoteDialog from "./Note/AddEditNoteDialog";
import { Menu } from "lucide-react";
interface roleType {
  isAdmin: boolean;
  userId?: string;
}
const Drawer = ({ isAdmin, userId }: roleType) => {
  const pathname = usePathname();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="no-scrollbar overflow-y-scroll py-16 text-stone-600">
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
        <div className="absolute left-[50%] flex -translate-x-[50%] flex-col items-start space-y-8 py-10">
          {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && (
            <SheetClose asChild>
              <Link
                href="/admin/dashboard"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                Administration
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link
              href="/notes/public"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              Notes Taking
            </Link>
          </SheetClose>
          {isAdmin && (
            <SheetClose asChild>
              <Link
                href="/notes/edit"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                Edit Question
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link
              href="/wildcard"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              Flash Cards
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/report"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              Test Reports
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/exam"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              Evaluation
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/bookmark"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              Preservation
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/review"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              Recapitulation
            </Link>
          </SheetClose>

          {pathname.includes("/notes") && isAdmin && (
            <Button
              onClick={() => setShowAddEditNoteDialog(true)}
              className="translate-y-8"
            >
              Add a Note
            </Button>
          )}
          <AddEditNoteDialog
            open={showAddEditNoteDialog}
            setOpen={setShowAddEditNoteDialog}
            isAdmin={isAdmin}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
