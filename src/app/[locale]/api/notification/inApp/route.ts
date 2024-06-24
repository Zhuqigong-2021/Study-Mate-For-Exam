import prisma from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    let allInAppNotifications = await prisma.inAppNotification.findMany({});
    if (allInAppNotifications) {
      //   console.log(allInAppNotifications);
      return Response.json(allInAppNotifications, { status: 200 });
    }
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let allInAppNotifications = await prisma.inAppNotification.findMany({});
    if (allInAppNotifications) {
      //   console.log(allInAppNotifications);
      return Response.json(allInAppNotifications, { status: 200 });
    }
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
