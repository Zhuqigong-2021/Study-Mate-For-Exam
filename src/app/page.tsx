import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import yellowbook from "@/assets/neatperson.png";
import Drawer from "@/components/Drawer";
import { checkRole } from "./utils/roles/role";
export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes/public");
  const isAdmin = checkRole("admin");
  return (
    // flex-col items-center justify-center
    <main
      className="-z-30 m-auto flex h-screen  justify-center gap-5 overflow-hidden  "
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${yellowbook.src})`,
        backgroundPosition: "center bottom ",
        zIndex: -50,
        backgroundSize: "cover",
        objectFit: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3   ">
        {/* md:absolute md:left-[2%] md:top-[20%] md:items-start lg:left-[16%] */}
        <div className=" mx-5 ml-5 flex flex-col items-center justify-center gap-5 rounded-lg  py-5 pt-16 sm:items-start lg:mx-0 ">
          <div className=" flex max-w-[1200px] flex-col items-center gap-6 text-center md:items-start md:text-left  ">
            <span className="flex  flex-col items-center space-y-5  text-2xl font-[750] tracking-tight text-slate-800 md:items-start md:text-5xl  lg:text-6xl">
              <span className=" scale-y-90 lg:block lg:whitespace-nowrap">
                Ignite Brilliance Now
              </span>
              <span className="scale-y-90 whitespace-nowrap">
                Smart Evaluation
              </span>
              <span className="scale-y-90 whitespace-nowrap">Learn Wise</span>
            </span>
          </div>
          <p className=" max-w-[440px]  py-8  text-left font-sans leading-8   text-slate-800 md:items-start">
            AI powered note-taking exam system which allows you to take notes ,
            review cards,insert questions, take exams and many more ...
          </p>
          {/* bg-[#f3c46e] */}
          <Button
            size="lg"
            asChild
            className="hover:white w-44 rounded-full bg-gradient-to-br from-teal-300 from-10% via-teal-400 via-30% to-teal-600 to-90% text-white shadow-lg shadow-[#9d824f]"
            // className="hover:white bg-gradient-to-bar   rounded-full from-teal-300 from-10% via-teal-400 via-30% to-teal-600 to-90% text-white shadow-lg shadow-[#9d824f]"
          >
            <Link href="/notes/public"> start using now</Link>
          </Button>
        </div>

        <div className="pointer-events-none -z-50   hidden items-center gap-2 space-x-5  font-semibold opacity-0 md:flex ">
          <div className="flex md:hidden xl:hidden lg:hidden">
            <Drawer isAdmin={isAdmin} userId={userId ?? ""} />
          </div>

          <div className="hidden  font-light md:flex md:space-x-5 lg:flex lg:space-x-16">
            <Link
              href="/notes"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              note
            </Link>
            <Link
              href="/wildcard"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              wildcard
            </Link>
            <Link
              href="/exam"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              exam
            </Link>
            <Link
              href="/review"
              className="underline-offset-1 hover:scale-105 hover:text-teal-700"
            >
              review
            </Link>
            {/* <Link
                href="/bookmark"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                bookmark
              </Link> */}

            <button
              className="m-0 bg-transparent p-0"
              // onClick={() => router.refresh()}
            >
              <Link
                href="/bookmark"
                className="underline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                bookmark
              </Link>
            </button>
          </div>
          <div className="hidden md:flex xl:flex lg:flex">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: { width: "2.5rem", height: "2.5rem" },
                },
              }}
            />
          </div>

          {
            //   bg-[#f3c46e]
            <Button
              className="rounded-full   bg-white px-8 py-4  text-slate-800 hover:text-white"
              asChild
            >
              <Link href="/notes"> registration</Link>
            </Button>
          }
        </div>
      </div>
    </main>
  );
}
