import http from "http";

import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";


const server = http.createServer(app);

async function startServer() {
  await connectDB();


  server.listen(Number(env.PORT), () => {
    console.log(
      `🚀 http://localhost:${env.PORT}`
    );
  });
}

startServer();