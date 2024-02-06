"use client";
import Pie from "@/components/Pie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const FrontResult = () => {
  const searchParams = useSearchParams();

  let wrong =
    Number(searchParams.get("total")) - Number(searchParams.get("correct"));
  let id = searchParams.get("id");
  // console.log(id);
  console.log(searchParams.get("id"));
  console.log(searchParams.get("choiceId"));

  return (
    <div
      className=" absolute left-[50%] top-[50%] flex w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center "
      suppressHydrationWarning={true}
    >
      <h2 className="mb-8 text-xl font-bold text-green-600">
        {Number(searchParams.get("correct")) /
          Number(searchParams.get("total")) ===
          1 && "Congratulations you got full mark !!!"}
      </h2>

      <Pie right={Number(searchParams.get("correct"))} wrong={wrong} />
      <h2 className="my-4 text-xl font-bold">Your Test Result</h2>
      {/* <p>{id}</p> */}
      <p>{"id:" + id}</p>
      <p>{"choiceId :" + searchParams.get("choiceId")}</p>
      <p className="text-red-500">
        {/* {Math.round(
          (Number(searchParams.correct) / Number(searchParams.total)) * 100,
        ) + "%"} */}
        {Number(searchParams.get("result")) + "%"}
      </p>
      <Button asChild className="mt-4">
        <Link
          href={{
            pathname: `/exam/${searchParams.get("id")}/report`,
            query: {
              id: `${id}`,
              choiceId: `${searchParams.get("choiceId")}`,
            },
          }}
        >
          get details report
        </Link>
      </Button>
    </div>
  );
};

export default FrontResult;
