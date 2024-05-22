export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className=" m-auto max-w-[82rem]  p-4">{children}</main>
    </>
  );
}
