"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import Drawer from "@/components/Drawer";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
interface userType {
  userId: string;
  isAdmin: boolean;
}
//const isAdmin = checkRole("admin");

const CommonNavbar = ({ userId, isAdmin }: userType) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  let isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";

  const [isSticky, setIsSticky] = useState(false);

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
    <>
      <div
        className={`bg-white p-4 shadow ${
          isSticky ? "fixed left-0 top-0 z-50 w-full" : ""
        }`}
      >
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link
            href={"/notes/public"}
            className="flex items-center gap-1 space-x-2"
          >
            {/* <Image src={logo} alt="logo" width={40} height={40} /> */}
            <Globe className=" hidden rotate-45 scale-110 text-teal-500 lg:block" />
            <span className="-translate-x-2 scale-y-95 font-sans text-xl font-black text-slate-800 md:translate-x-0 md:text-2xl lg:text-2xl">
              Study Mate
            </span>
          </Link>
          <NavigationMenu>
            {/* className="flex items-center gap-2 space-x-5 font-semibold" */}
            <NavigationMenuList className="flex items-center gap-2  font-semibold">
              <NavigationMenu className="hidden  font-light   lg:flex ">
                {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && (
                  <Link
                    href="/admin/dashboard"
                    className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Admin
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenu>

              <NavigationMenuItem className="hidden  font-light   lg:flex ">
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent className="z-50">
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-2">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline  outline-none focus:shadow-md"
                          href="/"
                          style={{
                            backgroundImage: `url(https://woodstoneseniorliving.com/wp-content/uploads/2021/07/sun-blog.png)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundBlendMode: "multiply",
                          }}
                        >
                          <div className="z-10 mb-2 mt-4 text-lg font-medium italic text-slate-900">
                            Study Mate
                          </div>
                          <p className="text-sm leading-tight text-gray-600 text-muted-foreground">
                            Beautifully designed study app for you to pass
                            mutiple choice questions exams.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/exam" title="Exam">
                      Taking Exams with all your input questions in proper
                      batch.
                    </ListItem>
                    <ListItem href="/review" title="Review">
                      Review questions by reading. when hovering ,you will know
                      the answer.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="flex xl:hidden lg:hidden ">
                <Drawer isAdmin={isAdmin} userId={userId ?? ""} />
              </NavigationMenuItem>
              <NavigationMenuItem className="z-50  hidden  font-light  lg:flex ">
                {/* {userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4" && (
                  <Link
                    href="/admin/dashboard"
                    className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      admin
                    </NavigationMenuLink>
                  </Link>
                )} */}
                <NavigationMenuTrigger>Taking Notes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
                    <ListItem href="/notes/public" title="Notes">
                      {`You can check other's notes and take exams with their notes`}
                    </ListItem>
                    <ListItem href="/wildcard" title="Flashcard">
                      Taking advantage of your down time , Review by cards
                    </ListItem>

                    <ListItem href="/exam" title="Exams">
                      {`You can take exams with notes in the system`}
                    </ListItem>
                    <ListItem href="/review" title="Review">
                      Taking advantage of your down time , Review by cards
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
                {/* <Link
                  href="/notes/public"
                  className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    note
                  </NavigationMenuLink>
                </Link>
                <Link
                  href="/wildcard"
                  className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    wildcard
                  </NavigationMenuLink>
                </Link>
                <Link
                  href="/exam"
                  className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    exam
                  </NavigationMenuLink>
                </Link>

                <Link
                  href="/review"
                  className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    review
                  </NavigationMenuLink>
                </Link> */}

                {/* <button
                  className="m-0 bg-transparent p-0"
                  onClick={() => router.refresh()}
                >
                  <Link
                    href="/bookmark"
                    className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      bookmark
                    </NavigationMenuLink>
                  </Link>
                </button> */}
              </NavigationMenuItem>

              <NavigationMenu className="hidden  font-light   lg:flex ">
                <Link
                  href="/bookmark"
                  className="underline-offset-1 hover:scale-105 hover:text-teal-700"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Bookmark
                  </NavigationMenuLink>
                </Link>
              </NavigationMenu>
              <NavigationMenuItem className="hidden md:flex xl:flex lg:flex">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: { width: "2.5rem", height: "2.5rem" },
                    },
                  }}
                />
              </NavigationMenuItem>
              {pathname == "/notes/public" && isAdmin && (
                <NavigationMenuItem>
                  <Button
                    onClick={() => setShowAddEditNoteDialog(true)}
                    className="hidden scale-75 bg-teal-600 md:flex xl:flex lg:flex "
                  >
                    <Plus size={20} />
                  </Button>
                </NavigationMenuItem>
              )}
              {pathname === "/" && (
                //   bg-[#f3c46e]
                <NavigationMenuItem>
                  <Button
                    className="hidden   rounded-full bg-white px-8  py-4 text-slate-800 hover:text-white lg:flex"
                    asChild
                  >
                    <Link href="/notes/public"> registration</Link>
                  </Button>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      {/* <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/admin/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Admin
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default CommonNavbar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
