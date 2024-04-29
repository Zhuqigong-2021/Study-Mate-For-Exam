import { pusherServer } from "@/lib/pusher";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(res: Request) {
  const { currentUserId } = await res.json();
  //   console.log("currentUserId in the server:" + currentUserId);
  try {
    const foundUser = await clerkClient.users.getUser(currentUserId);
    // console.log(foundUser.privateMetadata.banned);
    if (foundUser) {
      //   console.log("foundUser:" + JSON.stringify(foundUser));
      if (
        !foundUser.privateMetadata.banned ||
        foundUser.privateMetadata.banned == false
      ) {
        // console.log("we hit the inner res");
        const res = await clerkClient.users.updateUser(currentUserId, {
          // locked: true,
          privateMetadata: { banned: true },
        });
        if (!res) {
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }

        pusherServer.trigger(
          "ban-user",
          "user:banned",

          {
            currentUserId: currentUserId,
            banned: true,
          },
        );

        return Response.json({ message: res.privateMetadata }, { status: 200 });
      }

      console.log("we only hit the outer res");
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  } catch (err) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
