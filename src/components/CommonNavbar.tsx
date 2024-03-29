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
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
interface userType {
  userId: string;
  isAdmin: boolean;
}
//const isAdmin = checkRole("admin");

const CommonNavbar = ({ userId, isAdmin }: userType) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { has } = useAuth();
  let isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";
  // console.log("has: " + );
  // const isAdmin = has && has({ role: "org:admin" });
  // if (!isAdmin) return null;
  // console.log(isAdmin);

  return (
    <>
      <div className=" bg-transparent p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link
            href={"/notes/public"}
            className="flex items-center gap-1 space-x-2"
          >
            {/* <Image src={logo} alt="logo" width={40} height={40} /> */}
            <Globe className="flex rotate-45 scale-110 text-teal-500" />
            <span className="scale-y-95 font-sans text-2xl font-black text-slate-800">
              Study Mate
            </span>
          </Link>
          <div className="flex items-center gap-2 space-x-5 font-semibold">
            <div className="flex  xl:hidden lg:hidden">
              <Drawer isAdmin={isAdmin} />
            </div>

            <div className="hidden  font-light  md:space-x-5 lg:flex lg:space-x-16">
              {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && (
                <Link
                  href="/admin/dashboard"
                  className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                >
                  admin
                </Link>
              )}
              <Link
                href="/notes/public"
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
              {/* {isAdmin && ( */}
              <Link
                href="/review"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                review
              </Link>
              {/* )} */}
              {/* <Link
                href="/bookmark"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                bookmark
              </Link> */}

              {isAdmin && isSuperAdmin && (
                <button
                  className="m-0 bg-transparent p-0"
                  onClick={() => router.refresh()}
                >
                  <Link
                    href="/bookmark"
                    className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                  >
                    bookmark
                  </Link>
                </button>
              )}
            </div>
            <div className="hidden md:flex xl:flex lg:flex">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: { width: "2.5rem", height: "2.5rem" },
                  },
                }}
              />
            </div>

            {pathname == "/notes/public" && isAdmin && (
              <Button
                onClick={() => setShowAddEditNoteDialog(true)}
                className="hidden scale-75 bg-teal-600 md:flex xl:flex lg:flex "
              >
                <Plus size={20} />
              </Button>
            )}
            {pathname === "/" && (
              //   bg-[#f3c46e]
              <Button
                className="hidden   rounded-full bg-white px-8  py-4 text-slate-800 hover:text-white lg:flex"
                asChild
              >
                <Link href="/notes/public"> registration</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default CommonNavbar;
