import { NextFunction, Request, Response } from "express";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
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
