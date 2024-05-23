"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Cookie from "js-cookie";
import Image from "next/image";
import { UserButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Circle, Crown, Globe, Leaf, Moon, Sun } from "lucide-react";
import AddEditNoteDialog from "@/components/Note/AddEditNoteDialog";
import Drawer from "./Drawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
} from "../ui/navigation-menu";
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
} from "../ui/dropdown-menu";

import { useTranslations } from "next-intl";
import { Link, redirect } from "@/navigation";
// import { Link, useRouter } from "@/navigation";
// import { Link, useRouter, redirect } from "../../navigation";
// import { setUserRole } from "@/app/admin/dashboard/_actions";
interface userType {
  userId: string;
  isAdmin: boolean;
}

const CommonNavbar = ({ userId, isAdmin }: userType) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [mode, setMode] = useState(false);
  const pathname = usePathname();
  const searchParam = useSearchParams();
  // alert(pathname);
  // console.log("pathname:" + pathname);
  // console.log("searchParam:" + searchParam);
  const pathParts = pathname.split("/");
  const [lang, setLang] = useState(Cookie.get("NEXT_LOCALE") ?? pathParts[1]);
  const router = useRouter();
  const [admin, setAdmin] = useState("");
  const { signOut } = useClerk();
  let isSuperAdmin = userId === "user_2aFBx8E20RdENmTS0CRlRej0Px4";

  const [isSticky, setIsSticky] = useState(false);
  const t = useTranslations("Navbar");

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks

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
    router.push(`/notes/public`);
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
      pathParts[1] = newLocale;
      // Change the locale
    }
    console.log(pathParts);
    // Join the parts back into a new path
    const newPath = pathParts.join("/");
    // alert(newPath);
    return newPath;
  }

  const setLocale = (locale: string) => {
    Cookie.set("NEXT_LOCALE", locale);
    const newURL = changeLocale(locale); // Sets the locale cookie
    router.push(newURL);
  };

  return (
    <>
      <div
        className={`bg-white p-4 shadow ${
          isSticky ? "fixed left-0 top-0 z-50 w-full" : ""
        }`}
      >
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 ">
          <Link
            href={`/notes/public`}
            className="flex items-center gap-1 space-x-2"
          >
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
            </span>
          </Link>

          {pathname !== `/en` &&
            pathname !== `/fr` &&
            !pathname.includes("sign-in") &&
            isClient && (
              <div className="flex flex-grow  justify-end lg:justify-center ">
                <NavigationMenu className="flex w-full ">
                  <NavigationMenuList className="flex w-full  items-center gap-2  font-semibold">
                    <NavigationMenuItem className="hidden  font-light   lg:flex ">
                      <NavigationMenuTrigger>
                        {t("getting-started.title")}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-50">
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[550px] lg:grid-cols-[.75fr_1fr]">
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
                                  {t("getting-started.photo.title")}
                                </div>
                                <p className="text-sm leading-tight text-gray-600 text-muted-foreground">
                                  {t("getting-started.photo.description")}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <ListItem
                            href={`/exam`}
                            title={t("getting-started.exam.title")}
                          >
                            {t("getting-started.exam.description")}
                          </ListItem>
                          <ListItem
                            href={`/report`}
                            title={t("getting-started.report.title")}
                          >
                            {t("getting-started.report.description")}
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem className="z-50  hidden  font-light  lg:flex ">
                      <NavigationMenuTrigger>
                        {t("taking-notes.title")}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
                          <ListItem
                            href={`/notes/public`}
                            title={t("taking-notes.notes.title")}
                          >
                            {t("taking-notes.notes.description")}
                          </ListItem>
                          <ListItem
                            href={`/wildcard`}
                            title={t("taking-notes.flashcard.title")}
                          >
                            {t("taking-notes.flashcard.description")}
                          </ListItem>

                          <ListItem
                            href={`/exam`}
                            title={t("taking-notes.exams.title")}
                          >
                            {t("taking-notes.exams.description")}
                          </ListItem>
                          <ListItem
                            href={`/review`}
                            title={t("taking-notes.review.title")}
                          >
                            {t("taking-notes.review.description")}
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {(isAdmin || admin) && (
                      <Link
                        href={`/admin/dashboard`}
                        className="hidden rounded-full bg-teal-50 p-2 shadow-inner  shadow-teal-500   lg:flex "
                      >
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

                    <NavigationMenuItem className="hidden  font-light   lg:flex ">
                      <NavigationMenuTrigger>
                        {t("operations.title")}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
                          <ListItem
                            href={`/bookmark`}
                            title={t("operations.bookmark.title")}
                          >
                            {t("operations.bookmark.description")}
                          </ListItem>
                          <ListItem
                            href={`${isAdmin || admin ? `/notes/edit` : "#"}`}
                            title={t("operations.edit-your-questions.title")}
                            onClick={() => {
                              if (isAdmin || admin) {
                                router.push(`/notes/edit`);
                              } else {
                                toast.error(
                                  t("operations.edit-your-questions.error"),
                                );
                              }
                            }}
                          >
                            {t("operations.edit-your-questions.description")}
                          </ListItem>

                          <ListItem
                            title={t("operations.add-a-note.title")}
                            onClick={() => {
                              if (isAdmin || admin) {
                                setShowAddEditNoteDialog(true);
                              } else {
                                toast.error(t("operations.add-a-note.error"));
                              }
                            }}
                          >
                            {t("operations.add-a-note.description")}
                          </ListItem>
                          <ListItem
                            href="#"
                            title={t("operations.pro-status.title")}
                          >
                            {isSuperAdmin && (
                              <div className="flex items-center space-x-2  py-2">
                                <div className=" flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500  to-violet-500 p-2">
                                  <Crown
                                    className="text-white"
                                    fill="#facc15"
                                  />
                                </div>
                                <div className="flex  flex-col justify-center space-y-0 text-xs">
                                  <span>
                                    {t(
                                      "operations.pro-status.superAdmin.greeting",
                                    )}
                                  </span>
                                  <span className=" space-x-2">
                                    <span>
                                      {t(
                                        "operations.pro-status.superAdmin.description",
                                      )}
                                    </span>
                                    <span className="rounded-md  bg-gradient-to-r from-indigo-500  to-violet-500 px-2 text-xs text-white ">
                                      {t(
                                        "operations.pro-status.superAdmin.role",
                                      )}
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
                                  <span>
                                    {t("operations.pro-status.admin.greeting")}
                                  </span>
                                  <span className=" space-x-2">
                                    <span>
                                      {t(
                                        "operations.pro-status.admin.description",
                                      )}
                                    </span>
                                    <span className="rounded-md  border border-yellow-400 px-1 text-xs text-yellow-400 ">
                                      {t("operations.pro-status.admin.role")}
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
                                  <span>
                                    {t("operations.pro-status.user.greeting")}
                                  </span>
                                  <span className=" space-x-2">
                                    <span>
                                      {t(
                                        "operations.pro-status.user.description",
                                      )}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem className="hidden  font-light   lg:flex ">
                      <NavigationMenuTrigger>
                        {t("about-us.title")}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul
                          className={`grid  gap-3 p-6 md:w-[400px] ${
                            isAdmin || admin ? "lg:w-[680px]" : "lg:w-[600px]"
                          } lg:grid-cols-[1fr_1fr]`}
                        >
                          <ListItem
                            href={`/bookmark`}
                            title={t("about-us.about.title")}
                          >
                            {t("about-us.about.description")}
                          </ListItem>
                          <ListItem title={t("about-us.contact-info.title")}>
                            {t("about-us.contact-info.description")}
                          </ListItem>

                          <ListItem title={t("about-us.statement.title")}>
                            {t("about-us.statement.description")}
                          </ListItem>
                          {(isAdmin || admin) && (
                            <ListItem
                              href={`/admin/dashboard`}
                              title={t("about-us.admin.title")}
                              className="shadow-sm shadow-violet-500 "
                            >
                              <span>{t("about-us.admin.description")}</span>
                            </ListItem>
                          )}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}

          {pathname !== `/en` &&
            pathname !== `/fr` &&
            !pathname.includes("sign-in") &&
            isClient && (
              <div className="flex ">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem className=" hidden xl:flex lg:flex">
                      {!mode && (
                        <Moon
                          size={23}
                          strokeWidth="1.5"
                          stroke="#57534e"
                          onClick={() => setMode((prev) => (prev = !prev))}
                        />
                      )}

                      {mode && (
                        <div
                          className="blur-1 h-[1.15rem]  w-[1.15rem]   rounded-full bg-gradient-to-t from-amber-400 to-amber-200 "
                          style={{ boxShadow: "0px 0px 18px #fef08a" }}
                          onClick={() => setMode(false)}
                        ></div>
                      )}
                    </NavigationMenuItem>

                    <NavigationMenuItem className="relative hidden px-3  xl:flex lg:flex">
                      <IoIosNotificationsOutline
                        size={28}
                        className="text-stone-700"
                      />
                      <div className="absolute right-[0.75rem] top-0 h-2 w-2 rounded-full bg-rose-500"></div>
                    </NavigationMenuItem>

                    <NavigationMenuItem className="hidden  xl:flex lg:flex">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: { width: "2rem", height: "2rem" },
                          },
                        }}
                      />
                    </NavigationMenuItem>

                    <NavigationMenuItem className="hidden   xl:flex lg:flex">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className=" ml-3 border-none p-0 outline-none hover:bg-transparent focus:border-none active:border-none"
                            size={"sm"}
                            variant="outline"
                          >
                            {lang == "en" && isClient && (
                              <Image
                                src={Canada}
                                alt={"canada"}
                                height={18}
                                width={28}
                                className="h-[1.15rem]  w-7 rounded-[2px]"
                              />
                            )}
                            {lang == "fr" && isClient && (
                              <Image
                                src={France}
                                alt={"france"}
                                height={18}
                                width={28}
                                className="h-[1.15rem] w-7 rounded-[2px]"
                              />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-4 w-14 -translate-x-8">
                          <DropdownMenuItem
                            className="flex w-full justify-between space-x-2"
                            onClick={() => {
                              setLang("en");

                              setLocale("en");
                              // () => router.replace(pathname);
                            }}
                          >
                            <Image
                              src={Canada}
                              alt={"canada"}
                              height={18}
                              width={26}
                              className="h-[0.85rem] w-auto rounded-[2px]"
                            />
                            <span>EN</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="flex w-full justify-between space-x-2"
                            // onClick={() => {
                            //   // setLang("fr");
                            //   // setLocale("fr");

                            // }}
                            onClick={() => {
                              setLang("fr");
                              setLocale("fr");
                              // router.replace("/fr/" + pathname);
                            }}
                          >
                            <Image
                              src={France}
                              alt={"france"}
                              height={18}
                              width={26}
                              className="h-[0.85rem]  rounded-[2px]"
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
                          <Link href={`/notes/public`}> registration</Link>
                        </Button>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenuItem className="flex  xl:hidden lg:hidden">
                  <Drawer isAdmin={isAdmin} userId={userId ?? ""} />
                </NavigationMenuItem>
              </div>
            )}
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
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface localeType {
  locale: string;
}
export function getStaticProps({ locale }: localeType) {
  return {
    props: {
      messages: {
        ...require(`../../../messages/${locale}.json`),
      },
    },
  };
}
