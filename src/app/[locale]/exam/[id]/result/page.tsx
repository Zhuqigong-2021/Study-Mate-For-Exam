import Pie from "@/components/Pie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { idProps } from "../page";
import FrontResult from "@/components/FrontResult";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
// export const metadata: Metadata = {
//   title: "Study Mate - Exam Result",
// };
interface Params {
  locale: string;
}

interface Context {
  params: Params;
}

export async function generateMetadata({ params: { locale } }: Context) {
  const t = await getTranslations({ locale, namespace: "Exam" });

  return {
    title: t("result.metadata"),
  };
}
const page = ({
  searchParams,
}: {
  searchParams: {
    id: string;
    correct: string;
    total: string;
    result: string;
    choiceId: string;
    batch: string;
  };
}) => {
  let wrong = Number(searchParams.total) - Number(searchParams.correct);
  let id = searchParams.id;
  // console.log(id);

  return (
    <FrontResult />
    // <div
    //   className=" absolute left-[50%] top-[50%] flex w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center "
    //   suppressHydrationWarning={true}
    // >
    //   <h2 className="mb-8 text-xl font-bold text-green-600">
    //     {Number(searchParams.correct) / Number(searchParams.total) === 1 &&
    //       "Congratulations you got full mark !!!"}
    //   </h2>

    //   <Pie right={Number(searchParams.correct)} wrong={wrong} />
    //   <h2 className="my-4 text-xl font-bold">Your Test Result</h2>

    //   <p className="text-red-500">
    //     {/* {Math.round(
    //       (Number(searchParams.correct) / Number(searchParams.total)) * 100,
    //     ) + "%"} */}
    //     {Number(searchParams.result) + "%"}
    //   </p>
    //   <Button asChild className="mt-4">
    //     <Link
    //       href={{
    //         pathname: `/exam/${searchParams.id}/report`,
    //         query: {
    //           id: `${searchParams.id}`,
    //           choiceId: `${searchParams.choiceId}`,
    //         },
    //       }}
    //     >
    //       get details report
    //     </Link>
    //   </Button>
    // </div>
  );
};

export default page;
