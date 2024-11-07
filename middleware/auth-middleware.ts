import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function checkTokenSetUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get token from cookies
  const token = req.cookies.token;
  try {
    if (token) {
      // verify token
      jwt.verify(token, process.env.JWT_SECRET!, (error: any, decoded: any) => {
        if (error) {
          res.statusCode = 400;
          next(new Error(error));
        } else {
          // Set user in request as marked as logged in
          // @ts-ignore
          req.user = decoded;
          next();
        }
      });
    } else {
      next();
    }
  } catch (error: any) {
    res.statusCode = 400;
    next(new Error(error));
  }
}

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (req.user) {
    next();
  } else {
    res.statusCode = 401;
    next(new Error("Un-Authorized! Need to login ⚠"));
  }
}
