"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { pusherClient } from "@/lib/pusher";
import {
  Divide,
  Leaf,
  Mail,
  Menu,
  MoreVertical,
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

import { Span, setGlobal } from "next/dist/trace";
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
import {
  deleteNotification,
  informOtherAdmin,
  sendNotification,
} from "@/app/[locale]/action";
import toast from "react-hot-toast";
import { InAppSchema, inAppSchema } from "@/lib/validation/note";
import NotificationCard from "./NotificationCard";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "../ui/badge";
import { InAppNotification } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { limitStringLength } from "@/app/[locale]/utils/limitStringLength";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setStar } from "@/Storage/Redux/starSlice";
import { useGetUsersQuery, usePostUsersMutation } from "@/Apis/userApi";
import { revalidatePath, revalidateTag } from "next/cache";
import { useUpdateReadMutation } from "@/Apis/readApi";
import { setReadStatus } from "@/Storage/Redux/readSlice";
import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../ui/button";
import { setGlobalWidth } from "@/Storage/Redux/widthSlice";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { PanelGroup } from "react-resizable-panels";
import { useGetInAppQuery, useUpdateInAppMutation } from "@/Apis/inAppApi";
import { useUpdateStarMutation } from "@/Apis/starApi";
import { divide } from "lodash";
import { CardPlaceholder } from "./CardPlaceholder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface notificationProps {
  usersList: User[];
  inAppNotificationList: InAppNotification[];
  userId: string;
}

const Notification = ({
  usersList,
  inAppNotificationList,
  userId,
}: notificationProps) => {
  const [currentTab, setCurrentTab] = useState<string>();
  const [currentReadTab, setCurrentReadTab] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentLayout, setCurrentLayout] = useState("horizontal");

  const { star: reduxStar } = useAppSelector((state) => state.starStore);
  const { read: reduxRead } = useAppSelector((state) => state.readStore);
  // const { read: reduxRead } = useAppSelector((state) => state.readStore);
  const { data: inApp, isLoading: isInAppDataLoading } = useGetInAppQuery({});
  const [updateStar] = useUpdateStarMutation();
  const [updateRead] = useUpdateReadMutation();
  const dispatch = useAppDispatch();
  // let currentUser = usersList.filter((user) => user.id === userId)[0];

  useEffect(() => {
    console.log("notification reduxStar: " + reduxStar);
  }, [reduxStar]);

  const [tags, setTags] = useState(["new", "important", "move", "exam"]);
  const [isCompact, setIsCompact] = useState(false);
  // const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState(200);
  const { theme, setTheme } = useTheme();
  const [inAppLoading, setInAppLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // const [thisNotification, setThisNotification] =
  //   useState<InAppNotification | null>();
  const [inAppNotifications, setInAppNotifications] =
    useState<InAppNotification[]>();
  let sortedInAppNotifications = useMemo(() => {
    if (!inAppNotifications) {
      // return [...inAppNotificationList].sort(
      //   (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      // );
      return [];
    } else {
      return [...inAppNotifications].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      );
    }
  }, [inAppNotifications]);
  const [thisNotification, setThisNotification] = useState<any>();

  const [search, setSearch] = useState("");
  const [searchNotification, setSearchNotification] = useState<
    InAppNotification[]
  >(sortedInAppNotifications);

  let starCondition = reduxStar;
  const { data: currentUser, isLoading } = useGetUsersQuery({
    revalidateTag: true,
  });
  const [postUsers] = usePostUsersMutation();

  const [updateInApp] = useUpdateInAppMutation();
  const { width: globalWidth } = useAppSelector((state) => state.widthStore);

  // const starNum = useMemo(() => {
  //   return inAppNotificationList.filter((notification) =>
  //     notification.star.includes(userId),
  //   ).length;
  // }, [inAppNotificationList, userId]);
  const starNum = inAppNotifications
    ? inAppNotifications.filter((notification) =>
        notification.star.includes(userId),
      ).length
    : 0;
  // useEffect(() => {
  //   console.log("inAppNotifications are changing");
  // }, [inAppNotifications]);
  useEffect(() => {
    const triggerUpdate = async () => {
      await updateInApp("");
    };
    triggerUpdate();
    console.log("trigger this inapp");
  }, [updateInApp]);

  // const [starNumber, setStarNumber] = useState(starNum || 0);

  // console.log("data:" + JSON.stringify(data));
  // console.log(data);
  // {
  //   id: "",
  //   link: "",
  //   user: "",
  //   time: "",
  //   subject: "",
  //   to: [],
  //   description: "",
  //   tag: [],
  //   notificationListId: "",
  // }
  // useEffect(() => {
  //   const res = async () => {
  //     const response = await fetch("/api/user", {
  //       method: "GET",
  //       // headers: {
  //       //   "Content-Type": "application/json",
  //       // },
  //     });

  //     // setIsFlagged(!isFlagged);
  //     if (response.ok) {
  //       console.log("response:" + JSON.stringify(response));
  //     }
  //   };
  //   res();
  // }, []);

  const router = useRouter();

  const form = useForm<InAppSchema>({
    resolver: zodResolver(inAppSchema),
    defaultValues: {
      time: new Date().toISOString(),
      link: "",
      subject: "",
      description: "",
      to: [],
      tag: [],
      read: [],
      star: [],
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
    if (!isInAppDataLoading) {
      setInAppNotifications(inApp);
    }
  }, [inApp, isInAppDataLoading]);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase(); // Convert search string to lowercase

    let inAppNos = sortedInAppNotifications.filter(
      (no) =>
        !search ||
        no.subject.toLowerCase().includes(lowerCaseSearch) || // Convert to lowercase before checking
        no.tag.includes(lowerCaseSearch) || // Convert to lowercase before checking
        no.description.toLowerCase().includes(lowerCaseSearch) ||
        (
          JSON.parse(no.user).firstName.toLowerCase() +
          " " +
          JSON.parse(no.user).lastName.toLowerCase()
        ).includes(lowerCaseSearch), // Convert to lowercase before checking
    );

    setSearchNotification(inAppNos);
  }, [search, sortedInAppNotifications]);

  const sidebarRef = useCallback((node: Element | null) => {
    if (node !== null) {
      const handleResize = (entries: any) => {
        for (let entry of entries) {
          setIsCompact(entry.contentRect.width < 140);
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);

      resizeObserver.observe(node);

      return () => {
        resizeObserver.unobserve(node);
      };
    }
  }, []);

  // useEffect(() => {
  //   console.log("panelWidth: " + panelWidth);
  // }, [panelWidth]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      dispatch(setGlobalWidth(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // useEffect(() => {
  //   console.log(screenWidth);
  //   if (screenWidth >= 891) {
  //     setCurrentLayout("horizontal");
  //   } else {
  //     setCurrentLayout("vertical");
  //   }
  // }, [screenWidth]);
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

  //convert to locale date time
  // let isoString = "2024-06-16T17:29:15.786Z";
  // const date = new Date(isoString);

  // // Convert to localized date and time
  // const localizedDateTime = date.toLocaleString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  //   hour12: true, // Use 12-hour clock, set to false for 24-hour clock
  // });
  function convertToLocaleDateTime(isoString: Date | number | string) {
    const date = new Date(isoString);

    // Convert to localized date and time
    const localizedDateTime = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Use 12-hour clock, set to false for 24-hour clock
    });
    return localizedDateTime;
  }
  // convert to timestamp
  function getCurrentTimestamp() {
    return new Date().toISOString();
  }
  async function onSubmit(input: InAppSchema) {
    // alert(JSON.stringify(input));
    // alert(convertToLocaleDateTime(getCurrentTimestamp()));
    const currentTime = getCurrentTimestamp();

    try {
      // if (currentUser) {
      //   alert(JSON.stringify(currentUser));
      // }
      // alert(JSON.stringify(input));
      setInAppLoading(true);
      const response: string = await sendNotification({
        ...input,
        time: currentTime,
      });
      const res = await informOtherAdmin(true);
      if (response && res.status == "ok") {
        toast.success("Notification has been sent successfully");
        await updateInApp("");
        setInAppLoading(false);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      toast.error("Internal Error");
      setInAppLoading(false);
    }
  }
  const updateNotificationList = useCallback(async () => {
    await updateInApp("");
    // Add logic to update the state with the new notifications
  }, [updateInApp]);
  useEffect(() => {
    pusherClient.subscribe("action");
    pusherClient.bind(
      "user:inform",
      ({ isInformed }: { isInformed: boolean }) => {
        // toast.success("received but no inform");
        if (isInformed) {
          // toast.success("Your InApp notifications List has been modified");
          // console.log("receive it from the frontend ");
          updateNotificationList();
        }
      },
    );
    return () => {
      pusherClient.unsubscribe("action");
    };
  }, [updateNotificationList]);

  async function onSubmitEmail(input: any) {
    alert(JSON.stringify(input));
    try {
    } catch (error) {}
  }
  // useEffect(() => {
  //   const updateUserPrivateData = async () => {
  //     await postUsers("trigger");
  //   };
  //   updateUserPrivateData();
  // }, [postUsers, reduxStar, currentReadTab, currentTab, thisNotification]);

  //data transmit
  async function handleDataTransmit(id: string) {
    const thisOne = sortedInAppNotifications.filter((no) => no.id === id)[0];
    // const thisOne = inAppNotifications!.filter((no) => no.id === id);
    // console.log("reduxStar:" + reduxStar);
    // await updateInApp(id);
    // console.log("call this updateInApp");

    // dispatch(setStar(!reduxStar));
    setThisNotification(thisOne);
  }

  async function updateReadStatus(notificationId: string, read: boolean) {
    // if (thisNotification) {
    // if (thisNotification.id == notificationId) {
    const res = await updateRead({
      currentUserId: userId,
      notificationId: notificationId,
      read: read,
    });

    if (res) {
      await updateInApp(notificationId);

      dispatch(setReadStatus(read));
    }
    if (read) {
      toast.success("You read this notification");
    }
  }

  // useEffect(() => {
  //   toast.success("changed this notification");
  // }, [thisNotification]);
  useEffect(() => {
    console.log("reduxRead: " + reduxRead);
  }, [reduxRead]);
  const deleteThisNotification = async (id: string) => {
    try {
      const response = await deleteNotification(id);

      const res = await informOtherAdmin(true);
      // await updateNotificationList();
      if (response && res.status == "ok") {
        toast.success("this notification has been deleted successfully");

        await updateInApp(id);
        // router.refresh();
        setThisNotification(null);
      }
    } catch (error) {
      toast.error("notification not found");
    }
  };

  // useEffect(() => {
  //   if (thisNotification) {
  //     if (inAppNotifications) {
  //       dispatch(setStar(thisNotification.star.includes(userId)));
  //     }
  //   }
  // }, [thisNotification, dispatch, inAppNotifications, userId]);

  async function handleStar(id: string) {
    // alert("current reduxStar: " + reduxStar);
    if (thisNotification) {
      // alert("this notification exists");
      const res = await updateStar({
        currentUserId: userId,
        notificationId: thisNotification.id,
        star: !reduxStar,
      });
      // const response = await postUsers(id);
      if (res) {
        // setStarStatus((star) => !star);
        await updateInApp(id);
        dispatch(setStar(!reduxStar));
        // toast.success("handle star successfully");
      } else {
        toast.error("Something went wrong");
      }
    }
  }
  // useEffect(() => {
  //   console.log("screenWidth: " + screenWidth);
  // }, [screenWidth]);

  return (
    <>
      {globalWidth >= 891 && (
        <ResizablePanelGroup
          // direction={screenWidth >= 891 ? "horizontal" : "vertical"}
          direction="horizontal"
          className="flex  w-full flex-grow"
        >
          <ResizablePanel
            defaultSize={18}
            maxSize={20}
            className={`  ${
              !isCompact ? "transition-all duration-300 ease-in-out" : ""
            } `}
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
                      <span className="text-lg font-bold dark:text-teal-200">
                        Study Mate
                      </span>
                    </div>
                  )}
                  {isCompact && (
                    <div className="my-2 flex items-center  justify-center bg-white dark:bg-transparent">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
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
                      onClick={() => {
                        setCurrentTab("inbox");
                        setThisNotification(null);
                        dispatch(setStar(false));
                      }}
                      className={`flex ${
                        isCompact === true ? "w-9" : ""
                      } flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-md  p-2 text-[15px] hover:bg-black hover:text-white ${
                        currentTab === "inbox" || !currentTab
                          ? "dark:circle-sm-note bg-black text-white dark:bg-teal-400"
                          : " dark:hover:circle-sm-note dark:glass  bg-white dark:bg-transparent"
                      } `}
                    >
                      <span className="flex items-center space-x-2 ">
                        <Package2 size={18} />{" "}
                        {!isCompact && <span>InApp</span>}
                      </span>
                      {!isCompact && (
                        <span>{sortedInAppNotifications?.length}</span>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setCurrentTab("email");
                        setThisNotification(null);
                        dispatch(setStar(false));
                      }}
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
                      onClick={() => {
                        setCurrentTab("star");
                        setThisNotification(null);
                        dispatch(setStar(false));
                      }}
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
                      {!isCompact && (
                        <span>
                          {/* {usersList.filter((user) => user.id === userId)[0]
                        .privateMetadata.star
                        ? (
                            usersList.filter((user) => user.id === userId)[0]
                              .privateMetadata.star as string[]
                          ).length
                        : 0} */}
                          {starNum}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
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
                    className=" w-[140px] scale-y-90 rounded-md "
                  >
                    {currentTab !== "star" && (
                      <div className=" my-2 grid w-full grid-cols-2 space-x-[0.15rem] rounded-md p-1 text-sm dark:bg-stone-800 dark:bg-transparent/75">
                        <Button
                          onClick={() => setCurrentReadTab("All")}
                          className={`${
                            !currentReadTab || currentReadTab === "All"
                              ? "dark:circle-sm-note dark:bg-teal-400 dark:text-white"
                              : "dark:bg-stone-800 dark:text-stone-400"
                          } dark:focus:circle-sm-note h-8 text-sm   dark:hover:bg-black dark:focus:bg-teal-400 dark:focus:text-white dark:data-[state=active]:bg-teal-400`}
                        >
                          All
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentReadTab("Unread");
                            router.refresh();
                            // dispatch(readStatus());
                            // dispatch(starStatus());
                          }}
                          className={`${
                            currentReadTab === "Unread"
                              ? "dark:circle-sm-note dark:bg-teal-400 dark:text-white"
                              : "dark:bg-stone-800 dark:text-stone-400"
                          } dark:focus:circle-sm-note h-8 text-sm   dark:hover:bg-black dark:focus:bg-teal-400 dark:focus:text-white dark:data-[state=active]:bg-teal-400`}
                        >
                          <span className="scale-90">Unread</span>
                        </Button>
                      </div>
                    )}
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
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="dark:opacity-1 absolute left-2 top-2 mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-teal-300" />
                      </div>
                      {(currentReadTab === "All" || !currentReadTab) && (
                        <div className="no-scrollbar mt-4 h-full space-y-3 overflow-y-scroll ">
                          {sortedInAppNotifications.length > 0 &&
                            inAppNotifications &&
                            searchNotification.map((no: InAppNotification) => (
                              // <div key={no.id}>{no.time}</div>
                              <div
                                key={no.id}
                                onClick={() => {
                                  handleDataTransmit(no.id);

                                  dispatch(setStar(no.star.includes(userId)));

                                  if (!no.read.includes(userId)) {
                                    updateReadStatus(no.id, true);
                                  }

                                  dispatch(
                                    setReadStatus(no.read.includes(userId)),
                                  );
                                }}
                              >
                                {thisNotification &&
                                thisNotification.id == no.id ? (
                                  <NotificationCard
                                    no={no}
                                    currentUserId={userId}
                                    starStatus={reduxStar}
                                    currentNoId={thisNotification?.id ?? null}
                                    readStatus={reduxRead}
                                  />
                                ) : (
                                  <NotificationCard
                                    no={no}
                                    currentUserId={userId}
                                    currentNoId={thisNotification?.id ?? null}
                                  />
                                )}
                              </div>
                            ))}
                          {!inAppNotifications && (
                            <div className="space-y-2 px-1">
                              {[1, 1, 1, 1].map((p, i) => (
                                <CardPlaceholder key={i} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {currentReadTab === "Unread" && (
                        <div className="no-scrollbar mt-4 h-full space-y-3 overflow-y-scroll ">
                          {inAppNotificationList.length > 0 &&
                            searchNotification
                              .filter(
                                (notification: InAppNotification) =>
                                  notification.read.length == 0,
                              )

                              .map((no: InAppNotification) => (
                                // <div key={no.id}>{no.time}</div>
                                <div
                                  key={no.id}
                                  onClick={() => {
                                    handleDataTransmit(no.id);
                                    dispatch(setStar(no.star.includes(userId)));
                                    if (!no.read.includes(userId)) {
                                      updateReadStatus(no.id, true);
                                    }

                                    dispatch(
                                      setReadStatus(no.read.includes(userId)),
                                    );
                                  }}
                                >
                                  {thisNotification &&
                                  thisNotification.id == no.id ? (
                                    <NotificationCard
                                      no={no}
                                      currentUserId={userId}
                                      starStatus={reduxStar}
                                      currentNoId={thisNotification?.id ?? null}
                                      // readStatus={true}
                                    />
                                  ) : (
                                    <NotificationCard
                                      no={no}
                                      currentUserId={userId}
                                      currentNoId={thisNotification?.id ?? null}
                                      // readStatus={true}
                                    />
                                  )}
                                </div>
                              ))}
                        </div>
                      )}
                    </div>
                  )}
                  {currentTab === "email" && (
                    <span className="font-semibold">Email</span>
                  )}
                  {currentTab === "star" && (
                    <div className=" flex h-full w-full flex-col    p-4 font-semibold">
                      <div className="relative mx-1">
                        <Input
                          className="dark:circle-sm-note flex h-8 w-full rounded-md border-none bg-white py-3 pl-8 text-sm shadow-sm  outline-none placeholder:text-muted-foreground focus-visible:ring-transparent  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black  dark:text-teal-300 dark:placeholder-teal-300/75 dark:focus-visible:ring-teal-300/75"
                          placeholder="Search"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="dark:opacity-1 absolute left-2 top-2 mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-teal-300" />
                      </div>

                      <div className="no-scrollbar mt-4 h-full space-y-3 overflow-y-scroll ">
                        {inAppNotificationList.length > 0 &&
                          searchNotification
                            .filter((no: InAppNotification) =>
                              no.star.includes(userId),
                            )
                            .map((no: InAppNotification) => (
                              // <div key={no.id}>{no.time}</div>
                              <div
                                key={no.id}
                                onClick={() => {
                                  handleDataTransmit(no.id);
                                  dispatch(setStar(no.star.includes(userId)));
                                  if (!no.read.includes(userId)) {
                                    updateReadStatus(no.id, true);
                                  }

                                  dispatch(
                                    setReadStatus(no.read.includes(userId)),
                                  );
                                }}
                              >
                                {thisNotification &&
                                thisNotification.id == no.id ? (
                                  <NotificationCard
                                    no={no}
                                    currentUserId={userId}
                                    starStatus={reduxStar}
                                    currentNoId={thisNotification?.id ?? null}
                                    readStatus={reduxRead}
                                  />
                                ) : (
                                  <NotificationCard
                                    no={no}
                                    currentUserId={userId}
                                    currentNoId={thisNotification?.id ?? null}
                                  />
                                )}
                              </div>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={47}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={7} minSize={7} maxSize={7}>
                <div className="flex h-full flex-grow items-center justify-between bg-white px-3 dark:bg-black">
                  <span className="flex space-x-2 text-sm font-thin">
                    {thisNotification && (
                      <Star
                        size={18}
                        className={`font-light text-stone-700  ${
                          starCondition
                            ? "dark:text-transparent"
                            : "dark:text-white/75"
                        }`}
                        strokeWidth="1.8"
                        fill={starCondition ? "#fcd34d" : "transparent"}
                        // fill="#fcd34d"
                        onClick={() => {
                          if (thisNotification) {
                            handleStar(thisNotification.id);
                          } else {
                            toast.error(
                              "You don't have any notification to star",
                            );
                          }
                        }}
                      />
                    )}
                    {!thisNotification && (
                      <Star
                        size={18}
                        className="font-light text-stone-700 dark:text-stone-300"
                        strokeWidth="1.8"
                        fill={"transparent"}
                      />
                    )}
                    {!thisNotification && (
                      <Trash2
                        size={18}
                        className="font-light text-stone-700 dark:text-white/75"
                        strokeWidth="1.8"
                        onClick={() => {
                          // if (thisNotification) {
                          //   deleteThisNotification(thisNotification?.id);
                          // } else {
                          toast.error(
                            "Currently, you have no notifications to delete",
                          );
                        }}
                      />
                    )}
                    {thisNotification && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Trash2
                            size={18}
                            className="font-light text-stone-700 dark:text-white/75"
                            strokeWidth="1.8"
                            // onClick={() => {
                            //   if (thisNotification) {
                            //     deleteThisNotification(thisNotification?.id);
                            //   } else {
                            //     toast.error(
                            //       "Currently, you have no notifications to delete",
                            //     );
                            //   }
                            // }}
                          />
                        </AlertDialogTrigger>

                        <AlertDialogContent
                          className="circle-sm-exam dark:border-none"
                          aria-describedby="content"
                          aria-description="content"
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {/* {b("table.action.verify.title")} */}
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {/* {b("table.action.verify.description")} */}
                              This action cannot be undone. This will
                              permanently delete your question and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:border-none dark:shadow-sm dark:shadow-red-200">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 text-white dark:border-none dark:shadow-sm dark:shadow-red-300 dark:hover:text-red-500"
                              onClick={() => {
                                if (thisNotification) {
                                  deleteThisNotification(thisNotification?.id);
                                }
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="dark:border-stone-800"
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="mx-auto my-1 h-[1px] w-full bg-gray-300 dark:bg-stone-600" />
                      <DropdownMenuItem
                        className="w-full dark:text-stone-400"
                        onClick={() => {
                          if (thisNotification) {
                            if (reduxRead) {
                              updateReadStatus(thisNotification.id, false);
                              toast.success("You have marked this unread");
                            } else {
                              toast.error(
                                "Sorry,this notification is already unread",
                              );
                            }
                          } else {
                            toast.error(
                              "Sorry you have no notification chosen",
                            );
                          }
                        }}
                      >
                        mark this unread
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle={false} disabled />
              <ResizablePanel defaultSize={93}>
                <ResizablePanelGroup direction="vertical">
                  {/* <ResizablePanelGroup direction="vertical"> */}
                  {thisNotification && (
                    <>
                      <ResizablePanel
                        defaultSize={15}
                        minSize={13}
                        maxSize={30}
                      >
                        <div className="border-b-1   h-full  bg-white p-2 pb-3 dark:bg-black">
                          <div className="flex items-center space-x-3 py-2 ">
                            <div className="-translate-y-3">
                              {/* <UserButton
                        appearance={{
                          elements: {
                            avatarBox: { width: "2.3rem", height: "2.3rem" },
                          },
                        }}
                      ></UserButton> */}
                              {thisNotification && (
                                <Image
                                  src={JSON.parse(
                                    thisNotification.user,
                                  ).imageUrl.toString()}
                                  alt="sender"
                                  width={35}
                                  height={35}
                                  className="rounded-full"
                                />
                              )}
                            </div>

                            <div className="flex w-full flex-col ">
                              <div className="flex w-full items-center justify-between">
                                <span className="font-bold dark:text-teal-300">
                                  {thisNotification &&
                                    JSON.parse(thisNotification?.user)
                                      .firstName +
                                      " " +
                                      JSON.parse(thisNotification?.user)
                                        .lastName}
                                </span>{" "}
                                {thisNotification && (
                                  <span className="text-sm dark:text-teal-300">
                                    {convertToLocaleDateTime(
                                      thisNotification.time,
                                    )}
                                  </span>
                                )}
                              </div>
                              {thisNotification && (
                                <div className="mb-2">
                                  <div className="mb-1 text-sm dark:text-white/75">
                                    {thisNotification.subject}
                                  </div>

                                  <div className="flex flex-wrap space-x-2">
                                    <span className="text-sm">To:</span>
                                    <div className="flex space-x-0">
                                      {thisNotification.to.map(
                                        (t: any, index: number) => (
                                          <Badge
                                            key={index}
                                            className="scale-90 dark:bg-teal-500 dark:text-white"
                                          >
                                            {t}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </ResizablePanel>
                      {/* <div className=" h-1 w-full border-b "></div> */}
                      <ResizableHandle withHandle={true} />
                      <ResizablePanel>
                        <div className="no-scrollbar  h-full overflow-y-scroll bg-white/75 p-2 py-3 text-sm dark:bg-black dark:text-white/80">
                          {thisNotification && thisNotification.description}
                        </div>
                      </ResizablePanel>

                      {(currentTab === "inbox" ||
                        !currentTab ||
                        currentTab === "email") && (
                        <ResizableHandle withHandle={false} disabled />
                      )}
                    </>
                  )}
                  <ResizablePanel defaultSize={65} maxSize={90}>
                    <div className="no-scrollbar relative flex h-full flex-grow flex-col items-center justify-center   overflow-y-scroll bg-white/75 px-3  pb-2 pt-2  dark:bg-black">
                      {(currentTab === "inbox" || !currentTab) && (
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className={`${
                              !thisNotification ? "space-y-14" : "space-y-3"
                            } no-scrollbar  w-full   overflow-y-scroll  pb-4 dark:px-1`}
                            // className="no-scrollbar  w-full   space-y-14 overflow-y-scroll pb-4 dark:px-1"
                          >
                            {/* <ResizablePanelGroup direction="vertical"> */}

                            <FormField
                              control={form.control}
                              name="to"
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
      )}
      {globalWidth < 891 && (
        <ResizablePanelGroup
          direction="vertical"
          className="flex  w-full flex-grow"
        >
          <ResizablePanel defaultSize={2} minSize={2} maxSize={2}>
            <div className="flex h-full items-center justify-center bg-white dark:border-none dark:bg-black">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 22 22"
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
                  </Button>
                </DrawerTrigger>
                {/* <DrawerContent className=" dark:border-none"> */}
                {/* <DrawerHeader> */}
                {/* <DrawerDescription className=""> */}
                <DrawerContent className="dark:border-none">
                  <div className="dark:bg-dark flex h-10 w-full items-center justify-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 22 22"
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
                  </div>
                  <div className="flex h-full  items-center  dark:border-none">
                    <div className="flex h-full flex-grow items-start justify-center border  bg-white/75 px-2 py-2 dark:border-none dark:bg-black">
                      <div className="flex flex-grow flex-col space-y-2 p-0 py-4  ">
                        <DrawerClose
                          onClick={() => {
                            setCurrentTab("inbox");
                            setThisNotification(null);
                            dispatch(setStar(false));
                          }}
                          className={`flex 
                               
                             flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-md  p-2 text-[15px] hover:bg-black hover:text-white ${
                               currentTab === "inbox" || !currentTab
                                 ? "dark:circle-sm-note bg-black text-white dark:bg-teal-400"
                                 : " dark:hover:circle-sm-note dark:glass  bg-white dark:bg-transparent"
                             } `}
                        >
                          <span className="flex items-center space-x-2 ">
                            <Package2 size={18} /> <span>InApp</span>
                          </span>

                          <span>{sortedInAppNotifications?.length}</span>
                        </DrawerClose>

                        <DrawerClose
                          onClick={() => {
                            setCurrentTab("email");
                            setThisNotification(null);
                            dispatch(setStar(false));
                          }}
                          className={`
                               
                               flex flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-sm p-2 text-[15px] hover:bg-black hover:text-white ${
                                 currentTab === "email"
                                   ? "dark:circle-sm-note bg-black text-white dark:bg-teal-400"
                                   : "dark:hover:circle-sm-note dark:glass bg-white dark:bg-transparent "
                               } `}
                        >
                          <span className="flex items-center space-x-2">
                            <Mail size={18} /> <span>Email</span>
                          </span>
                          <span>13</span>
                        </DrawerClose>
                        <DrawerClose
                          onClick={() => {
                            setCurrentTab("star");
                            setThisNotification(null);
                            dispatch(setStar(false));
                          }}
                          className={`
                               
                               flex flex-shrink-0 scale-y-95 cursor-pointer items-center justify-between space-x-2 rounded-sm p-2 text-[15px] hover:bg-black hover:text-white ${
                                 currentTab === "star"
                                   ? "dark:circle-md-note bg-black text-white dark:bg-teal-400"
                                   : " dark:hover:circle-sm-note  dark:glass bg-white dark:bg-transparent"
                               } `}
                        >
                          <span className="flex items-center space-x-2">
                            <Star size={18} /> <span>Star</span>
                          </span>
                          <span>{starNum}</span>
                        </DrawerClose>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
                {/* </DrawerDescription> */}
                {/* </DrawerHeader> */}
                {/* </DrawerContent> */}
              </Drawer>
            </div>
          </ResizablePanel>

          <ResizableHandle className="dark:bg-dark" />

          <ResizablePanel defaultSize={35} minSize={35} maxSize={50}>
            {/* <ResizablePanelGroup direction="vertical"> */}
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
                  className=" w-[140px] scale-y-90 rounded-md "
                >
                  {currentTab !== "star" && (
                    <div className=" my-2 grid w-full grid-cols-2 space-x-[0.15rem] rounded-md p-1 text-sm dark:bg-stone-800 dark:bg-transparent/75">
                      <Button
                        onClick={() => setCurrentReadTab("All")}
                        className={`${
                          !currentReadTab || currentReadTab === "All"
                            ? "dark:circle-sm-note dark:bg-teal-400 dark:text-white"
                            : "dark:bg-stone-800 dark:text-stone-400"
                        } dark:focus:circle-sm-note h-8 text-sm   dark:hover:bg-black dark:focus:bg-teal-400 dark:focus:text-white dark:data-[state=active]:bg-teal-400`}
                      >
                        All
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentReadTab("Unread");
                          router.refresh();
                        }}
                        className={`${
                          currentReadTab === "Unread"
                            ? "dark:circle-sm-note dark:bg-teal-400 dark:text-white"
                            : "dark:bg-stone-800 dark:text-stone-400"
                        } dark:focus:circle-sm-note h-8 text-sm   dark:hover:bg-black dark:focus:bg-teal-400 dark:focus:text-white dark:data-[state=active]:bg-teal-400`}
                      >
                        <span className="scale-90">Unread</span>
                      </Button>
                    </div>
                  )}
                </Tabs>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={93}>
              <div className="flex  h-full items-center justify-center   bg-white/75 dark:bg-black">
                {(currentTab === "inbox" || !currentTab) && (
                  <div className=" no-scrollbar flex h-full w-full flex-col overflow-y-scroll  p-4 font-semibold">
                    <div className="relative mx-1">
                      <Input
                        className="dark:circle-sm-note flex h-8 w-full rounded-md border-none bg-white py-3 pl-8 text-sm shadow-sm  outline-none placeholder:text-muted-foreground focus-visible:ring-transparent  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black  dark:text-teal-300 dark:placeholder-teal-300/75 dark:focus-visible:ring-teal-300/75"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Search className="dark:opacity-1 absolute left-2 top-2 mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-teal-300" />
                    </div>
                    {/* smaller than 891 */}
                    {(currentReadTab === "All" || !currentReadTab) && (
                      <div className="no-scrollbar  mt-4 h-[450px] space-y-3 overflow-y-scroll pb-2 ">
                        {sortedInAppNotifications.length > 0 &&
                          inAppNotifications &&
                          searchNotification.map((no: InAppNotification) => (
                            <div
                              key={no.id}
                              onClick={() => {
                                handleDataTransmit(no.id);

                                dispatch(setStar(no.star.includes(userId)));

                                if (!no.read.includes(userId)) {
                                  updateReadStatus(no.id, true);
                                }

                                dispatch(
                                  setReadStatus(no.read.includes(userId)),
                                );
                              }}
                            >
                              {thisNotification &&
                              thisNotification.id == no.id ? (
                                <NotificationCard
                                  no={no}
                                  currentUserId={userId}
                                  starStatus={reduxStar}
                                  currentNoId={thisNotification?.id ?? null}
                                  readStatus={reduxRead}
                                />
                              ) : (
                                <NotificationCard
                                  no={no}
                                  currentUserId={userId}
                                  currentNoId={thisNotification?.id ?? null}
                                />
                              )}
                            </div>
                          ))}
                        {!inAppNotifications && (
                          <div className="space-y-2 px-1">
                            {[1, 1, 1, 1].map((p, i) => (
                              <CardPlaceholder key={i} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {currentReadTab === "Unread" && (
                      <div className="no-scrollbar mt-4 h-[450px] space-y-3 overflow-y-scroll pb-2 ">
                        {inAppNotificationList.length > 0 &&
                          searchNotification
                            .filter(
                              (notification: InAppNotification) =>
                                notification.read.length == 0,
                            )
                            .map((no: InAppNotification) => (
                              <div
                                key={no.id}
                                onClick={() => {
                                  handleDataTransmit(no.id);
                                  dispatch(setStar(no.star.includes(userId)));
                                  if (!no.read.includes(userId)) {
                                    updateReadStatus(no.id, true);
                                  }

                                  dispatch(
                                    setReadStatus(no.read.includes(userId)),
                                  );
                                }}
                              >
                                <NotificationCard
                                  no={no}
                                  currentUserId={userId}
                                  readStatus={false}
                                  currentNoId={thisNotification?.id ?? null}
                                />
                              </div>
                            ))}
                      </div>
                    )}
                  </div>
                )}
                {currentTab === "email" && (
                  <span className="font-semibold">Email</span>
                )}
                {currentTab === "star" && (
                  <div className=" flex h-full w-full flex-col    p-4 font-semibold">
                    <div className="relative mx-1">
                      <Input
                        className="dark:circle-sm-note flex h-8 w-full rounded-md border-none bg-white py-3 pl-8 text-sm shadow-sm  outline-none placeholder:text-muted-foreground focus-visible:ring-transparent  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black  dark:text-teal-300 dark:placeholder-teal-300/75 dark:focus-visible:ring-teal-300/75"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Search className="dark:opacity-1 absolute left-2 top-2 mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-teal-300" />
                    </div>
                    {/* smaller than 891 */}
                    <div className="no-scrollbar mt-4 h-[450px] space-y-3 overflow-y-scroll py-2">
                      {inAppNotificationList.length > 0 &&
                        searchNotification
                          .filter((no: InAppNotification) =>
                            no.star.includes(userId),
                          )
                          .map((no: InAppNotification) => (
                            <div
                              key={no.id}
                              onClick={() => {
                                handleDataTransmit(no.id);
                                dispatch(setStar(no.star.includes(userId)));
                                if (!no.read.includes(userId)) {
                                  updateReadStatus(no.id, true);
                                }

                                dispatch(
                                  setReadStatus(no.read.includes(userId)),
                                );
                              }}
                            >
                              {thisNotification &&
                              thisNotification.id == no.id ? (
                                <NotificationCard
                                  no={no}
                                  currentUserId={userId}
                                  starStatus={reduxStar}
                                  currentNoId={thisNotification?.id ?? null}
                                  readStatus={reduxRead}
                                />
                              ) : (
                                <NotificationCard
                                  no={no}
                                  currentUserId={userId}
                                  currentNoId={thisNotification?.id ?? null}
                                />
                              )}
                            </div>
                          ))}
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
            {/* </ResizablePanelGroup> */}
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={63} minSize={48}>
            {/* <ResizablePanelGroup direction="vertical"> */}
            <ResizablePanel defaultSize={10} minSize={10} maxSize={10}>
              <div className="flex h-full flex-grow items-center justify-between  bg-white px-3 py-2 dark:bg-black">
                <span className="flex space-x-2 text-sm font-thin">
                  <Star
                    size={18}
                    className={`font-light text-stone-700  ${
                      starCondition
                        ? "dark:text-transparent"
                        : "dark:text-white/75"
                    }`}
                    strokeWidth="1.8"
                    fill={starCondition ? "#fcd34d" : "transparent"}
                    onClick={() => {
                      if (thisNotification) {
                        handleStar(thisNotification.id);
                      } else {
                        toast.error("You don't have any notification to star");
                      }
                    }}
                  />
                  {!thisNotification && (
                    <Trash2
                      size={18}
                      className="font-light text-stone-700 dark:text-white/75"
                      strokeWidth="1.8"
                      onClick={() => {
                        toast.error(
                          "Currently, you have no notifications to delete",
                        );
                      }}
                    />
                  )}
                  {thisNotification && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash2
                          size={18}
                          className="font-light text-stone-700 dark:text-white/75"
                          strokeWidth="1.8"
                        />
                      </AlertDialogTrigger>

                      <AlertDialogContent
                        className="circle-sm-exam dark:border-none"
                        aria-describedby="content"
                        aria-description="content"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your question and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="dark:border-none dark:shadow-sm dark:shadow-red-200">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white dark:border-none dark:shadow-sm dark:shadow-red-300 dark:hover:text-red-500"
                            onClick={() => {
                              if (thisNotification) {
                                deleteThisNotification(thisNotification?.id);
                              }
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="dark:border-stone-800"
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="mx-auto my-1 h-[1px] w-full bg-gray-300 dark:bg-stone-600" />
                    <DropdownMenuItem
                      className="w-full dark:text-stone-400"
                      onClick={() => {
                        if (thisNotification) {
                          if (reduxRead) {
                            updateReadStatus(thisNotification.id, false);
                            toast.success("You have marked this unread");
                          } else {
                            toast.error(
                              "Sorry,this notification is already unread",
                            );
                          }
                        } else {
                          toast.error("Sorry you have no notification chosen");
                        }
                      }}
                    >
                      mark this unread
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={90}>
              {/* <ResizablePanelGroup direction="vertical"> */}
              {thisNotification && (
                <>
                  <ResizablePanel defaultSize={15} minSize={13} maxSize={30}>
                    <div className="border-b-1   no-scrollbar  h-[100px] overflow-y-scroll bg-white p-2 pb-3 dark:bg-black">
                      <div className="flex items-center space-x-3 py-2 ">
                        <div className="-translate-y-3">
                          {thisNotification && (
                            <Image
                              src={JSON.parse(
                                thisNotification.user,
                              ).imageUrl.toString()}
                              alt="sender"
                              width={35}
                              height={35}
                              className="rounded-full"
                            />
                          )}
                        </div>

                        <div className="flex w-full flex-col ">
                          <div className="flex w-full items-center justify-between">
                            <span className="font-bold dark:text-teal-300">
                              {thisNotification &&
                                JSON.parse(thisNotification?.user).firstName +
                                  " " +
                                  JSON.parse(thisNotification?.user).lastName}
                            </span>{" "}
                            {thisNotification && (
                              <span className="text-sm dark:text-teal-300">
                                {convertToLocaleDateTime(thisNotification.time)}
                              </span>
                            )}
                          </div>
                          {thisNotification && (
                            <div className="mb-2">
                              <div className="mb-1 text-sm dark:text-white/75">
                                {thisNotification.subject}
                              </div>

                              <div className="flex flex-wrap space-x-2">
                                <span className="text-sm">To:</span>
                                <div className="flex space-x-0">
                                  {thisNotification.to.map(
                                    (t: any, index: number) => (
                                      <Badge
                                        key={index}
                                        className="scale-90 dark:bg-teal-500 dark:text-white"
                                      >
                                        {t}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle={true} />
                  <ResizablePanel defaultSize={15}>
                    <div className="no-scrollbar  h-[200px] overflow-y-scroll bg-white/75 p-2 py-3 text-sm dark:bg-black dark:text-white/80">
                      {thisNotification && thisNotification.description}
                    </div>
                  </ResizablePanel>

                  {(currentTab === "inbox" ||
                    !currentTab ||
                    currentTab === "email") && (
                    <ResizableHandle withHandle={false} disabled />
                  )}
                </>
              )}
              <ResizablePanel defaultSize={70} maxSize={70}>
                <div className="no-scrollbar relative flex h-full flex-grow flex-col  items-center justify-center overflow-y-scroll  bg-white/75 px-3  pb-2 pt-2  dark:bg-black">
                  {(currentTab === "inbox" || !currentTab) && (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={`${
                          !thisNotification ? "space-y-14" : "space-y-3"
                        } no-scrollbar  h-[1000px] w-full  overflow-y-scroll  py-4  dark:px-1`}
                      >
                        <FormField
                          control={form.control}
                          name="to"
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
              {/* </ResizablePanelGroup> */}
            </ResizablePanel>
            {/* </ResizablePanelGroup> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
};

export default Notification;
