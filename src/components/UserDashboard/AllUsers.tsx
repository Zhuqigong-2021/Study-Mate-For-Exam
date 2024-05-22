"use client";
import { useState, useEffect } from "react";
import { User } from "@clerk/nextjs/server";

interface usersListType {
  usersList: User[];
  isSuperAdmin: boolean;
}
import Image from "next/image";
import UserWrapper from "./UserWrapper";
const AllUsers = ({ usersList, isSuperAdmin }: usersListType) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
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

  return (
    <div className="no-scrollbar mx-0 max-h-[520px] overflow-y-scroll md:px-6 ">
      {isClient && (
        <div>
          <UserWrapper usersList={usersList} isSuperAdmin={isSuperAdmin} />
        </div>
      )}
    </div>
  );
};

export default AllUsers;

//  {
//    isClient &&
//      usersList
//        .sort((a, b) => Number(b.lastSignInAt) - Number(a.lastSignInAt)) // Sort users by last sign-in date in descending order
//        .map((user, index: number) => {
//          const lastSignin = new Date(Number(user.lastSignInAt))
//            .toLocaleString("en-US", {
//              year: "numeric",
//              month: "numeric",
//              day: "numeric",
//            })
//            .toLocaleString();

//          return (
//            <div
//              key={index}
//              className="no-scrollbar flex  flex-wrap items-center gap-4 overflow-scroll   py-4 md:flex-nowrap"
//            >
//              <Image
//                src={user.imageUrl}
//                alt=""
//                width={40}
//                height={40}
//                className=" h-9 w-9 rounded-full  "
//              />
//              <div className="grid gap-1">
//                <span className="text-sm font-medium leading-none">
//                  {user.firstName} {user.lastName} {user.passwordEnabled}
//                </span>
//                <span className="text-sm text-muted-foreground">
//                  <TooltipProvider>
//                    <Tooltip>
//                      <TooltipTrigger asChild>
//                        <button className="m-0 inline rounded-none border-none  bg-transparent bg-white  p-0 text-sm text-muted-foreground shadow-none hover:bg-transparent hover:bg-white hover:text-sm hover:text-muted-foreground hover:shadow-none focus:outline-none focus:ring-0">
//                          {" "}
//                          {shortenString(
//                            user.emailAddresses
//                              .find(
//                                (email) =>
//                                  email.id === user.primaryEmailAddressId,
//                              )
//                              ?.emailAddress.toString(),
//                          )}
//                        </button>
//                      </TooltipTrigger>
//                      <TooltipContent>
//                        {
//                          user.emailAddresses.find(
//                            (email) => email.id === user.primaryEmailAddressId,
//                          )?.emailAddress
//                        }
//                      </TooltipContent>
//                    </Tooltip>
//                  </TooltipProvider>
//                </span>
//              </div>
//              <div className="ml-auto   text-[16px] font-normal md:font-semibold">

//                {(user.publicMetadata.role as string) || "user"}
//              </div>
//            </div>
//          );
//        });
//  }
