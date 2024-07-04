"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";

export function CardPlaceholder() {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="relative cursor-pointer  rounded-xl   hover:shadow-gray-600 dark:border-none dark:shadow dark:shadow-teal-600">
      <CardHeader className="h-16 space-y-2">
        <CardTitle className="flex  scale-y-90 justify-between text-lg text-gray-800">
          <Skeleton className="h-4 w-[50px] bg-stone-300 dark:bg-stone-200" />{" "}
          <Skeleton className="h-2 w-[60px] bg-stone-300 dark:bg-stone-300" />
        </CardTitle>
        <CardDescription className="h-10">
          <Skeleton className=" h-3 w-[100px] bg-stone-400 dark:bg-stone-500" />
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-2 space-y-2">
        <Skeleton className=" h-2 w-full bg-stone-300 dark:bg-stone-600" />
        <Skeleton className=" h-2 w-[85%] bg-stone-300 dark:bg-stone-600" />
      </CardContent>
      <CardFooter className=" flex h-8  items-center justify-between">
        <Skeleton className=" h-6 w-[40px] bg-stone-200 dark:bg-stone-300" />
        <Star
          //   fill="#f5f5f4"
          //   #a8a29e
          fill={`${theme == "dark" ? "#f5f5f4" : "#a8a29e"}`}
          className="border-none"
          strokeWidth={0}
          size={20}
        />
      </CardFooter>
      {/* {!isClient && (
        <CardContent className={` h-14 rounded-b-xl  px-6 py-2`}>
          <span className="absolute bottom-4 left-6 flex items-center space-x-2">
            {!isClient && (
              <Skeleton className="h-5 w-5 rounded-full bg-stone-200" />
            )}
            {!isClient && <Skeleton className="h-3 w-[40px] bg-stone-100" />}
          </span>
          {!isClient && (
            <Skeleton className="absolute bottom-4 right-6 h-3 w-[90px] bg-stone-100 text-xs" />
          )}
        </CardContent>
      )} */}
    </Card>
  );
}
