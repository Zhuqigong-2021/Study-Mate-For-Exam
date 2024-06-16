"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import {
  Divide,
  Leaf,
  Mail,
  Package2,
  Search,
  Send,
  Star,
  Trash2,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Panel, PanelResizeHandle } from "react-resizable-panels";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Span } from "next/dist/trace";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../ui/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "./multi-select";
import { User } from "@clerk/nextjs/server";
import { sendNotification } from "@/app/[locale]/action";
import toast from "react-hot-toast";
import { InAppSchema, inAppSchema } from "@/lib/validation/note";
import NotificationCard from "./NotificationCard";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "../ui/badge";

interface notificationProps {
  usersList: User[];
}

const Notification = ({ usersList }: notificationProps) => {
  const [currentTab, setCurrentTab] = useState<string>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [tags, setTags] = useState(["new", "important", "move", "exam"]);
  const [isCompact, setIsCompact] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState(200);
  const { theme, setTheme } = useTheme();
  const [inAppLoading, setInAppLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const form = useForm<InAppSchema>({
    resolver: zodResolver(inAppSchema),
    defaultValues: {
      time: new Date().toISOString(),
      link: "",
      subject: "",
      description: "",
      frameworks: [],
      tag: [],
    },
  });

  const emailForm = useForm<any>({
    defaultValues: {
      time: new Date().toISOString(),
      subject: "",
      message: "",
      frameworks: [],
    },
  });
  //   const frameworksList = [
  //     {
  //       value: "next.js",
  //       label: "Next.js",
  //     },
  //     {
  //       value: "sveltekit",
  //       label: "SvelteKit",
  //     },
  //     {
  //       value: "nuxt.js",
  //       label: "Nuxt.js",
  //     },
  //     {
  //       value: "remix",
  //       label: "Remix",
  //     },
  //     {
  //       value: "astro",
  //       label: "Astro",
  //     },
  //   ];

  const frameworksList = usersList.map((user) => {
    return {
      value: user.id,
      label: user.firstName
        ? user.firstName + " " + user.emailAddresses[0].emailAddress
        : "no name" + " " + user.emailAddresses[0].emailAddress,
    };
  });

  const tagsList = tags.map((tag) => {
    return {
      value: tag,
      label: tag,
    };
  });
  const receipients = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admin" },
    ...frameworksList,
  ];

  //   console.log(usersList);
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const sidebarElement = sidebarRef.current;

    const handleResize = (entries: any) => {
      for (let entry of entries) {
        setIsCompact(entry.contentRect.width < 140); // Adjust the width threshold as needed
      }
      setPanelWidth(entries[0].contentRect.width);
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (sidebarElement) {
      resizeObserver.observe(sidebarElement);
    }

    return () => {
      if (sidebarElement) {
        resizeObserver.unobserve(sidebarElement);
      }
    };
  }, []);

  //   useEffect(() => {
  //     // Force the width based on isCompact state
  //     if (isCompact) {
  //       setPanelWidth(50);
  //     } else {
  //       setPanelWidth(200);
  //     }
  //   }, [isCompact]);
  //   const sendUsersInAppNotification = async () => {
  //     const response = await sendNotification();
  //     console.log(response);
  //   };
  async function onSubmit(input: InAppSchema) {
    alert(JSON.stringify(input));
    try {
      // setInAppLoading(true);
      // const response: any = await sendNotification(input);
      // if (response) {
      //   toast.success("Notification has been sent successfully");
      //   setInAppLoading(false);
      //   form.reset();
      // }
    } catch (error) {
      toast.error("Internal Error");
      setInAppLoading(false);
    }
  }

  async function onSubmitEmail(input: any) {
    alert(JSON.stringify(input));
    try {
    } catch (error) {}
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex w-full flex-grow "
    >
      <ResizablePanel
        defaultSize={18}
        maxSize={20}
        className={`hidden  ${
          !isCompact ? "transition-all duration-300 ease-in-out" : ""
        } md:block`}
        collapsible={true}
        collapsedSize={4}
        minSize={16}
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={7} minSize={7} maxSize={7}>
            <div
              ref={sidebarRef}
              className="flex h-full flex-grow items-center justify-center border bg-white px-2 dark:border-none dark:bg-black"
              //   style={{ width: isCompact ? "50px" : "200px" }}
            >
              {!isCompact && (
                <div className="my-2 flex w-full flex-grow  items-center space-x-2 rounded-md border border-none pl-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 22 22"
                    fill={isClient && theme === "dark" ? "#14b8a6" : "#14b8a6"}
                    stroke={isClient && theme === "dark" ? "#5eead4" : "white"}
                    strokeWidth={isClient && theme === "dark" ? 1 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-leaf   rotate-[45] "
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                  <span className="text-lg font-bold dark:text-teal-200">
                    Study Mate
                  </span>
                  {/* <Popover open={open} onOpenChange={setOpen}>
                    <div>
                      <PopoverTrigger asChild>
                        <div
                          // variant="outline"
                          // role="combobox"
                          aria-expanded={open}
                          className=" flex items-center justify-between  rounded-md  bg-stone-50 p-2 text-sm dark:bg-black"
                        >
                          {value
                            ? frameworks.find(
                                (framework) => framework.value === value,
                              )?.label
                            : "Select framework..."}
                          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                        </div>
                      </PopoverTrigger>
                    </div>
                    <div>
                      <PopoverContent
                        className="p-0"
                        style={{ width: `${panelWidth}px` }}
                      >
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      currentValue === value
                                        ? ""
                                        : currentValue,
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === framework.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {framework.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </div>
                  </Popover> */}
                </div>
              )}
              {isCompact && (
                <div className="my-2 flex items-center  justify-center bg-white dark:bg-transparent">
                  {/* <Leaf className="text-teal-500" /> */}
                  {/* <Popover open={open} onOpenChange={setOpen}>
                    <div className="relative">
                      <PopoverTrigger asChild>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill={
                            isClient && theme === "dark" ? "#14b8a6" : "#14b8a6"
                          }
                          stroke={
                            isClient && theme === "dark" ? "#5eead4" : "white"
                          }
                          strokeWidth={isClient && theme === "dark" ? 1 : 2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-leaf   rotate-[45] "
                        >
                          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                        </svg>
                      </PopoverTrigger>
                    </div>
                    <div>
                      <PopoverContent
                        className="absolute left-0 z-10 -translate-x-6 translate-y-2 p-0"
                        // style={{ width: `${panelWidth}px` }}
                      >
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      currentValue === value
                                        ? ""
                                        : currentValue,
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === framework.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {framework.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </div>
                  </Popover> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={isClient && theme === "dark" ? "#14b8a6" : "#14b8a6"}
                    stroke={isClient && theme === "dark" ? "#5eead4" : "white"}
                    strokeWidth={isClient && theme === "dark" ? 1 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-leaf   rotate-[45] "
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
              )}
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={93}>
            <div
              ref={sidebarRef}
              className="flex h-full flex-grow items-start justify-center border  bg-white/75 px-2 py-2 dark:border-none dark:bg-black"
              //   style={{ width: isCompact ? "50px" : "200px" }}
            >
              <div className="flex flex-grow flex-col space-y-1 p-0  ">
                <div
                  onClick={() => setCurrentTab("inbox")}
                  className={`flex ${
                    isCompact === true ? "w-9" : ""
                  } flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-md  p-2 text-[15px] hover:bg-black hover:text-white ${
                    currentTab === "inbox" || !currentTab
                      ? "dark:circle-sm-note bg-black text-white dark:bg-teal-400"
                      : " dark:hover:circle-sm-note dark:glass  bg-white dark:bg-transparent"
                  } `}
                >
                  <span className="flex items-center space-x-2 ">
                    <Package2 size={18} /> {!isCompact && <span>InApp</span>}
                  </span>
                  {!isCompact && <span>95</span>}
                </div>

                <div
                  onClick={() => setCurrentTab("email")}
                  className={`${
                    isCompact === true ? "w-9" : ""
                  } flex flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-sm p-2 text-[15px] hover:bg-black hover:text-white ${
                    currentTab === "email"
                      ? "dark:circle-sm-note bg-black text-white dark:bg-teal-400"
                      : "dark:hover:circle-sm-note dark:glass bg-white dark:bg-transparent "
                  } `}
                >
                  <span className="flex items-center space-x-2">
                    <Mail size={18} /> {!isCompact && <span>Email</span>}
                  </span>
                  {!isCompact && <span>13</span>}
                </div>
                <div
                  onClick={() => setCurrentTab("star")}
                  className={`${
                    isCompact === true ? "w-9" : ""
                  } flex flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-sm p-2 text-[15px] hover:bg-black hover:text-white ${
                    currentTab === "star"
                      ? "dark:circle-md-note bg-black text-white dark:bg-teal-400"
                      : " dark:hover:circle-sm-note  dark:glass bg-white dark:bg-transparent"
                  } `}
                >
                  <span className="flex items-center space-x-2">
                    <Star size={18} /> {!isCompact && <span>Star</span>}
                  </span>
                  {!isCompact && <span>35</span>}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      {/* <PanelResizeHandle /> */}
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={30} maxSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={7} maxSize={7} minSize={7}>
            <div className="flex h-full flex-grow items-center justify-between   bg-white px-3 dark:bg-black">
              {(currentTab === "inbox" || !currentTab) && (
                <span className=" font-semibold">InApp</span>
              )}
              {currentTab === "email" && (
                <span className="font-semibold">Email</span>
              )}
              {currentTab === "star" && (
                <span className="font-semibold">Star</span>
              )}
              <Tabs
                defaultValue="account"
                className="w-[160px] scale-y-90 rounded-md "
              >
                <TabsList className="grid w-full grid-cols-2 text-sm ">
                  <TabsTrigger
                    value="account"
                    className="dark:data-[state=active]:circle-sm-note dark:focus:bg-teal-400 dark:data-[state=active]:bg-teal-400"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="dark:data-[state=active]:circle-sm-note dark:focus:bg-teal-400 dark:data-[state=active]:bg-teal-400"
                  >
                    Unread
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle={false} disabled />
          <ResizablePanel defaultSize={93}>
            <div className="flex h-full items-center justify-center bg-white/75  dark:bg-black">
              {(currentTab === "inbox" || !currentTab) && (
                <div className=" flex h-full w-full flex-col    p-4 font-semibold">
                  <div className="relative mx-1">
                    <Input
                      className="dark:circle-sm-note flex h-8 w-full rounded-md border-none bg-white py-3 pl-8 text-sm shadow-sm  outline-none placeholder:text-muted-foreground focus-visible:ring-transparent  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black  dark:text-teal-300 dark:placeholder-teal-300/75 dark:focus-visible:ring-teal-300/75"
                      placeholder="Search"
                    />
                    <Search className="dark:opacity-1 absolute left-2 top-2 mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-teal-300" />
                  </div>

                  <div className="no-scrollbar mt-4 h-full space-y-3 overflow-y-scroll ">
                    <NotificationCard />
                    <NotificationCard />
                    <NotificationCard />
                    <NotificationCard />
                    <NotificationCard />
                    <NotificationCard />
                    <NotificationCard />
                  </div>
                </div>
              )}
              {currentTab === "email" && (
                <span className="font-semibold">Email</span>
              )}
              {currentTab === "star" && (
                <span className="font-semibold">Star</span>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={47}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={7} minSize={7} maxSize={7}>
            <div className="flex h-full flex-grow items-center justify-end  bg-white px-3 dark:bg-black">
              <span className="flex space-x-2 text-sm font-thin">
                <Star
                  size={18}
                  className="font-light text-stone-700 dark:text-white/75"
                  strokeWidth="1.8"
                />
                <Trash2
                  size={18}
                  className="font-light text-stone-700 dark:text-white/75"
                  strokeWidth="1.8"
                />
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle={false} disabled />
          <ResizablePanel defaultSize={93}>
            <ResizablePanelGroup direction="vertical">
              {/* <ResizablePanelGroup direction="vertical"> */}
              <ResizablePanel defaultSize={15} minSize={13} maxSize={30}>
                <div className="border-b-1   h-full  bg-white p-2 pb-3 dark:bg-black">
                  <div className="flex items-center space-x-3 py-2 ">
                    <div className="-translate-y-3">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: { width: "2.3rem", height: "2.3rem" },
                          },
                        }}
                      ></UserButton>
                    </div>

                    <div className="flex w-full flex-col ">
                      <div className="flex w-full items-center justify-between">
                        <span className="font-bold dark:text-teal-300">
                          Phil Zhu
                        </span>{" "}
                        <span className="text-sm dark:text-teal-300">
                          Mar 10,2023,3:00:00 PM
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="mb-1 text-sm dark:text-white/75">
                          Important Announcement
                        </div>
                        <div className="flex flex-wrap space-x-2">
                          <span className="text-sm">To:</span>
                          <Badge className="scale-90 dark:bg-teal-500 dark:text-white">
                            All
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              {/* <div className=" h-1 w-full border-b "></div> */}
              <ResizableHandle withHandle={true} />
              <ResizablePanel>
                <div className="h-full  bg-white/75 p-2 py-3 text-sm dark:bg-black dark:text-white/80">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
                  quo explicabo tenetur et quis, aperiam, iure cupiditate
                  repellat eveniet velit dicta? Fuga, deleniti ea quos hic
                  consequatur molestiae debitis labore.
                </div>
              </ResizablePanel>
              {/* </ResizablePanelGroup> */}

              {(currentTab === "inbox" ||
                !currentTab ||
                currentTab === "email") && (
                <ResizableHandle withHandle={false} disabled />
              )}
              <ResizablePanel defaultSize={65} maxSize={90}>
                <div className="no-scrollbar relative flex h-full flex-grow flex-col items-center justify-center   overflow-y-scroll bg-white/75 px-3  pb-2 pt-2  dark:bg-black">
                  {(currentTab === "inbox" || !currentTab) && (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="no-scrollbar  w-full space-y-3   overflow-y-scroll  pb-4 dark:px-1"
                      >
                        {/* <ResizablePanelGroup direction="vertical"> */}

                        <FormField
                          control={form.control}
                          name="frameworks"
                          render={({ field }) => (
                            <FormItem className="">
                              <FormLabel className="flex w-full items-center justify-between space-x-2">
                                <span>To:</span>{" "}
                                <FormMessage className="text-xs" />
                              </FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={receipients}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  placeholder="Select receipients"
                                  variant="inverted"
                                  animation={2}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <ResizableHandle
                          withHandle={false}
                          disabled
                          className="my-3"
                        />
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormLabel>
                                <span className="text-xs">Time</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="time..." {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="flex w-full space-x-4 ">
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex w-full items-center justify-between space-x-2">
                                  <span className="text-xs text-inherit">
                                    Subject
                                  </span>
                                  <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Add a subject..."
                                    className="dark:hover:circle-sm-note pl-4 focus-visible:ring-transparent dark:border-none dark:shadow-sm dark:shadow-teal-300"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex w-full items-center justify-between space-x-2">
                                  <span className="text-xs">Link</span>
                                  <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Relative url..."
                                    className="dark:hover:circle-sm-note pl-4 focus-visible:ring-transparent dark:border-none dark:shadow-sm  dark:shadow-teal-300 "
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="tag"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex w-full items-center justify-between space-x-2">
                                <span>Tag </span>{" "}
                                <FormMessage className="text-xs" />
                              </FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={tagsList}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  placeholder="Select tag"
                                  variant="inverted"
                                  animation={2}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex w-full items-center justify-between space-x-2">
                                <span className="text-xs ">
                                  Short description
                                </span>
                                <FormMessage className="text-xs" />
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Input your notification..."
                                  className="dark:hover:circle-sm-note pl-4 focus-visible:ring-transparent dark:border-none dark:shadow-sm  dark:shadow-teal-300"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end   sm:gap-0 ">
                          <LoadingButton
                            type="submit"
                            size={"sm"}
                            className="   px-2 py-0 dark:bg-transparent dark:text-teal-300 dark:shadow-sm dark:shadow-teal-300 dark:hover:bg-transparent dark:hover:text-teal-200 dark:hover:shadow-md dark:hover:shadow-teal-400"
                            loading={inAppLoading}
                            disabled={form.formState.isSubmitting}
                          >
                            <span className="flex items-center space-x-1">
                              {!inAppLoading && <Send size={14} />}
                              <span className="scale-y-90 text-[14px]">
                                Send
                              </span>
                            </span>
                          </LoadingButton>
                        </div>
                      </form>
                    </Form>
                  )}
                  {currentTab === "email" && (
                    <Form {...emailForm}>
                      <form
                        onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                        className="w-full space-y-3  "
                      >
                        {/* <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <span className="text-xs">Link</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="relative url..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        /> */}
                        <FormField
                          control={emailForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormLabel>
                                <span className="text-xs">Time</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Add a subject..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={emailForm.control}
                          name="frameworks"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To:</FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={receipients}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  placeholder="Select options"
                                  variant="inverted"
                                  animation={2}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <ResizableHandle
                          withHandle={false}
                          disabled
                          className="my-3"
                        />
                        <FormField
                          control={emailForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <span className="text-xs">Subject</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Add a subject..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={emailForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <span className="text-xs">Message</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Input your email message..."
                                  {...field}
                                  rows={7}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className=" flex justify-end  gap-1 sm:gap-0">
                          <LoadingButton
                            type="submit"
                            size={"sm"}
                            className="mt-4 px-2 py-0 dark:bg-transparent dark:text-green-300 dark:shadow-sm dark:shadow-green-300 dark:hover:bg-transparent dark:hover:text-green-200 dark:hover:shadow-md dark:hover:shadow-green-400"
                            loading={false}
                            disabled={false}
                          >
                            <span className="flex items-center space-x-1">
                              <Send size={14} />
                              <span className="scale-y-90 text-[14px]">
                                Send
                              </span>
                            </span>
                          </LoadingButton>
                        </div>
                      </form>
                    </Form>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Notification;
