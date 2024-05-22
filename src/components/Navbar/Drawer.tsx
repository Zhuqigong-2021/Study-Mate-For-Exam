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
import Cookie from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Canada from "/public/canada.jpg";
import France from "/public/france.jpg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddEditNoteDialog from "../Note/AddEditNoteDialog";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
interface roleType {
  isAdmin: boolean;
  userId?: string;
}
const Drawer = ({ isAdmin, userId }: roleType) => {
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lang, setLang] = useState(Cookie.get("NEXT_LOCALE") ?? "en");
  const router = useRouter();
  const d = useTranslations("Drawer");
  useEffect(() => {
    setIsClient(true);
  }, []);
  function changeLocale(newLocale: string) {
    // Split the pathname into parts
    let url;
    if (searchParam) {
      url = pathname + "?" + searchParam;
    } else {
      url = pathname;
    }
    const pathParts = url.split("/");

    if (pathParts[1].match(/^[a-z]{2}$/)) {
      // This regex checks if the segment is a two-letter language code
      pathParts[1] = newLocale; // Change the locale
    }

    // Join the parts back into a new path
    const newPath = pathParts.join("/");

    return newPath;
  }
  const setLocale = (locale: string) => {
    Cookie.set("NEXT_LOCALE", locale);
    const newURL = changeLocale(locale); // Sets the locale cookie
    router.push(newURL);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="no-scrollbar overflow-y-scroll py-16 text-stone-600">
        <SheetHeader className="flex flex-col items-center">
          <SheetTitle>{d("title")}</SheetTitle>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: "2.5rem", height: "2.5rem" },
              },
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className=" border-none p-0 outline-none hover:bg-transparent focus:border-none active:border-none"
                size={"sm"}
                variant="outline"
              >
                {lang == "en" && isClient && (
                  <Image
                    src={Canada}
                    alt={"canada"}
                    height={18}
                    className="h-[1.15rem]  w-7 rounded-[2px]"
                  />
                )}
                {lang == "fr" && isClient && (
                  <Image
                    src={France}
                    alt={"france"}
                    height={18}
                    className="h-[1.15rem] w-7 rounded-[2px]"
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-4 w-14 ">
              <DropdownMenuItem
                className="flex w-full justify-between space-x-2"
                onClick={() => {
                  setLang("en");

                  setLocale("en");
                }}
              >
                <Image
                  src={Canada}
                  alt={"canada"}
                  height={18}
                  width={26}
                  className="h-[0.85rem] rounded-[2px]"
                />
                <span>EN</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex w-full justify-between space-x-2"
                onClick={() => {
                  setLang("fr");
                  setLocale("fr");
                }}
              >
                <Image
                  src={France}
                  alt={"france"}
                  height={18}
                  width={26}
                  className="h-[0.85rem] rounded-[2px]"
                />
                <span>FR</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetDescription className="max-w-48">
            {d("description")}
          </SheetDescription>
        </SheetHeader>
        <div className="absolute left-[50%] flex -translate-x-[50%] flex-col items-start space-y-8 py-10">
          {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && (
            <SheetClose asChild>
              <Link
                href={`/${lang}/admin/dashboard`}
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                {d("admin")}
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link
              href={`/${lang}/notes/public`}
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              {d("note")}
            </Link>
          </SheetClose>
          {isAdmin && (
            <SheetClose asChild>
              <Link
                href={`/${lang}/notes/edit`}
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                {d("edit")}
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link
              href={`/${lang}/wildcard`}
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              {d("flashcard")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={`/${lang}/report`}
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              {d("reports")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={`/${lang}/exam`}
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              {d("exam")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={`/${lang}/bookmark`}
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              {d("bookmark")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={`/${lang}/review`}
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              {d("review")}
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
