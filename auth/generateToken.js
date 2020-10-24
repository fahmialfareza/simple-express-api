const jwt = require("jsonwebtoken");

const generateToken = (data, callback) => {
	jwt.sign(
		data,
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRATION,
			algorithm: process.env.JWT_ALGORITHM,
		},
		(error, token) => {
			if (error) {
				callback(error, null);
			} else {
				callback(null, token);
			}
		}
	);
};

module.exports = generateToken;
