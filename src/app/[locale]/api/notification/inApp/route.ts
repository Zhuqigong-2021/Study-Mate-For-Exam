// import { auth } from "@clerk/nextjs";

import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

import { Knock } from "@knocklabs/node";
import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { InAppSchema } from "@/lib/validation/note";
const knock = new Knock(process.env.KNOCK_SECRET_KEY);
const { userId } = auth();
interface inputProps {
  input: InAppSchema;
}
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { link, user, time, subject, to, description, tag } =
      await req.json();
    // console.log({ link, user, time, subject, to, description, tag });
    let input: InAppSchema = { link, time, subject, to, description, tag };

    const notificationList = await prisma.notificationList.findMany({
      select: {
        id: true,
        inApps: {
          select: {
            id: true,
            time: true,
            user: true,
            subject: true,
            to: true,
            description: true,
            tag: true,
            notificationListId: true,
          },
        },
      },
    });

    let notificationListId =
      notificationList.length > 0 ? notificationList[0].id : null;
    // const sendNotification = async (input: InAppSchema) => {

    // return knockUser;
    //   return totalUsersNumber;
    // };

    // console.log(response);
    await prisma.$transaction(async (tx) => {
      if (notificationListId) {
        await tx.inAppNotification.create({
          data: {
            link,
            user,
            time,
            subject,
            to,
            description,
            tag,
            notificationListId,
          },
        });
      } else {
        const notificationList = await tx.notificationList.create({
          data: {},
        });
        await tx.inAppNotification.create({
          data: {
            link,
            user,
            time,
            subject,
            to,
            description,
            tag,
            notificationListId: notificationList?.id,
          },
        });
      }
    });
    return Response.json(
      { message: "InApp notification is created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// export async function DELETE(req: Request) {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const { reportId } = await req.json();

//     // Check if a reportListId is provided and if it exists

//     let reportFound = await prisma.report.findUnique({
//       where: { id: reportId },
//     });

//     if (!reportFound) {
//       return Response.json({ error: "Report Not Found" }, { status: 404 });
//     }

//     // delete this report
//     await prisma.report.delete({
//       where: { id: reportId },
//     });

//     return Response.json(
//       { message: "Report is deleted successfully" },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// const knock = new Knock(process.env.KNOCK_SECRET_KEY);
// const { userId } = auth();
// interface inputProps {
//   input: InAppSchema;
// }
// export const sendNotification = async (input: InAppSchema) => {
//   const totalUsersNumber = await clerkClient.users.getCount();

//   const allUsers = await clerkClient.users.getUserList({
//     limit: totalUsersNumber,
//   });
//   const allUsersExceptSender = allUsers.filter((user) => user.id !== userId);

//   const adminUsers = allUsers.filter(
//     (user) => user.publicMetadata.role === "admin" && user.id !== userId,
//   );

//   let user: User[];

//   if (input.to.includes("all")) {
//     user = allUsersExceptSender;
//   } else if (input.to.includes("admin")) {
//     const elseUsers = allUsers.filter((user) => input.to.includes(user.id));
//     const combinedUsers = [...adminUsers, ...elseUsers];
//     const uniqueUsers = Array.from(
//       new Set(combinedUsers.map((user) => user.id)),
//     )
//       .map((id) => combinedUsers.find((user) => user.id === id))
//       .filter((user): user is User => user !== undefined);

//     user = uniqueUsers;
//   } else {
//     const elseUsers = allUsers.filter((user) => input.to.includes(user.id));
//     user = elseUsers;
//   }

//   const currentUser = allUsers.filter((user) => user.id == userId);
//   const knockUser = await knock.users.identify(userId!, {
//     name:
//       currentUser[0].firstName ??
//       "" + currentUser[0].lastName ??
//       "" ??
//       currentUser[0].username,
//     email: currentUser[0].emailAddresses[0].emailAddress,
//   });

//   if (userId && user)
//     await knock.notify("notify-user", {
//       actor: userId,
//       recipients: user,
//       data: {
//         subject: input.subject,
//         description: input.description,
//         link: input.link,
//         adminUrl: currentUser[0].imageUrl,
//       },
//     });

//   return knockUser;
// };

// export const sendNotification = async (input: InAppSchema) => {
//   const totalUsersNumber = await clerkClient.users.getCount();

//   const allUsers = await clerkClient.users.getUserList({
//     limit: totalUsersNumber,
//   });
//   const allUsersExceptSender = allUsers.filter((user) => user.id !== userId);

//   const adminUsers = allUsers.filter(
//     (user) => user.publicMetadata.role === "admin" && user.id !== userId,
//   );

//   let user: User[];

//   if (input.to.includes("all")) {
//     user = allUsersExceptSender;
//   } else if (input.to.includes("admin")) {
//     const elseUsers = allUsers.filter((user) => input.to.includes(user.id));
//     const combinedUsers = [...adminUsers, ...elseUsers];
//     const uniqueUsers = Array.from(
//       new Set(combinedUsers.map((user) => user.id)),
//     )
//       .map((id) => combinedUsers.find((user) => user.id === id))
//       .filter((user): user is User => user !== undefined);

//     user = uniqueUsers;
//   } else {
//     const elseUsers = allUsers.filter((user) => input.to.includes(user.id));
//     user = elseUsers;
//   }

//   const currentUser = allUsers.filter((user) => user.id == userId);
//   const knockUser = await knock.users.identify(userId!, {
//     name:
//       currentUser[0].firstName ??
//       "" + currentUser[0].lastName ??
//       "" ??
//       currentUser[0].username,
//     email: currentUser[0].emailAddresses[0].emailAddress,
//   });

//   if (userId && user)
//     await knock.notify("notify-user", {
//       actor: userId,
//       recipients: user,
//       data: {
//         subject: input.subject,
//         description: input.description,
//         link: input.link,
//         adminUrl: currentUser[0].imageUrl,
//       },
//     });

//   return knockUser;
// };
