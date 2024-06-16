"use server";
import { getTranslations } from "next-intl/server";
import { Knock } from "@knocklabs/node";
import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { InAppSchema, inAppSchema } from "@/lib/validation/note";
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

  if (input.frameworks.includes("all")) {
    user = allUsersExceptSender;
  } else if (input.frameworks.includes("admin")) {
    const elseUsers = allUsers.filter((user) =>
      input.frameworks.includes(user.id),
    );
    const combinedUsers = [...adminUsers, ...elseUsers];
    const uniqueUsers = Array.from(
      new Set(combinedUsers.map((user) => user.id)),
    )
      .map((id) => combinedUsers.find((user) => user.id === id))
      .filter((user): user is User => user !== undefined);

    user = uniqueUsers;
  } else {
    const elseUsers = allUsers.filter((user) =>
      input.frameworks.includes(user.id),
    );
    user = elseUsers;
  }
  // const knockUser = await knock.users.identify(user[0].id, {
  //   name: user[0].firstName ?? "" + user[0].lastName ?? "" ?? user[0].username,
  //   email: user[0].emailAddresses[0].emailAddress,
  // });

  // const superAdmin = allUsers.filter(
  //   (user) => user.id === "user_2aFBx8E20RdENmTS0CRlRej0Px4",
  // );
  const currentUser = allUsers.filter((user) => user.id == userId);
  const knockUser = await knock.users.identify(userId!, {
    name:
      currentUser[0].firstName ??
      "" + currentUser[0].lastName ??
      "" ??
      currentUser[0].username,
    email: currentUser[0].emailAddresses[0].emailAddress,
  });

  // console.log("userId:" + userId);
  // console.log(knockUser);
  // console.log(user[0].emailAddresses[0].emailAddress);
  // console.log("user:" + JSON.stringify(user));

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

  // return JSON.stringify(user);
  // console.log("user" + JSON.stringify(user[0].id));

  return knockUser;
  // console.log("admin:" + adminUsers);
  // return JSON.stringify(user);
  // console.log(JSON.stringify(allUsersExceptSender));
  // return JSON.stringify(allUsersExceptSender) ?? "haha";
};
