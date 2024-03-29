"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import GrantAdmin from "./GrantAdmin";
import { User } from "@clerk/nextjs/server";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card } from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface queryProps {
  users: string;
  userId: string | null;
  totalUsersNumber: number;
}
const Userdata = ({ users, userId, totalUsersNumber }: queryProps) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const searchParams = useSearchParams();
  //   const [currentPage, setCurrentPage] = useState(
  //     Math.floor(offset / limit) + 1,
  //   );

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setUsersList(JSON.parse(users));
  }, [users]);
  const handleRightClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + limit);

    const newOffset = offset + limit;

    // Check if the potential new offset exceeds the total number of users
    if (newOffset < totalUsersNumber) {
      // If it doesn't exceed, then we can safely update the offset and navigate
      setOffset(newOffset);
    }
    router.replace(
      pathname +
        "?" +
        createQueryString("offset", newOffset.toString()) +
        "&" +
        createQueryString("limit", limit.toString()),
    );
  };
  const handleLeftClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset - limit);
    const newOffset = Math.max(0, offset - limit);
    if (newOffset == 0) {
      setOffset(0);
    }
    // Prevent negative offsets
    router.replace(
      pathname +
        "?" +
        createQueryString("offset", newOffset.toString()) +
        "&" +
        createQueryString("limit", limit.toString()),
    );
  };

  const handleLimitChange = (value: React.SetStateAction<number>) => {
    // Update the limit state
    setLimit(value);
    setOffset(0);

    router.push(
      pathname +
        "?" +
        createQueryString("limit", value.toString()) +
        "&" +
        createQueryString("offset", "0"),
    );
  };

  const handlePageClick = useCallback(
    (pageNumber: number) => {
      // Calculate the offset for the clicked page number
      //   setCurrentPage(pageNumber);
      const newOffset = (pageNumber - 1) * limit;
      setOffset(newOffset);
      // Replace the current entry in the history stack
      router.replace(
        pathname +
          "?" +
          createQueryString("offset", newOffset.toString()) +
          "&" +
          createQueryString("limit", limit.toString()),
      );
    },
    [limit, pathname, router],
  );

  const totalNumberOfPages = useMemo(() => {
    return Math.ceil(totalUsersNumber / limit);
  }, [totalUsersNumber, limit]);

  const currentPage = useMemo(() => {
    // Extract the offset from the router query and convert it to a page number
    const offsetFromQuery = Number(searchParams.get("offset")) || 0;
    return Math.floor(offsetFromQuery / limit) + 1;
  }, [limit, searchParams]);
  const paginationItems = useMemo(() => {
    const pages = [];

    for (let i = 1; i <= totalNumberOfPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(i);
            }}
            className={
              currentPage === i
                ? "isActive border border-gray-800 bg-white"
                : ""
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return pages;
  }, [totalNumberOfPages, handlePageClick, currentPage]);

  return (
    <Card className="my-5 flex w-full max-w-7xl items-center justify-center ">
      <Table>
        {/* <TableCaption>All users in this app with details.</TableCaption> */}
        <TableHeader className="bg-violet-500  ">
          <TableRow>
            <TableHead className="text-md min-w-[100px] py-5 font-semibold capitalize text-white">
              username
            </TableHead>
            <TableHead className="text-md font-semibold capitalize text-white ">
              email
            </TableHead>
            <TableHead className="text-md  font-semibold capitalize text-white ">
              role
            </TableHead>
            <TableHead className="text-md capitalizetext-white text-right font-semibold text-white">
              operations
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isClient &&
            usersList.map((user) => (
              <TableRow key={user.id} className="py-2">
                <TableCell className="py-2 font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>
                  {" "}
                  {
                    user.emailAddresses.find(
                      (email) => email.id === user.primaryEmailAddressId,
                    )?.emailAddress
                  }
                </TableCell>
                <TableCell>{user.publicMetadata.role as string}</TableCell>
                <TableCell className="flex justify-end space-x-4 text-right">
                  <GrantAdmin
                    userId={user.id}
                    userRole={user.publicMetadata.role as string}
                    currentUserId={userId ? userId : ""}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        {/* footer */}
        <TableFooter className=" ">
          <TableRow>
            <TableCell colSpan={3}>
              {isClient && (
                <div className="flex  w-full space-x-10  px-0">
                  <div className="flex  w-32 items-center space-x-3 ">
                    <span>Total:</span>
                    <span>{totalUsersNumber} </span>
                    <span>users</span>
                  </div>
                  <Pagination className="p-0">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          onClick={handleLeftClick}
                          className="space-x-2 bg-transparent text-black hover:bg-slate-100"
                          disabled={offset == 0}
                        >
                          <FaChevronLeft /> <span>Previous</span>
                        </Button>
                      </PaginationItem>
                      {/* <PaginationItem>
                        <Link href="#">1</Link>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <Link href="#">3</Link>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem> */}

                      {paginationItems}
                      <PaginationItem>
                        <Button
                          onClick={handleRightClick}
                          className="space-x-2 bg-transparent text-black hover:bg-slate-100"
                          disabled={offset + limit >= totalUsersNumber}
                        >
                          <span>Next</span> <FaChevronRight />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TableCell>
            <TableCell className="flex justify-end">
              <Select
                defaultValue="10"
                onValueChange={(value) => handleLimitChange(Number(value))}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="5">5 / Page</SelectItem>
                    <SelectItem value="10">10 / Page</SelectItem>
                    <SelectItem value="15">15 / Page</SelectItem>
                    <SelectItem value="20">20 / Page</SelectItem>
                    <SelectItem value="25">25 / Page</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

export default Userdata;
