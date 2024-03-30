import CommonNavbar from "@/components/CommonNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <CommonNavbar /> */}
      <main className="m-auto  max-w-[84rem] p-4">{children}</main>
    </>
  );
}
