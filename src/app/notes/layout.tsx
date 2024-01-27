import Nav from "./Nav";
// import NavBar from "./NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
}
