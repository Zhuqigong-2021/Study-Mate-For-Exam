import React from "react";
import Home from "../components/Home";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { checkMetaDataRole, checkRole } from "./utils/roles/role";
const page = async () => {
  const { userId } = auth();
  if (userId) redirect("/notes/public");
  // const isAdmin = checkRole("admin");
  const isAdmin = await checkMetaDataRole("admin");
  return <Home userId={userId} isAdmin={isAdmin} />;
};

export default page;
