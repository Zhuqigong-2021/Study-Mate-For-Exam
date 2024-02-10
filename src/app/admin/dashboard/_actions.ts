"use server";

import { checkRole } from "@/app/utils/roles/role";
import { auth, clerkClient } from "@clerk/nextjs/server";
import toast from "react-hot-toast";

export async function setRole(formData: FormData) {
  const { userId } = auth();
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin") || userId != "user_2aFBx8E20RdENmTS0CRlRej0Px4") {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient.users.updateUser(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      },
    );

    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
