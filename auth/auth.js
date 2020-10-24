const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../db/users");
const generateToken = require("./generateToken");
const { signupValidation, loginValidation } = require("../db/validation");

// Auth Root Router
router.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to Auth 🚀",
	});
});

// Auth Singup Router
router.post("/signup", (req, res, next) => {
	// Validation
	let { error, value } = signupValidation(req.body);
	if (error) {
		res.statusCode = 400;
		next(new Error(error.details[0].message));
	} else {
		// Check existing username or email
		users
			.findOne({
				$or: [{ username: value.username }, { email: value.email }],
			})
			.then((user) => {
				if (user) {
					res.statusCode = 400;
					next(new Error("email or username is taken 😭"));
				} else {
					// Hash password
					bcrypt
						.hash(value.password, bcrypt.genSaltSync(10))
						.then((hashedPassword) => {
							let newUser = {
								username: value.username,
								email: value.email,
								password: hashedPassword,
							};

							//Insert new user
							users
								.insert(newUser)
								.then((result) => {
									delete result.password;
									const expiration =
										process.env.COOKIE_EXPIRATION;

									// Generate token
									generateToken(result, (error, token) => {
										if (error) {
											res.statusCode = 400;
											next(new Error(error));
										} else {
											res.cookie("token", token, {
												expires: new Date(
													Date.now() +
														Number(expiration)
												),
												secure: false,
												httpOnly: true,
											}).json({
												user: result,
												token: token,
											});
										}
									});
								})
								.catch(() => {
									res.statusCode = 400;
									next(new Error("Error insert user. ⚠"));
								});
						})
						.catch(() => {
							res.statusCode = 400;
							next(new Error("Error hash password. ⚠"));
						});
				}
			})
			.catch(() => {
				res.statusCode = 400;
				next(new Error("Error find existing user. ⚠"));
			});
	}
});

/* LOGIN ROUTER */
router.post("/login", function (req, res, next) {
	// Validation
	const { error, value } = loginValidation(req.body);
	if (error) {
		res.statusCode = 400;
		next(new Error(error.details[0].message));
	} else {
		// username existing
		users
			.findOne({ username: value.username })
			.then((user) => {
				if (user) {
					// compare password
					bcrypt.compare(
						value.password,
						user.password,
						(err, result) => {
							if (err) {
								res.statusCode = 400;
								next(
									new Error("Whoops! Something went wrong 😭")
								);
							} else {
								if (result) {
									delete user.password;
									const expiration =
										process.env.COOKIE_EXPIRATION;

									// Generate token
									generateToken(user, (error, token) => {
										if (error) {
											res.statusCode = 400;
											next(new Error(error));
										} else {
											res.cookie("token", token, {
												expires: new Date(
													Date.now() +
														Number(expiration)
												),
												httpOnly: true,
												secure: false,
											}).json({
												user: user,
												token: token,
											});
										}
									});
								} else {
									res.statusCode = 400;
									next(
										new Error(
											"Username & password not match! 🔑"
										)
									);
								}
							}
						}
					);
				} else {
					res.statusCode = 401;
					next(new Error("User does't exist. ⚠"));
				}
			})
			.catch(() => {
				res.statusCode = 400;
				next(new Error("Error find existing user. ⚠"));
			});
	}
});

module.exports = router;
