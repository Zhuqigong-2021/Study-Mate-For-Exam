import React from "react";
import Home from "../components/Home";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { checkMetaDataRole, checkRole } from "./utils/roles/role";

const page = async () => {
  const { userId } = auth();
  if (userId) redirect("/notes/public");

  // const isAdmin = await checkMetaDataRole("admin");
  let isAdmin;
  if (userId) {
    isAdmin = await checkMetaDataRole("admin");
  } else {
    isAdmin = checkRole("admin");
  }

  return <Home userId={userId} isAdmin={isAdmin} />;
};

export default page;
