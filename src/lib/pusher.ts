import PusherServer from "pusher";
import PusherClient from "pusher-js";
// NEXT_PUBLIC_PUSHER_APP_KEY=26f260f45e9d0d47f175
// PUSHER_APP_ID=1795051
// PUSHER_SECERT=2f4d1750a7b4116bb198

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID! || "1795051",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY! || "26f260f45e9d0d47f175",
  secret: process.env.PUSHER_SECERT! || "2f4d1750a7b4116bb198",
  cluster: "us3",
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: "us3",
    authTransport: "ajax",
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
);
