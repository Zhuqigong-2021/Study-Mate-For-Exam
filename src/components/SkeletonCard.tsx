"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";

export function SkeletonCard() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="relative cursor-pointer  rounded-xl  shadow-gray-300 hover:shadow-gray-600 ">
      <CardHeader className="h-32 space-y-0">
        <CardTitle className="scale-y-90  text-lg text-gray-800">
          <Skeleton className="h-4 w-[50px] bg-stone-200" />
        </CardTitle>

        <div
          className="absolute -left-1 -right-1  top-16 h-5 w-1/2 rounded-l-sm rounded-br-sm rounded-tr-lg  bg-gradient-to-r from-stone-200 to-transparent pl-6 text-sm text-white lg:w-1/3"
          style={{
            clipPath: `polygon(100% 0%, 85% 48%, 100% 100%, 0.5% 100%, 0% 50%, 0.5% 0)`,
          }}
        ></div>
      </CardHeader>
      {!isClient && (
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
      )}
    </Card>
  );
}
