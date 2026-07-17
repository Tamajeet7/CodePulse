import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

import { env } from "./config/env";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      // Allow Vercel preview domains and localhost automatically
      if (origin.includes("vercel.app") || origin.includes("localhost")) {
        return callback(null, true);
      }
      
      // Allow exact match with CLIENT_URL (safely removing any trailing slashes the user might have accidentally added)
      const allowedUrl = (env.CLIENT_URL || "").replace(/\/$/, "");
      if (allowedUrl && origin === allowedUrl) {
        return callback(null, true);
      }
      
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Logger
app.use(morgan("dev"));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;