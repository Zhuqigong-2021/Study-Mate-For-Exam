"use client";
import Link from "next/link";
import CountUp from "react-countup";
import "react-circular-progressbar/dist/styles.css";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  Divide,
  DollarSign,
  Mail,
  Menu,
  Package2,
  PieChart,
  Search,
  Settings,
  Sigma,
  Users,
} from "lucide-react";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RxDashboard } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@clerk/nextjs/server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import UserAreaChart from "./UserChart/UserAreaChart";
import UserBarChart from "./UserChart/UserBarChart";
import UserPieChart from "./UserChart/UserPieChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Prisma, Report } from "@prisma/client";
import { dateFormatter } from "@/app/utils/dateFormatter";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import AllUsers from "./UserDashboard/AllUsers";
import { UserButton } from "@clerk/nextjs";

interface UserProps {
  users: string;
  userId: string | null;
  totalUsersNumber: number;
  notesTotal: number;
  reportsNumber: number;
  reports: string;
  isSuperAdmin: boolean;
  numberOfNotesCreatedThisMonth: number;
}
// {
//     id: string;
//     noteId: string;
//     result: number;
//     batch: number;
//     userId: string;
//     userName: string;
//     time: string;
//     noteTitle: string;
//     choiceId: Prisma.JsonValue;
//     reportListId: string;
//     submittedAt: Date;
//   }[];
export function AdminDashboard({
  users,
  userId,
  totalUsersNumber,
  notesTotal,
  reportsNumber,
  reports,
  isSuperAdmin,
  numberOfNotesCreatedThisMonth,
}: UserProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [dataMode, setDataMode] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setUsersList(JSON.parse(users));
    // console.log(JSON.parse(users));
  }, [users]);
  useEffect(() => {
    setReportsList(JSON.parse(reports));
  }, [reports]);

  function shortenString(email: any) {
    const emailLength = 18; // Set the maximum length before shortening
    if (email.length > emailLength) {
      const atIndex = email.lastIndexOf("@");
      const domain = email.substring(atIndex); // Extract the domain part
      const firstPartLength = emailLength - domain.length - 3; // Calculate remaining length for the first part
      const firstPart = email.substring(0, firstPartLength); // Extract the first part of the email
      return firstPart + "..." + domain;
    }
    return email;
  }

  // Function to get the timestamp for 30 days ago
  function getThirtyDaysAgo() {
    const now = new Date();
    now.setDate(now.getDate() - 30); // Set the date to 30 days before today
    now.setHours(0, 0, 0, 0); // Optional: Adjust this if you want the exact time 30 days ago
    return now.getTime();
  }

  // Calculate the timestamp for 30 days ago
  const thirtyDaysAgo = getThirtyDaysAgo();

  // Filter the list to get users created in the last 30 days
  const totalRecentUsers = usersList.filter((user) => {
    const createdAtTimestamp = user.createdAt;
    return createdAtTimestamp >= thirtyDaysAgo;
  }).length;
  const totalLastMonthUsers = totalUsersNumber - totalRecentUsers;
  const totalMonthlyIncreaseUsers = Math.round(
    (totalRecentUsers / totalLastMonthUsers) * 100,
  );
  const totalLastMonthNotes = notesTotal - numberOfNotesCreatedThisMonth;
  const totalMonthlyIncreaseNotes = Math.round(
    (numberOfNotesCreatedThisMonth / totalLastMonthNotes) * 100,
  );

  function isDateInCurrentMonth(date: Date) {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  // Function to count reports submitted in the current month
  function countReportsThisMonth(reports: any[]) {
    return reports.filter((report) => {
      const submittedDate = new Date(report.submittedAt);
      return isDateInCurrentMonth(submittedDate);
    }).length;
  }

  // Calculate the number of reports generated this month
  const reportsThisMonth = countReportsThisMonth(reportsList);

  //handle bar chart for the users
  const DAY_IN_MS = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight
  const startRangeDate = new Date(today.getTime() - 29 * DAY_IN_MS); // Starting from 30 days ago

  function formatDate(timestamp: any) {
    const date = new Date(timestamp);
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  }

  const usersPerDay: any = {};
  let initialTotalUsers = 0; // Initial total users before the start of the date range

  // Count users before the start of the date range
  usersList.forEach((user) => {
    const userDate = new Date(user.createdAt);
    if (userDate < startRangeDate) {
      initialTotalUsers++;
    }
  });

  // Initialize each day with the correct starting total
  for (let i = 0; i <= 30; i++) {
    const currentDate = new Date(startRangeDate.getTime() + i * DAY_IN_MS);
    if (currentDate > today) break; // Stop adding days beyond today
    const dateKey = formatDate(currentDate);
    usersPerDay[dateKey] = { new: 0, total: initialTotalUsers };
  }

  // Populate the new and total counts
  usersList.forEach((user) => {
    const dateKey = formatDate(user.createdAt);
    if (dateKey in usersPerDay) {
      usersPerDay[dateKey].new++;
      // Only increase the total for this day and subsequent days
      for (let j = 0; j <= 30; j++) {
        const futureDate = new Date(startRangeDate.getTime() + j * DAY_IN_MS);
        if (futureDate > today) break; // Stop processing dates beyond today
        const futureKey = formatDate(futureDate);
        if (futureDate >= new Date(user.createdAt)) {
          usersPerDay[futureKey].total++;
        }
      }
    }
  });

  // Convert to array for charting
  const chartData = Object.keys(usersPerDay).map((date) => ({
    name: date,
    new: usersPerDay[date].new,
    total: usersPerDay[date].total,
  }));

  console.log(users);
  return (
    <div className="my-5 flex min-h-[900px] w-full max-w-[84rem]  flex-col overflow-hidden rounded-[1.5rem]  border shadow-md">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            {(currentTab == "dashboard" || currentTab == "") && (
              <RxDashboard className="h-6 w-6" />
            )}
            {currentTab == "notification" && <Mail className="h-6 w-6" />}
            {currentTab == "statistics" && <PieChart className="h-6 w-6" />}
            {currentTab == "settings" && <Settings className="h-6 w-6" />}
            <span className="sr-only">Acme Inc</span>
          </Link>
          <button
            className={`${
              currentTab == "dashboard"
                ? "text-foreground"
                : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
            onClick={() => setCurrentTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            // href="/admin/dashboard/users"
            className={`${
              currentTab == "notification"
                ? "text-foreground"
                : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
            onClick={() => setCurrentTab("notification")}
          >
            Notifications
          </button>
          <button
            // href="/admin/dashboard/users"
            onClick={() => setCurrentTab("statistics")}
            className={`${
              currentTab == "statistics"
                ? "text-foreground"
                : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            Statistics
          </button>
          <button
            // href="/admin/dashboard/users"
            onClick={() => setCurrentTab("settings")}
            className={`${
              currentTab == "settings"
                ? "text-foreground"
                : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            Settings
          </button>
          {/* <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Analytics
          </Link> */}
        </nav>
        {/* <Tabs
          defaultValue="dashboard"
          className="hidden  flex-col gap-6 bg-transparent text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
        >
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <RxDashboard className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <TabsList className="grid w-full grid-cols-3 space-x-5 bg-transparent">
            <TabsTrigger value="dashboard" className="border-none">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="notification">Notification</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="account"></TabsContent>
        </Tabs> */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link href="/admin/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link
                href="/admin/dashboard/users"
                className="text-muted-foreground hover:text-foreground"
              >
                Notifications
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: "2rem", height: "2rem" },
              },
            }}
          />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </header>

      {currentTab === "dashboard" && (
        <main className="flex flex-1 flex-col  gap-2  bg-neutral-50 p-4 md:gap-4 md:p-8">
          <div className="grid gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            <Card
              x-chunk="dashboard-01-chunk-0"
              onClick={() => router.push("/admin/dashboard/users")}
              className="rounded-[1rem] "
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  Total Subscribers
                </CardTitle>
                {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                <Sigma className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold ">
                  <CountUp
                    start={0}
                    end={totalUsersNumber ? totalUsersNumber : 0}
                    duration={3}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  +{totalMonthlyIncreaseUsers}% since this month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk=" dashboard-01-chunk-1" className="rounded-[1rem]">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp start={0} end={totalRecentUsers ?? 0} duration={3} />
                </div>
                <p className="text-xs text-muted-foreground">
                  +{totalRecentUsers} new users from this month
                </p>
              </CardContent>
            </Card>
            <Card
              x-chunk="dashboard-01-chunk-2"
              onClick={() => router.push("/notes/all")}
              className="rounded-[1rem]"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notes</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp start={0} end={notesTotal} duration={1.5} />
                  {/* {notesTotal} */}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{totalMonthlyIncreaseNotes}% from last month
                </p>
              </CardContent>
            </Card>
            <Card
              x-chunk="dashboard-01-chunk-3"
              onClick={() => router.push("/report")}
              className="rounded-[1rem]"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Test Report
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {" "}
                  <CountUp start={0} end={reportsNumber} duration={1.5} />
                </div>
                <p className="text-xs text-muted-foreground">
                  +{reportsThisMonth} since this month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-2    md:grid-cols-2 md:gap-4 xl:grid-cols-3 lg:grid-cols-3">
            <Card
              className={`overflow-hidden rounded-[1rem] border-none ${
                dataMode ? "bg-white" : "bg-neutral-50"
              }  xl:col-span-2`}
              x-chunk="dashboard-01-chunk-4 "
            >
              <CardHeader
                className={`flex flex-row flex-wrap items-center rounded-[1rem] ${
                  dataMode
                    ? "border-none"
                    : "border-none bg-gradient-to-r from-violet-400 to-indigo-400 text-white shadow-sm shadow-gray-300"
                }  bg-white`}
              >
                <div className="grid gap-2">
                  <CardTitle>Subscribers</CardTitle>
                  <CardDescription
                    className={`${dataMode ? "" : "text-white"}`}
                  >
                    User analysis based on month.
                  </CardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  className={`ml-auto gap-1 rounded-full px-4 ${
                    dataMode ? "" : "bg-white text-indigo-600"
                  }`}
                  onClick={() => setDataMode((prev) => !prev)}
                >
                  <Link href="#">
                    {!dataMode ? "View Data" : "View Trend"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              {/* <CardContent> */}
              {dataMode && (
                <>
                  <AllUsers usersList={usersList} isSuperAdmin={isSuperAdmin} />
                </>
              )}
              {!dataMode && (
                <>
                  <div className=" gap-4  py-4 md:flex md:justify-between">
                    <div className="w-full rounded-[1rem]  border-none border-gray-300 bg-white p-2 py-4 text-left shadow-sm shadow-gray-300">
                      <h2 className="mb-2 pl-4 text-[15px] font-semibold">
                        New Users Increase Monthly
                      </h2>
                      <UserBarChart data={chartData} />
                    </div>
                    <div className="mt-4 w-full rounded-[1rem] border-none border-gray-300 bg-white p-2 py-4 text-left shadow-sm shadow-gray-300 md:mt-0 ">
                      <h2 className="mb-2 pl-4 text-[15px] font-semibold">
                        Users Propertion in Each Month
                      </h2>
                      <UserPieChart />
                    </div>
                  </div>

                  <div className=" w-full rounded-[1rem]   border-none border-gray-300 bg-white py-4 text-left shadow-sm shadow-gray-300">
                    <h2 className="mb-2  pl-6 text-[15px] font-semibold">
                      New Users and Total Users trend
                    </h2>
                    <UserAreaChart data={chartData} />
                  </div>
                </>
              )}
              {/* </CardContent> */}
            </Card>
            <Card x-chunk="dashboard-01-chunk-5 " className="rounded-[1rem]">
              <CardHeader>
                {isClient && <CardTitle>Recent Activities</CardTitle>}
                {!isClient && (
                  <Skeleton className="h-5 w-[150px]  bg-stone-200"></Skeleton>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="users" className="w-full">
                  {isClient && (
                    <TabsList className="mb-10  grid w-full grid-cols-2 ">
                      <TabsTrigger value="users">Users</TabsTrigger>
                      <TabsTrigger value="results">Results</TabsTrigger>
                    </TabsList>
                  )}
                  {!isClient && (
                    <Skeleton className="mb-10 mt-1 grid h-10 w-full grid-cols-2" />
                  )}

                  <TabsContent
                    value="users"
                    className={`no-scrollbar mt-4 grid ${
                      dataMode ? "max-h-[480px]" : "max-h-[530px]"
                    } gap-8 overflow-scroll px-2`}
                  >
                    {isClient &&
                      usersList
                        .sort(
                          (a, b) =>
                            Number(b.lastSignInAt) - Number(a.lastSignInAt),
                        ) // Sort users by last sign-in date in descending order
                        // .slice(0, 6)
                        .map((user, index: number) => {
                          const lastSignin = new Date(Number(user.lastSignInAt))
                            .toLocaleString("en-US", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })
                            .toLocaleString();
                          return (
                            <div
                              key={index}
                              className="relative flex flex-wrap items-center gap-4 md:flex-nowrap"
                            >
                              <Image
                                src={user.imageUrl}
                                alt=""
                                width={40}
                                height={40}
                                className=" h-9 w-9 rounded-full  "
                              />
                              {/* <div
                                className={`${
                                  userId == user.id && userId
                                    ? "bg-green-400"
                                    : "bg-gray-300"
                                } absolute left-[1.65rem] top-[0.15rem] h-[0.65rem] w-[0.65rem] rounded-full border border-white`}
                              ></div> */}
                              <div className="grid gap-1">
                                <span className="text-sm font-medium leading-none">
                                  {user.firstName} {user.lastName}{" "}
                                  {user.passwordEnabled}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {/* {shortenString()} */}
                                  {/* {shortenString(
                              user.emailAddresses
                                .find(
                                  (email) =>
                                    email.id === user.primaryEmailAddressId,
                                )
                                ?.emailAddress.toString(),
                            )} */}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button className="m-0 inline rounded-none border-none  bg-transparent bg-white  p-0 text-sm text-muted-foreground shadow-none hover:bg-transparent hover:bg-white hover:text-sm hover:text-muted-foreground hover:shadow-none focus:outline-none focus:ring-0">
                                          {" "}
                                          {shortenString(
                                            user.emailAddresses
                                              .find(
                                                (email) =>
                                                  email.id ===
                                                  user.primaryEmailAddressId,
                                              )
                                              ?.emailAddress.toString(),
                                          )}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {
                                          user.emailAddresses.find(
                                            (email) =>
                                              email.id ===
                                              user.primaryEmailAddressId,
                                          )?.emailAddress
                                        }
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </span>
                              </div>
                              <div className="ml-auto   text-[16px] font-normal md:font-semibold">
                                {" "}
                                {lastSignin}
                              </div>
                            </div>
                          );
                        })}
                    {!isClient && (
                      <div>
                        {Array.from({ length: 7 }, (_: any, index: number) => (
                          <div
                            className="mb-8 flex flex-wrap items-center gap-4"
                            key={index}
                          >
                            <Skeleton className="hidden h-9 w-9 rounded-full bg-stone-200 sm:flex"></Skeleton>
                            <div className="grid gap-y-2">
                              <Skeleton className="h-4 w-[100px]"></Skeleton>

                              <Skeleton className="h-3 w-[150px]"></Skeleton>
                            </div>
                            <Skeleton className="ml-auto h-4 w-[80px] font-medium"></Skeleton>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="results"
                    className="no-scrollbar -mt-1 grid max-h-[480px] gap-8 overflow-scroll px-2"
                  >
                    {isClient &&
                      reportsList
                        .sort(
                          (a, b) =>
                            new Date(b.submittedAt).getTime() -
                            new Date(a.submittedAt).getTime(),
                        )
                        // .slice(0, 6)
                        .map((report, index: number) => {
                          const examTime = new Date(report.submittedAt)
                            .toLocaleString("en-US", {
                              month: "numeric", // 'numeric', '2-digit', 'short', 'long'
                              day: "numeric", // 'numeric', '2-digit'
                              hour: "numeric", // 'numeric', '2-digit'
                              minute: "2-digit", // 'numeric', '2-digit'
                              hour12: true, // Use 12-hour time (use `false` for 24-hour format)
                            })
                            .toLocaleString();
                          return (
                            <div
                              key={index}
                              className="flex flex-wrap items-center gap-4 md:flex-nowrap"
                            >
                              {/* <Image
                                src={report.imageUrl}
                                alt=""
                                width={40}
                                height={40}
                               
                                className="hidden h-9 w-9 rounded-full sm:flex "
                              /> */}

                              <div className="flex h-10 w-10 items-center justify-center font-semibold ">
                                <CircularProgressbar
                                  value={Number(report.result)}
                                  text={`${report.result}%`}
                                  strokeWidth={10}
                                  styles={buildStyles({
                                    textColor:
                                      Number(report.result) == 100
                                        ? "#14b8a6"
                                        : Number(report.result) == 0
                                          ? "#f87171"
                                          : "#404040",
                                    // rotation: 0.05,
                                    textSize: "28px",
                                    pathColor:
                                      Number(report.result) >= 50
                                        ? "#5eead4"
                                        : "#f3f4f6",
                                    trailColor:
                                      Number(report.result) !== 0 &&
                                      Number(report.result) >= 50
                                        ? "#f3f4f6"
                                        : Number(report.result) < 50
                                          ? "#f87171"
                                          : "#f87171",
                                  })}
                                />
                              </div>
                              <div className="grid gap-1">
                                <span className="text-sm font-medium leading-none">
                                  {report.userName}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        {/* {report.userId} */}
                                        <button className="m-0 inline rounded-none border-none  bg-transparent bg-white  p-0 text-sm text-muted-foreground shadow-none hover:bg-transparent hover:bg-white hover:text-sm hover:text-muted-foreground hover:shadow-none focus:outline-none focus:ring-0">
                                          {shortenString(report.userEmail)}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {report.userEmail}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </span>
                              </div>
                              <div className="ml-auto   text-[14px] font-normal md:font-semibold">
                                {examTime}
                              </div>
                            </div>
                          );
                        })}
                    {!isClient && (
                      <div>
                        {Array.from({ length: 7 }, (_: any, index: number) => (
                          <div
                            className="mb-8 flex flex-wrap items-center gap-4"
                            key={index}
                          >
                            <Skeleton className="hidden h-9 w-9 rounded-full bg-stone-200 sm:flex"></Skeleton>
                            <div className="grid gap-y-2">
                              <Skeleton className="h-4 w-[100px]"></Skeleton>

                              <Skeleton className="h-3 w-[150px]"></Skeleton>
                            </div>
                            <Skeleton className="ml-auto h-4 w-[80px] font-medium"></Skeleton>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              {/* </CardContent> */}
            </Card>
          </div>
        </main>
      )}
      {currentTab === "notification" && (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          notification
        </main>
      )}
      {currentTab === "statistics" && (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          statistics
        </main>
      )}
      {currentTab === "settings" && (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          settings
        </main>
      )}
    </div>
  );
}

//  <div className="flex items-center gap-4">
//                   <Avatar className="hidden h-9 w-9 sm:flex">
//                     <AvatarFallback>JL</AvatarFallback>
//                   </Avatar>
//                   <div className="grid gap-1">
//                     <p className="text-sm font-medium leading-none">
//                       Jackson Lee
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       jackson.lee@email.com
//                     </p>
//                   </div>
//                   <div className="ml-auto font-medium">+$39.00</div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="hidden h-9 w-9 sm:flex">
//                     <AvatarFallback>IN</AvatarFallback>
//                   </Avatar>
//                   <div className="grid gap-1">
//                     <p className="text-sm font-medium leading-none">
//                       Isabella Nguyen
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       isabella.nguyen@email.com
//                     </p>
//                   </div>
//                   <div className="ml-auto font-medium">+$299.00</div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="hidden h-9 w-9 sm:flex">
//                     <AvatarFallback>WK</AvatarFallback>
//                   </Avatar>
//                   <div className="grid gap-1">
//                     <p className="text-sm font-medium leading-none">
//                       William Kim
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       will@email.com
//                     </p>
//                   </div>
//                   <div className="ml-auto font-medium">+$99.00</div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="hidden h-9 w-9 sm:flex">

//                     <AvatarFallback>SD</AvatarFallback>
//                   </Avatar>
//                   <div className="grid gap-1">
//                     <p className="text-sm font-medium leading-none">
//                       Sofia Davis
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       sofia.davis@email.com
//                     </p>
//                   </div>
//                   <div className="ml-auto font-medium">+$39.00</div>
//                 </div>
