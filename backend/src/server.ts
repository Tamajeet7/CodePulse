import http from "http";

import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initializeSocket } from "./sockets";

const server = http.createServer(app);

async function startServer() {
  await connectDB();

  initializeSocket(server);

  server.listen(Number(env.PORT), () => {
    console.log(
      `🚀 http://localhost:${env.PORT}`
    );
  });
}

startServer();