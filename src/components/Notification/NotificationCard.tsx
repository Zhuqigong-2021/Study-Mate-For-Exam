import React, { useEffect, useState } from "react";
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
import { limitStringLength } from "@/app/[locale]/utils/limitStringLength";
import {
  checkReadStatus,
  checkStarStatus,
  updateStar,
} from "@/app/[locale]/action";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setStar as setStarStatus } from "../../Storage/Redux/starSlice";
import { useDispatch } from "react-redux";
import { usePostUsersMutation } from "@/Apis/userApi";
interface notificationCardProps {
  no: InAppNotification;
  currentUserId: string;
  starStatus?: boolean;
  readStatus?: boolean;
}
const NotificationCard = ({
  no,
  currentUserId,
  starStatus,
  readStatus,
}: notificationCardProps) => {
  const { firstName, lastName, fullname } = JSON.parse(no.user);

  const [star, setStar] = useState(false);
  const [read, setRead] = useState(false);
  const [postUser] = usePostUsersMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const result = async () => {
      const starStatusResponse = await checkStarStatus(currentUserId, no.id);
      if (starStatusResponse) setStar(starStatusResponse);
    };
    result();

    if (starStatus == false || starStatus == true) {
      setStar(starStatus);
      // useDispatch(setStar(starStatus))
    }
    return () => {};
  }, [currentUserId, no.id, starStatus]);

  useEffect(() => {
    const result = async () => {
      const readStatusResponse = await checkReadStatus(currentUserId, no.id);
      if (readStatusResponse) setRead(readStatusResponse);
    };
    result();

    if (readStatus == true || readStatus == false) {
      setRead(readStatus);
    }
    return () => {};
  }, [currentUserId, no.id, readStatus]);

  // useEffect(() => {
  //   const result = async () => {
  //     const starStatusResponse = await checkStarStatus(currentUserId, no.id);
  //     if (starStatusResponse) setStar(starStatus);
  //   };
  //   result();
  // }, [currentUserId, no.id, starStatus]);
  // const currentUserId = JSON.parse(no.user).id;
  let username = (firstName + " " + lastName).trim()
    ? (firstName + " " + lastName).trim()
    : fullname
      ? fullname
      : "no name";
  async function handleStar(
    event: React.MouseEvent<SVGSVGElement>,
    id: string,
  ) {
    event.stopPropagation();
    const res = await updateStar(currentUserId, id, !star);
    await postUser(id);
    // const response = await postUser(id);
    if (res) {
      setStar((star) => !star);

      // setStar((starStatus) => !starStatus);
      // console.log("star:" + star);
      dispatch(setStarStatus(!star));
      // console.log("reduxStar:" + reduxStar);
      toast.success("you star this notification");
    } else {
      toast.error("Something went wrong");
    }
  }

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
          {!read && (
            <div className=" dark:circle-sm-note h-2 w-2 rounded-full  bg-blue-400  dark:bg-cyan-400 dark:shadow-lg"></div>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-emerald-200/75">
          {timeAgo(no.time, new Date().toISOString())}
        </span>
      </CardTitle>

      <CardDescription className="mb-1 text-[12px]">
        {no.subject}
      </CardDescription>
      <CardContent className="m-0  p-0 text-xs font-normal text-stone-400">
        {limitStringLength(no.description)}
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
        <Star
          size={18}
          fill={star ? "#fcd34d" : "transparent"}
          strokeWidth={star ? 0 : 1}
          onClick={(event: React.MouseEvent<SVGSVGElement>) => {
            handleStar(event, no.id);
          }}
        />
      </div>
    </Card>
  );
};

export default NotificationCard;
