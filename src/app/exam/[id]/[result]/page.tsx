// import Pie from "@/components/Pie";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import React from "react";

// const page = ({
//   searchParams,
// }: {
//   searchParams: {
//     correct: string;
//     total: string;
//   };
// }) => {
//   let wrong = Number(searchParams.total) - Number(searchParams.correct);
//   return (
//     <div
//       className=" absolute left-[50%] top-[50%] flex w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center "
//       suppressHydrationWarning={true}
//     >
//       <h2 className="mb-8 text-xl font-bold text-green-600">
//         {Number(searchParams.correct) / Number(searchParams.total) === 1 &&
//           "Congratulations you got full mark !!!"}
//       </h2>

//       <Pie right={Number(searchParams.correct)} wrong={wrong} />
//       <h2 className="my-4 text-xl font-bold">Your Test Result</h2>
//       <p className="text-red">
//         {(Number(searchParams.correct) / Number(searchParams.total)) * 100 +
//           "%"}
//       </p>
//       <Button asChild className="mt-4">
//         <Link href="/exam">back</Link>
//       </Button>
//     </div>
//   );
// };

// export default page;
