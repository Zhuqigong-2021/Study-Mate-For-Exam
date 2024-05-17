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
import { IoIosNotificationsOutline } from "react-icons/io";
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
import Canada from "/public/canada.jpg";
import France from "/public/france.jpg";
import Quebec from "/public/quebec.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";
// import { setUserRole } from "@/app/admin/dashboard/_actions";
interface userType {
  userId: string;
  isAdmin: boolean;
}
//const isAdmin = checkRole("admin");

const CommonNavbar = ({ userId, isAdmin }: userType) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [lang, setLang] = useState("en");

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
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 ">
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
              </svg>
              {/* <Leaf
                color="red"
                className="absolute -right-2  top-0 text-teal-500"
              /> */}
            </span>
          </Link>
          {/* {pathname !== "/" && !pathname.includes("sign-in") && (
            <div className="flex flex-grow border border-purple-700"> haha</div>
          )} */}
          {pathname !== "/" && !pathname.includes("sign-in") && (
            <div className="flex flex-grow  justify-end lg:justify-center ">
              <NavigationMenu className="flex w-full ">
                <NavigationMenuList className="flex w-full  items-center gap-2  font-semibold">
                  <NavigationMenuItem className="hidden  font-light   lg:flex ">
                    <NavigationMenuTrigger>
                      Getting started
                    </NavigationMenuTrigger>
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
                  </NavigationMenuItem>

                  {(isAdmin || admin) && (
                    <Link
                      href="/admin/dashboard"
                      className="hidden rounded-full bg-teal-50 p-2 shadow-inner  shadow-teal-500   lg:flex "
                    >
                      {/* <Leaf className="  text-teal-500" /> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#14b8a6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-leaf  rotate-12"
                      >
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                    </Link>
                  )}
                  <NavigationMenuItem className="flex  xl:hidden lg:hidden">
                    <Drawer isAdmin={isAdmin} userId={userId ?? ""} />
                  </NavigationMenuItem>

                  {/* <NavigationMenu className="hidden  font-light   lg:flex ">
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
                          Admin Dashboard
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenu> */}

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
                                </span>
                              </div>
                            </div>
                          )}
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="hidden  font-light   lg:flex ">
                    <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
                        <ListItem href="/bookmark" title="About">
                          {`Check All Website Features in the User Manual`}
                        </ListItem>
                        <ListItem title="Contact Info">
                          {`If you want to report a bug ,contact us phil.zhu3@gmail.com`}
                        </ListItem>

                        <ListItem
                          // href="/notes"
                          title="Statement"
                        >
                          {`This is a learning system designed to aid memory and self-evaluating, currently aimed at exams related to ServiceNow.`}
                        </ListItem>
                        {(isAdmin || admin) && (
                          <ListItem
                            href="/admin/dashboard"
                            title="Admin Portal"
                            className="shadow-sm shadow-violet-500 "
                          >
                            <span>{`This is the place to click into admin dashboard if you're admin`}</span>
                          </ListItem>
                        )}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="hidden px-3 md:flex xl:flex lg:flex">
                    <IoIosNotificationsOutline size={28} />
                  </NavigationMenuItem>

                  <NavigationMenuItem className="hidden md:flex xl:flex lg:flex">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: { width: "2rem", height: "2rem" },
                        },
                      }}
                    />
                  </NavigationMenuItem>

                  <NavigationMenuItem className="hidden  lg:flex">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="border-none outline-none focus:border-none active:border-none"
                          size={"sm"}
                          variant="outline"
                        >
                          {lang == "en" && (
                            <Image
                              src={Canada}
                              alt={"canada"}
                              height={18}
                              className="h-[1.15rem]  w-7 rounded-[2px]"
                            />
                          )}
                          {lang == "fr" && (
                            <Image
                              src={France}
                              alt={"france"}
                              height={18}
                              className="h-[1.15rem] w-7 rounded-[2px]"
                            />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mt-4 w-14 -translate-x-8">
                        <DropdownMenuItem
                          className="flex w-full justify-between space-x-2"
                          onClick={() => setLang("en")}
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
                          onClick={() => setLang("fr")}
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
                  </NavigationMenuItem>

                  {pathname === "/" && (
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
              </NavigationMenu> */}
            </div>
          )}

          {pathname !== "/" && !pathname.includes("sign-in") && (
            <div className="flex ">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative hidden px-3 md:flex xl:flex lg:flex">
                    <IoIosNotificationsOutline
                      size={28}
                      className="text-stone-700"
                    />
                    <div className="absolute right-[0.75rem] top-0 h-2 w-2 rounded-full bg-rose-500"></div>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="hidden md:flex xl:flex lg:flex">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: { width: "2rem", height: "2rem" },
                        },
                      }}
                    />
                  </NavigationMenuItem>

                  <NavigationMenuItem className="hidden  lg:flex">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="ml-3 border-none p-0 outline-none hover:bg-transparent focus:border-none active:border-none"
                          size={"sm"}
                          variant="outline"
                        >
                          {lang == "en" && (
                            <Image
                              src={Canada}
                              alt={"canada"}
                              height={18}
                              className="h-[1.15rem]  w-7 rounded-[2px]"
                            />
                          )}
                          {lang == "fr" && (
                            <Image
                              src={France}
                              alt={"france"}
                              height={18}
                              className="h-[1.15rem] w-7 rounded-[2px]"
                            />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mt-4 w-14 -translate-x-8">
                        <DropdownMenuItem
                          className="flex w-full justify-between space-x-2"
                          onClick={() => setLang("en")}
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
                          onClick={() => setLang("fr")}
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
                  </NavigationMenuItem>

                  {/* <NavigationMenuItem className="mx-3 hidden md:flex xl:flex lg:flex">
                    <Switch id="airplane-mode" className="scale-95" />
                  </NavigationMenuItem> */}
                  {pathname === "/" && (
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
