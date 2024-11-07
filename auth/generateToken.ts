import jwt from "jsonwebtoken";

const generateToken = (data: any) => {
  // @ts-ignore
  const signed = jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
    algorithm: process.env.JWT_ALGORITHM,
  });

  return signed;
};

export default generateToken;
