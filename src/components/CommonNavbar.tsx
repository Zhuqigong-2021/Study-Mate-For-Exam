"use client";
import React, { useState } from "react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import Drawer from "@/components/Drawer";
import { usePathname } from "next/navigation";

const CommonNavbar = () => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="bg-white p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href={"/notes"} className="flex items-center gap-1 space-x-2">
            {/* <Image src={logo} alt="logo" width={40} height={40} /> */}
            <Globe className="flex rotate-45 scale-110 text-teal-500" />
            <span className="scale-y-95 font-sans text-2xl font-black text-slate-800">
              Study Mate
            </span>
          </Link>
          <div className="flex items-center gap-2 space-x-5 font-semibold">
            <div className="flex md:hidden lg:hidden xl:hidden">
              <Drawer />
            </div>

            <div className="hidden  font-light md:flex md:space-x-5 lg:flex lg:space-x-16">
              <Link
                href="/notes"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                note
              </Link>
              <Link
                href="/wildcard"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                wildcard
              </Link>
              <Link
                href="/exam"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                exam
              </Link>
              <Link
                href="/review"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                review
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
            {pathname == "/notes" && (
              <Button
                onClick={() => setShowAddEditNoteDialog(true)}
                className="hidden scale-75 bg-teal-600 md:flex lg:flex xl:flex"
              >
                <Plus size={20} />
              </Button>
            )}
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

export default CommonNavbar;