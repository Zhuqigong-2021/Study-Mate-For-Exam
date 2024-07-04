import prisma from "@/lib/db/prisma";
export async function POST(req: Request) {
  try {
    const { currentUserId, notificationId, star } = await req.json();
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
    let starArr: string[] = [];
    if (star) {
      starArr = [...new Set([...foundNotification.star, currentUserId])];
    } else {
      starArr = [...foundNotification.star.filter((s) => s !== currentUserId)];
    }
    await prisma.inAppNotification.update({
      where: { id: notificationId },
      data: {
        star: starArr,
      },
    });

    return Response.json({ message: "update complete" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
