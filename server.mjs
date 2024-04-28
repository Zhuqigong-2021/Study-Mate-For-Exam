import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // ...
    // console.log("id:" + socket.id);
    socket.on("banned", (userId, bannedValue) => {
      io.emit("receive-banned", userId, bannedValue);
    });
    socket.on("authorize", (userId, role) => {
      // console.log("userId:" + userId);
      // console.log("role:", +role);
      io.emit("receive-role", userId, role);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
