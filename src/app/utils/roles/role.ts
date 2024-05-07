import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();

  // pusherServer.trigger("authorize", "user:authorize", {
  //   currentUserId: userId,
  //   role: role,
  // });

  return sessionClaims?.metadata.role === role;
};

export const checkMetaDataRole = async (role: Roles) => {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId ?? "");
  // console.log(
  //   "role from metadata:",
  //   String(user.publicMetadata.role),
  //   "role to check:",
  //   String(role),
  //   "comparison result:",
  //   String(user.publicMetadata.role) === String(role),
  // );
  return String(user?.publicMetadata.role) === String(role);
};
