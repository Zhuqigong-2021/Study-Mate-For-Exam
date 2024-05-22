"use client";
import Pie from "@/components/Pie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Cookie from "js-cookie";
import { useTranslations } from "next-intl";
const FrontResult = () => {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState(Cookie.get("NEXT_LOCALE"));
  const e = useTranslations("Exam");
  let wrong =
    Number(searchParams.get("total")) - Number(searchParams.get("correct"));
  let id = searchParams.get("id");
  // const pathname = usePathname();
  // alert(pathname);
  return (
    <div
      className=" fixed left-[50%] top-[50%] flex w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center "
      suppressHydrationWarning={true}
    >
      <h2 className="mb-8 text-xl font-bold text-green-600">
        {Number(searchParams.get("correct")) /
          Number(searchParams.get("total")) ===
          1 && e("result.fullmark")}
      </h2>

      <Pie right={Number(searchParams.get("correct"))} wrong={wrong} />
      <h2 className="my-4 text-xl font-bold">{e("result.title")}</h2>

      <p className="text-red-500">{Number(searchParams.get("result")) + "%"}</p>
      <Button asChild className="mt-4">
        <Link
          href={{
            pathname: `/${lang}/exam/${searchParams.get("id")}/report`,
            query: {
              noteId: `${id}`,
              choiceId: `${searchParams.get("choiceId")}`,
              batch: `${searchParams.get("batch")}`,
            },
          }}
        >
          {e("result.button")}
        </Link>
      </Button>
    </div>
  );
};

export default FrontResult;
