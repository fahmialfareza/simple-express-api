const Joi = require("joi");

const signupValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().alphanum().trim().min(3).max(30).required(),
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			})
			.required(),
		password: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
			.trim()
			.required(),
	});
	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().alphanum().min(3).max(30).required(),
		password: Joi.string()
			.min(3)
			.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
			.required(),
	});
	return schema.validate(data);
};

module.exports = { signupValidation, loginValidation };
