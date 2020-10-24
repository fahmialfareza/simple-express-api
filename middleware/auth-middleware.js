const jwt = require("jsonwebtoken");

function checkTokenSetUser(req, res, next) {
	// Get token from cookies
	const token = req.cookies.token;
	try {
		if (token) {
			// verify token
			jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
				if (error) {
					res.statusCode = 400;
					next(new Error(error));
				} else {
					// Set user in request as marked as logged in
					req.user = decoded;
					next();
				}
			});
		} else {
			next();
		}
	} catch (error) {
		res.statusCode = 400;
		next(new Error(error));
	}
}

function isLoggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.statusCode = 401;
		next(new Error("Un-Authorized! Need to login ⚠"));
	}
}

module.exports = {
	checkTokenSetUser,
	isLoggedIn,
};
