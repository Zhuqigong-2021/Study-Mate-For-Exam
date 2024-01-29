import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import yellowbook from "@/assets/neatperson.png";
export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes");
  return (
    <main
      className="-z-30 flex h-screen flex-col items-center justify-center gap-5  "
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${yellowbook.src})`,
        backgroundPosition: "center bottom ",
        zIndex: -50,
        backgroundSize: "cover",
        objectFit: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center gap-5 rounded-lg  px-5 py-10 md:absolute md:left-[2%] md:top-[20%] md:items-start lg:left-[16%]">
        <div className=" flex flex-col items-center gap-6 text-center md:items-start md:text-left ">
          <span className=" flex flex-col items-center space-y-5 text-2xl font-bold tracking-tight text-slate-800 md:items-start md:text-5xl lg:text-6xl">
            <span className="scale-y-90">Ignite Brilliance Now</span>
            <span className="scale-y-90">Smart Evaluation</span>
            <span className="scale-y-90">Learn Wise</span>
          </span>
        </div>
        <p className="max-w-[440px] py-8   font-sans leading-8 text-slate-800">
          build with Next.js - modern fullstack framework, shadcn.UI - popular
          UI component , chatGPT API, typescript-ensure type safy , prisma-
          manipulate database,mongoDB - store all app data.
        </p>
        {/* bg-[#f3c46e] */}
        <Button
          size="lg"
          asChild
          className="hover:white rounded-full bg-gradient-to-br from-teal-300 from-10% via-teal-400 via-30% to-teal-600 to-90% text-white shadow-lg shadow-[#9d824f]"
          // className="hover:white bg-gradient-to-bar   rounded-full from-teal-300 from-10% via-teal-400 via-30% to-teal-600 to-90% text-white shadow-lg shadow-[#9d824f]"
        >
          <Link href="/notes"> start using now</Link>
        </Button>
      </div>
    </main>
  );
}
