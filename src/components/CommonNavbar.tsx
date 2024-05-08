"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import Image from "next/image";
import { UserButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Crown, Globe, Leaf, Plus } from "lucide-react";
import AddEditNoteDialog from "@/components/Note/AddEditNoteDialog";
import Drawer from "@/components/Drawer";
import { redirect, usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";

// import { setUserRole } from "@/app/admin/dashboard/_actions";
interface userType {
  userId: string;
  isAdmin: boolean;
}
//const isAdmin = checkRole("admin");

const CommonNavbar = ({ userId, isAdmin }: userType) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState("");
  const { signOut } = useClerk();
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

  function signOutUser() {
    router.refresh();
    signOut(() => router.push("/"));
  }

  useEffect(() => {
    pusherClient.subscribe("ban-user");
    pusherClient.bind(
      "user:banned",
      ({
        currentUserId,
        banned,
      }: {
        currentUserId: string;
        banned: boolean;
      }) => {
        if (currentUserId === userId && banned) {
          signOutUser();
        }
      },
    );
    return () => {
      pusherClient.unsubscribe("ban-user");
    };
  });

  useEffect(() => {
    pusherClient.subscribe("authorize");
    pusherClient.bind(
      "user:authorize",
      ({
        currentUserId,
        role,
      }: {
        currentUserId: string;
        role: string | null;
      }) => {
        if (currentUserId === userId) {
          setAdmin(role ? role : "");
        }
      },
    );
    return () => {
      pusherClient.unsubscribe("authorize");
    };
  });

  const redirectUser = useCallback(() => {
    router.push("/notes/public");
  }, [router]);
  useEffect(() => {
    pusherClient.subscribe("authorize");
    pusherClient.bind(
      "user:authorize",
      ({
        currentUserId,
        role,
      }: {
        currentUserId: string;
        role: string | null;
      }) => {
        if (currentUserId === userId) {
          if (!role) {
            redirectUser();
          }
        }
      },
    );
    return () => {
      pusherClient.unsubscribe("authorize");
    };
  }, [admin, redirectUser, userId]);

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

            <span className="relative flex scale-y-95 font-sans  text-2xl font-black text-slate-800  lg:text-2xl">
              Study Mate{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#14b8a6"
                // stroke="#0f766e"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-leaf absolute -right-1 -top-2 -z-10 rotate-12"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>{" "}
              {/* <Leaf
                color="red"
                className="absolute -right-2  top-0 text-teal-500"
              /> */}
            </span>
          </Link>
          {pathname !== "/" && !pathname.includes("sign-in") && (
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-2  font-semibold">
                <NavigationMenu className="hidden  font-light   lg:flex ">
                  {(isAdmin || admin) && (
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
                      <ListItem href="/report" title="Report">
                        Review all the history records of the exams that you
                        have taken
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="flex  xl:hidden lg:hidden">
                  <Drawer isAdmin={isAdmin} userId={userId ?? ""} />
                </NavigationMenuItem>
                <NavigationMenuItem className="z-50  hidden  font-light  lg:flex ">
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
                        You can review the whole note question by page
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

                <NavigationMenuItem className="hidden  font-light   lg:flex ">
                  <NavigationMenuTrigger>Operations</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
                      <ListItem href="/bookmark" title="Bookmark">
                        {`Check All bookmarked Questions with proof to review more efficiently`}
                      </ListItem>
                      <ListItem
                        href="/notes/edit"
                        title="Edit Your questions"
                        onClick={() => {
                          if (isAdmin || admin) {
                            router.push("/notes/edit");
                          } else {
                            toast.error(
                              "Sorry,You're not authroized to access this page",
                            );
                          }
                        }}
                      >
                        {`If you are admin, you're able to modify the question.`}
                      </ListItem>

                      <ListItem
                        // href="/notes"
                        title="Add a note "
                        onClick={() => {
                          if (isAdmin || admin) {
                            setShowAddEditNoteDialog(true);
                          } else {
                            toast.error(
                              "Sorry,You're not authroized to access this page",
                            );
                          }
                        }}
                      >
                        {`if You're admin,You're able to add note to the system`}
                      </ListItem>
                      <ListItem href="#" title="Pro Status">
                        {isSuperAdmin && (
                          <div className="flex items-center space-x-2  py-2">
                            <div className=" flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500  to-violet-500 p-2">
                              <Crown className="text-white" fill="#facc15" />
                            </div>
                            <div className="flex  flex-col justify-center space-y-0 text-xs">
                              <span>Congratulations!</span>
                              <span className=" space-x-2">
                                <span>{"You're A Pro"}</span>
                                <span className="rounded-md  bg-gradient-to-r from-indigo-500  to-violet-500 px-2 text-xs text-white ">
                                  Pro
                                </span>
                              </span>
                            </div>
                          </div>
                        )}
                        {(isAdmin || admin) && !isSuperAdmin && (
                          <div className="flex items-center space-x-2  py-2">
                            <div className=" flex h-8 w-8 items-center justify-center rounded-full  bg-yellow-50 p-2">
                              <Crown
                                className="scale-110 text-yellow-500"
                                fill="#facc15"
                                size={20}
                              />
                            </div>
                            <div className="flex  flex-col justify-center space-y-0 text-xs">
                              <span>Congratulations!</span>
                              <span className=" space-x-2">
                                <span>{"You're Admin"}</span>
                                <span className="rounded-md  border border-yellow-400 px-1 text-xs text-yellow-400 ">
                                  admin
                                </span>
                              </span>
                            </div>
                          </div>
                        )}

                        {!isAdmin && !admin && !isSuperAdmin && (
                          <div className="flex items-center space-x-2  py-2">
                            <div className=" flex h-8 w-8 items-center justify-center rounded-full  bg-stone-50 p-2">
                              <Crown
                                className="scale-110 text-stone-500"
                                fill="#a8a29e"
                                size={20}
                              />
                            </div>
                            <div className="flex  flex-col justify-center space-y-0 text-xs">
                              <span>Hi,there!</span>
                              <span className=" space-x-2">
                                <span>{"You're a normal user"}</span>
                                {/* <span className="rounded-md  border border-yellow-400 px-1 text-xs text-yellow-400 ">
                                admin
                              </span> */}
                              </span>
                            </div>
                          </div>
                        )}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
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
                {/* {pathname == "/notes/public" && isAdmin && (
                <NavigationMenuItem>
                  <Button
                    onClick={() => setShowAddEditNoteDialog(true)}
                    className="hidden scale-75 bg-teal-600 md:flex xl:flex lg:flex "
                  >
                    <Plus size={20} />
                  </Button>
                </NavigationMenuItem>
              )} */}
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
          )}
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
