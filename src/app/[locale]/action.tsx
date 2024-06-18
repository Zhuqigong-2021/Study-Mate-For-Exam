"use server";
import { getTranslations } from "next-intl/server";
import { Knock } from "@knocklabs/node";
import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { InAppSchema } from "@/lib/validation/note";
import prisma from "@/lib/db/prisma";
export const fetchNoteData = async (page: number) => {
  const response = await fetch(`/api/notes?noteId=&{noteId}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

interface Params {
  locale: string;
}

interface Context {
  params: Params;
}
export async function generateMetadata({ params: { locale } }: Context) {
  const t = await getTranslations({ locale, namespace: "Homepage" });

  return {
    title: t("metadata.public"),
  };
}

const knock = new Knock(process.env.KNOCK_SECRET_KEY);
const { userId } = auth();
interface inputProps {
  input: InAppSchema;
}
export const sendNotification = async (input: InAppSchema) => {
  const totalUsersNumber = await clerkClient.users.getCount();

  const allUsers = await clerkClient.users.getUserList({
    limit: totalUsersNumber,
  });
  const allUsersExceptSender = allUsers.filter((user) => user.id !== userId);
  // .map((user) => user.id);

  // const user = allUsers.filter(
  //   (user) => user.id === "user_2bZAKBMzcjSdtq6xz9rifqhAF98",
  // );
  const adminUsers = allUsers.filter(
    (user) => user.publicMetadata.role === "admin" && user.id !== userId,
  );

  let user: User[];

  if (input.to.includes("all")) {
    user = allUsersExceptSender;
  } else if (input.to.includes("admin")) {
    const elseUsers = allUsers.filter((user) => input.to.includes(user.id));
    const combinedUsers = [...adminUsers, ...elseUsers];
    const uniqueUsers = Array.from(
      new Set(combinedUsers.map((user) => user.id)),
    )
      .map((id) => combinedUsers.find((user) => user.id === id))
      .filter((user): user is User => user !== undefined);

    user = uniqueUsers;
  } else {
    const elseUsers = allUsers.filter((user) => input.to.includes(user.id));
    user = elseUsers;
  }
  // const knockUser = await knock.users.identify(user[0].id, {
  //   name: user[0].firstName ?? "" + user[0].lastName ?? "" ?? user[0].username,
  //   email: user[0].emailAddresses[0].emailAddress,
  // });

  // const superAdmin = allUsers.filter(
  //   (user) => user.id === "user_2aFBx8E20RdENmTS0CRlRej0Px4",
  // );

  const firstNameArray = allUsers
    .filter((user) => input.to.includes(user.id))
    .map((user) => user.firstName ?? "unknown");

  const currentUser = allUsers.filter((user) => user.id == userId);

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

  // const knockUser = await knock.users.identify(userId!, {
  //   name:
  //     currentUser[0].firstName ??
  //     "" + currentUser[0].lastName ??
  //     "" ??
  //     currentUser[0].username,
  //   email: currentUser[0].emailAddresses[0].emailAddress,
  // });
  if (user.length > 0) {
    user.forEach(
      async (u) =>
        await knock.users.identify(u.id!, {
          name: u.firstName ?? "" + u.lastName ?? "" ?? u.username,
          email: u.emailAddresses[0].emailAddress,
        }),
    );
  }
  // console.log(response);
  await prisma.$transaction(async (tx) => {
    if (notificationListId) {
      await tx.inAppNotification.create({
        data: {
          link: input.link,
          user: JSON.stringify(currentUser[0]),
          time: input.time,
          subject: input.subject,
          to: firstNameArray,
          description: input.description,
          tag: input.tag,
          notificationListId,
        },
      });
    } else {
      const notificationList = await tx.notificationList.create({
        data: {},
      });

      await tx.inAppNotification.create({
        data: {
          link: input.link,
          user: JSON.stringify(currentUser[0]),
          time: input.time,
          subject: input.subject,
          to: firstNameArray,
          description: input.description,
          tag: input.tag,
          notificationListId: notificationList?.id,
        },
      });
    }

    if (userId && user)
      await knock.notify("notify-user", {
        actor: userId,
        recipients: user,
        data: {
          subject: input.subject,
          description: input.description,
          link: input.link,
          adminUrl: currentUser[0].imageUrl,
        },
      });
  });

  // return JSON.stringify(user);
  // console.log("user" + JSON.stringify(user[0].id));

  return "notification completed";
};

export const deleteNotification = async (id: string) => {
  if (!userId) {
    throw Error("You're not authorized");
  }
  const foundNotification = await prisma.inAppNotification.findUnique({
    where: { id },
  });
  if (!foundNotification) {
    throw Error("Notification is not found");
  }
  try {
    const response = await prisma.inAppNotification.delete({ where: { id } });
    return response;
  } catch (error) {
    console.log(error);
  }
};
