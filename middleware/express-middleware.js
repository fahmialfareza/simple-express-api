const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

module.exports = (app) => {
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
			windowMs: 30 * 1000, // 30s
			max: 5,
		})
	);
	// setup the logger
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
