"use client";

import { io } from "socket.io-client";
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
// const socketUrl = "http://localhost:3000";

export const socket = io(socketUrl);
