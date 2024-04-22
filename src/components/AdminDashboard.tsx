"use client";
import Link from "next/link";
import CountUp from "react-countup";

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  Divide,
  DollarSign,
  Menu,
  Package2,
  Search,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
interface UserProps {
  users: string;
  userId: string | null;
  totalUsersNumber: number;
  notesTotal: number;
  reportsNumber: number;
}
export function AdminDashboard({
  users,
  userId,
  totalUsersNumber,
  notesTotal,
  reportsNumber,
}: UserProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [dataMode, setDataMode] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setUsersList(JSON.parse(users));
  }, [users]);

  function shortenString(email: any) {
    const emailLength = 20; // Set the maximum length before shortening
    if (email.length > emailLength) {
      const atIndex = email.lastIndexOf("@");
      const domain = email.substring(atIndex); // Extract the domain part
      const firstPartLength = emailLength - domain.length - 3; // Calculate remaining length for the first part
      const firstPart = email.substring(0, firstPartLength); // Extract the first part of the email
      return firstPart + "..." + domain;
    }
    return email;
  }

  return (
    <div className="my-5 flex min-h-[900px] w-full max-w-[84rem]  flex-col overflow-hidden rounded-2xl border shadow-md">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/users"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Notifications
          </Link>
          <Link
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
          </Link>
        </nav>
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
          <DropdownMenu>
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
          </DropdownMenu>
        </div>
      </header>
      {pathname === "/admin/dashboard" && (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card
              x-chunk="dashboard-01-chunk-0"
              onClick={() => router.push("/admin/dashboard/users")}
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
                  {/* {totalUsersNumber ? totalUsersNumber : 0} */}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk=" dashboard-01-chunk-1">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CountUp
                    start={0}
                    end={totalUsersNumber ? +1000 : 0}
                    duration={3}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  daily subscriber increase
                </p>
              </CardContent>
            </Card>
            <Card
              x-chunk="dashboard-01-chunk-2"
              onClick={() => router.push("/notes/all")}
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
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card
              x-chunk="dashboard-01-chunk-3"
              onClick={() => router.push("/report")}
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
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3 lg:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row flex-wrap items-center">
                <div className="grid gap-2">
                  <CardTitle>Subscribers</CardTitle>
                  <CardDescription>
                    User analysis based on month.
                  </CardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="ml-auto gap-1"
                  onClick={() => setDataMode((prev) => !prev)}
                >
                  <Link href="#">
                    {!dataMode ? "View Data" : "View Trend"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {dataMode && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Users</TableHead>
                        <TableHead className="hidden xl:table-column">
                          Type
                        </TableHead>
                        <TableHead className="hidden xl:table-column">
                          Status
                        </TableHead>
                        <TableHead className="hidden xl:table-column">
                          Date
                        </TableHead>
                        <TableHead className="text-right">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Liam Johnson</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          Sale
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell xl:table-column lg:hidden">
                          2023-06-23
                        </TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Olivia Smith</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          Refund
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Declined
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell xl:table-column lg:hidden">
                          2023-06-24
                        </TableCell>
                        <TableCell className="text-right">$150.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Noah Williams</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            noah@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          Subscription
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell xl:table-column lg:hidden">
                          2023-06-25
                        </TableCell>
                        <TableCell className="text-right">$350.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Emma Brown</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          Sale
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell xl:table-column lg:hidden">
                          2023-06-26
                        </TableCell>
                        <TableCell className="text-right">$450.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Liam Johnson</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          Sale
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell xl:table-column lg:hidden">
                          2023-06-27
                        </TableCell>
                        <TableCell className="text-right">$550.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
                {!dataMode && (
                  <>
                    <div className=" mb-10 md:flex md:justify-between">
                      <UserBarChart />
                      <UserPieChart />
                    </div>
                    <UserAreaChart />
                  </>
                )}
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
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
                  {/* <CardContent className="no-scrollbar mt-4 grid max-h-[480px] gap-8 overflow-scroll "> */}

                  <TabsContent
                    value="users"
                    className="no-scrollbar mt-4 grid max-h-[480px] gap-8 overflow-scroll px-2"
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
                              className="flex flex-wrap items-center gap-4 md:flex-nowrap"
                            >
                              <Image
                                src={user.imageUrl}
                                alt=""
                                width={40}
                                height={40}
                                //   className="rounded-full"
                                className="hidden h-9 w-9 rounded-full sm:flex "
                              />
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
                              <div className="ml-auto  text-[16px] font-normal md:font-semibold">
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
                  <TabsContent value="password">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, youll be
                          logged out.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="current">Current password</Label>
                          <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new">New password</Label>
                          <Input id="new" type="password" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save password</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              {/* </CardContent> */}
            </Card>
          </div>
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
