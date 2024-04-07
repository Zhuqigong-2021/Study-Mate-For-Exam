export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="m-auto  max-w-[84rem] p-4">{children}</main>
    </>
  );
}
