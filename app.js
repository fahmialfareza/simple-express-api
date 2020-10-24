const express = require("express");
const app = express();

// Setup Middleware
require("./middleware/express-middleware")(app);
const {
	checkTokenSetUser,
	isLoggedIn,
} = require("./middleware/auth-middleware");
app.use(checkTokenSetUser);

// Get Root
app.get("/", (req, res) => {
	res.json({
		message: "Welcome To The API 🚀",
	});
});

// Initial Router
const indexRouter = require("./api/index");
const authRouter = require("./auth/auth");
app.use("/api", isLoggedIn, indexRouter);
app.use("/auth", authRouter);

// Error Handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Server Listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server run listening on ${port}`);
});

module.exports = app;
