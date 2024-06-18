import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { InAppNotification } from "@prisma/client";
import { timeAgo } from "@/app/[locale]/utils/timeAgo";

interface notificationCardProps {
  no: InAppNotification;
}
const NotificationCard = ({ no }: notificationCardProps) => {
  const { firstName, lastName, fullname } = JSON.parse(no.user);
  let username = (firstName + " " + lastName).trim()
    ? (firstName + " " + lastName).trim()
    : fullname
      ? fullname
      : "no name";
  return (
    <Card className="dark:glass relative mx-1 border-none bg-white p-4 shadow-sm shadow-stone-300 dark:shadow-teal-300">
      <CardTitle className="text-md flex w-full justify-between">
        <div className="mb-1 flex items-center space-x-2">
          {/* <UserButton
            appearance={{
              elements: {
                avatarBox: { width: "1.5rem", height: "1.5rem" },
              },
            }}
          /> */}
          <span className="text-sm font-bold ">{username}</span>
          <div className=" dark:circle-sm-note h-2 w-2 rounded-full  bg-blue-400  dark:bg-cyan-400 dark:shadow-lg"></div>
        </div>
        <span className="text-xs text-gray-400 dark:text-emerald-200/75">
          {timeAgo(no.time, new Date().toISOString())}
        </span>
      </CardTitle>

      <CardDescription className="mb-1 text-[12px]">
        {no.subject}
      </CardDescription>
      <CardContent className="m-0  p-0 text-xs font-normal text-stone-400">
        {no.description}
      </CardContent>
      <div className="mr-6 mt-2 flex flex-wrap items-center space-x-2">
        {/* dark:border-none rounded-md dark:shadow-sm dark:shadow-teal-300 */}
        {no.tag.map((tag, index) => (
          <Badge
            variant={tag.trim() === "new" ? null : "outline"}
            key={index}
            className={`rounded-md ${
              tag === "new"
                ? "dark:circle-sm-note  border-none bg-black text-white dark:bg-teal-400"
                : "dark:border-teal-300/55 dark:text-teal-300"
            }`}
          >
            {tag}
          </Badge>
        ))}
        {/* <Badge
          variant={"outline"}
          className="rounded-md dark:border-teal-300/55 dark:text-teal-300"
        >
          important
        </Badge>
        <Badge
          variant={"outline"}
          className="rounded-md dark:border-teal-300/55 dark:text-teal-300"
        >
          exam
        </Badge>
        <Badge className="dark:circle-sm-note rounded-md text-white dark:bg-teal-400">
          new
        </Badge> */}
      </div>
      <div className="absolute bottom-3 right-3  text-stone-500">
        <Star size={18} fill="#fcd34d" strokeWidth={0} />
      </div>

      {/* <div className="flex justify-end ">
        <div className="flex items-center space-x-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: "1.5rem", height: "1.5rem" },
              },
            }}
          />
          <span className="text-xs text-gray-400">Phil Zhu</span>
        </div>
      </div> */}
    </Card>
  );
};

export default NotificationCard;
