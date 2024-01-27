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
import { usePathname } from "next/navigation";
import { RiGlobalLine } from "react-icons/ri";
const NavBar = () => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const pathname = usePathname();
  //   console.log(pathname);

  return (
    <>
      <div className="absolute left-0 right-0 top-0 -z-10 bg-[rgba(255,255,255,0.15)] p-4 shadow-sm">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 ">
          <Link href={"/notes"} className="flex items-center gap-2">
            {/* <Image src={logo} alt="logo" width={40} height={40} /> */}
            <RiGlobalLine className="rotate-45 scale-150 rounded-full  font-bold text-teal-500 shadow-sm" />
            <span className="scale-y-95 font-sans text-2xl font-black text-slate-800">
              Study Mate
            </span>
          </Link>
          <div className="flex items-center gap-2 space-x-5 font-semibold">
            <div className="flex md:hidden lg:hidden xl:hidden">
              <Drawer />
            </div>

            <div className="hidden items-center font-light md:flex md:space-x-5 lg:flex lg:space-x-20">
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

              {pathname === "/" && (
                //   bg-[#f3c46e]
                <Button
                  className="rounded-full   bg-white px-8 py-4  text-slate-800 hover:text-white"
                  asChild
                >
                  <Link href="/notes"> registration</Link>
                </Button>
              )}
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
