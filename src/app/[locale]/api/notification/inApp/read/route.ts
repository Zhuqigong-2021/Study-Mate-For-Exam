import prisma from "@/lib/db/prisma";
export async function POST(req: Request) {
  try {
    const { currentUserId, notificationId, read } = await req.json();
    // console.log("currentUserId:" + currentUserId);
    // console.log("notificationId:" + notificationId);
    // console.log("star:" + star);
    let foundNotification = await prisma.inAppNotification.findUnique({
      where: { id: notificationId },
    });
    if (!foundNotification) {
      return Response.json(
        { error: "Notification Not Found" },
        { status: 404 },
      );
    }
    console.log("found notification");
    let readArr: string[] = [];
    if (read) {
      readArr = [...new Set([...foundNotification.read, currentUserId])];
    } else {
      readArr = [...foundNotification.read.filter((r) => r !== currentUserId)];
    }
    await prisma.inAppNotification.update({
      where: { id: notificationId },
      data: {
        read: readArr,
      },
    });

    return Response.json({ message: "update complete" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
