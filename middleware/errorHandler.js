function errorHandler(err, req, res, next) {
	if (process.env.ENV === "development") {
		res.status(res.statusCode || 500).json({
			message: err.message,
			stack: err.stack,
		});
	} else {
		res.status(res.statusCode || 500).json({
			message: err.message,
		});
	}
}

module.exports = errorHandler;
