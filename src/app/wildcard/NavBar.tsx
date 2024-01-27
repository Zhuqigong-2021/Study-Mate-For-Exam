"use client";
import React, { useState } from "react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import Drawer from "@/components/Drawer";

const NavBar = () => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  // const pathname = usePathname();
  // console.log(pathname);

  return (
    <>
      <div className="bg-white p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href={"/notes"} className="flex items-center gap-1">
            <Image src={logo} alt="logo" width={40} height={40} />
            <span className=" font-bold">Study Mate</span>
          </Link>
          <div className="flex items-center gap-2 space-x-5 font-semibold">
            <div className="flex md:hidden lg:hidden xl:hidden">
              <Drawer />
            </div>

            <div className="hidden font-semibold md:flex md:space-x-5 lg:flex lg:space-x-5">
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
            <div className="hidden md:flex lg:flex xl:flex">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: { width: "2.5rem", height: "2.5rem" },
                  },
                }}
              />
            </div>
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
