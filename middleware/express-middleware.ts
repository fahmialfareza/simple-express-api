import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import fs from "fs";
import path from "path";
// @ts-ignore
import rateLimit from "express-rate-limit";

export default (app: Express): void => {
  dotenv.config();

  app.use(express.json());

  app.use(
    cors({
      origin: ["http://localhost", "http://localhost:3000"],
      credentials: true,
    })
  );

  app.use(helmet());
  app.use(cookieParser());

  app.use(
    "/auth",
    rateLimit({
      windowMs: 30 * 1000, // 30 seconds
      max: 5,
    })
  );

  // Set up the logger
  app.use(morgan(process.env.ENV === "development" ? "dev" : "common"));

  app.use(
    morgan("combined", {
      stream: fs.createWriteStream(
        path.join(process.cwd(), "/utils/log/access.log"),
        { flags: "a" }
      ),
    })
  );
};
