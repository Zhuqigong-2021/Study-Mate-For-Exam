import { User, auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { notificationId } = await req.json();
  console.log("noID: " + notificationId);
  const foundUser: User = await clerkClient.users.getUser(userId);

  if (foundUser) {
    // return JSON.stringify(foundUser);
    if (!foundUser.privateMetadata.read) {
      if (foundUser.privateMetadata.star) {
        const currentStar: any = foundUser.privateMetadata.star;
        try {
          const res = await clerkClient.users.updateUser(userId, {
            // locked: true,
            privateMetadata: { star: [...currentStar], read: [notificationId] },
          });
          if (res)
            return Response.json(
              { message: "update unread status successfully" },
              { status: 200 },
            );
        } catch (error) {
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      } else {
        try {
          const res = await clerkClient.users.updateUser(userId, {
            // locked: true,
            privateMetadata: {
              read: [notificationId],
            },
          });
          if (res)
            return Response.json(
              { message: "update unread status successfully" },
              { status: 200 },
            );
        } catch (error) {
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      }
    } else {
      const currentRead: any = foundUser.privateMetadata.read;
      if (currentRead.includes(notificationId)) return;
      if (foundUser.privateMetadata.star) {
        const currentStar: any = foundUser.privateMetadata.star;
        try {
          const res = await clerkClient.users.updateUser(userId, {
            // locked: true,
            privateMetadata: {
              star: [...currentStar],
              read: [...currentRead, notificationId],
            },
          });
          if (res)
            return Response.json(
              { message: "update unread status successfully" },
              { status: 200 },
            );
        } catch (error) {
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      } else {
        try {
          const res = await clerkClient.users.updateUser(userId, {
            // locked: true,
            privateMetadata: { read: [...currentRead, notificationId] },
          });
          if (res)
            return Response.json(
              { message: "update unread status successfully" },
              { status: 200 },
            );
        } catch (error) {
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      }
    }
  }
}
