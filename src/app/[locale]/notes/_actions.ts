"use server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getUser(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    return { message: err };
  }
}
