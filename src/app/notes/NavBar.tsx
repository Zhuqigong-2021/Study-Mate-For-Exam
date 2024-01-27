"use client";
import React, { useState } from "react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";

const NavBar = () => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <div className="z-10 bg-white p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href={"/notes"} className="flex items-center gap-1">
            <Image src={logo} alt="logo" width={40} height={40} />
            <span className="font-bold">FlowBran</span>
          </Link>
          <div className="flex items-center gap-2  font-semibold">
            <div className="hidden font-semibold lg:mr-5 lg:flex lg:space-x-5">
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
            </div>

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: { width: "2.5rem", height: "2.5rem" },
                },
              }}
            />
            <Button
              onClick={() => setShowAddEditNoteDialog(true)}
              className="scale-75"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>
      </div>

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
};

export default NavBar;
