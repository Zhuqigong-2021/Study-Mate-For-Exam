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

export async function setUserRole(currentUserId: string, role: string) {
  const { userId } = auth();
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin") || userId != "user_2aFBx8E20RdENmTS0CRlRej0Px4") {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient.users.updateUser(currentUserId, {
      publicMetadata: { role: role },
    });

    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function blockThisUser(currentUserId: string) {
  try {
    const foundUser = await clerkClient.users.getUser(currentUserId);
    if (foundUser) {
      if (
        !foundUser.privateMetadata.banned ||
        foundUser.privateMetadata.banned == false
      ) {
        // await clerkClient.users.banUser(userId);
        const res = await clerkClient.users.updateUser(currentUserId, {
          // locked: true,
          privateMetadata: { banned: true },
        });
        return { message: res.privateMetadata };
      }
    }
  } catch (err) {
    return { message: err };
  }
}

export async function unblockThisUser(currentUserId: string) {
  try {
    const foundUser = await clerkClient.users.getUser(currentUserId);
    if (foundUser) {
      if (foundUser.privateMetadata.banned == true) {
        // await clerkClient.users.banUser(userId);
        const res = await clerkClient.users.updateUser(currentUserId, {
          // locked: true,
          privateMetadata: { banned: false },
        });
        return { message: res.privateMetadata };
      }
    }
  } catch (err) {
    return { message: err };
  }
}

export async function deleteThisUser(currentUserId: string) {
  const { userId } = auth();
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin") || userId != "user_2aFBx8E20RdENmTS0CRlRej0Px4") {
    return { message: "Not Authorized" };
  }

  try {
    const foundUser = await clerkClient.users.getUser(currentUserId);
    if (foundUser) {
      await clerkClient.users.deleteUser(currentUserId);

      return { message: "delete user successfully" };
    } else {
      return { message: "User not found", status: 404 };
    }
  } catch (err) {
    return { message: err };
  }
}
