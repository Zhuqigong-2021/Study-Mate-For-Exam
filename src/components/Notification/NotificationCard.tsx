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

const NotificationCard = () => {
  return (
    <Card className="dark:glass relative mx-1 border-none bg-white p-4 shadow-sm shadow-stone-300 dark:shadow-teal-300">
      <CardTitle className="text-md flex w-full justify-between">
        <div className="flex items-center space-x-2">
          {/* <UserButton
            appearance={{
              elements: {
                avatarBox: { width: "1.5rem", height: "1.5rem" },
              },
            }}
          /> */}
          <span className="text-sm font-bold ">Phil Zhu</span>{" "}
          <div className=" dark:circle-sm-note h-2 w-2 rounded-full  bg-blue-400  dark:bg-cyan-400 dark:shadow-lg"></div>
        </div>
        <span className="text-xs text-gray-400 dark:text-emerald-200/75">
          8 months ago
        </span>
      </CardTitle>

      <CardDescription className="mb-1 text-[12px]">
        New feature
      </CardDescription>
      <CardContent className="m-0  p-0 text-xs font-normal text-stone-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
        quibusdam quo eveniet animi, nesciunt. .......
      </CardContent>
      <div className="mr-6 mt-2 flex flex-wrap items-center space-x-2">
        {/* dark:border-none rounded-md dark:shadow-sm dark:shadow-teal-300 */}
        <Badge
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
        </Badge>
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
