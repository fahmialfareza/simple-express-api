import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import users from "../db/users";
import generateToken from "./generateToken";
import { signupValidation, loginValidation } from "../db/validation";

const router = express.Router();

interface User {
  username: string;
  email: string;
  password: string;
}

// Auth Root Router
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Auth 🚀",
  });
});

// Auth Signup Router
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = signupValidation(req.body);
      if (error) {
        res.status(400);
        next(new Error(error.details[0].message));
      } else {
        // Check existing username or email
        const existingUser = await users.findOne({
          $or: [{ username: value.username }, { email: value.email }],
        });

        if (existingUser) {
          res.status(400);
          next(new Error("Email or username is taken 😭"));
        } else {
          // Hash password
          const hashedPassword = await bcrypt.hash(value.password, 10);

          const newUser: User = {
            username: value.username,
            email: value.email,
            password: hashedPassword,
          };

          // Insert new user
          const result = await users.insert(newUser);
          delete result.password;

          const expiration = process.env.COOKIE_EXPIRATION;

          // Generate token
          const token = generateToken(result);

          res
            .cookie("token", token, {
              expires: new Date(Date.now() + Number(expiration)),
              secure: false,
              httpOnly: true,
            })
            .json({
              user: result,
              token,
            });
        }
      }
    } catch (error) {
      res.status(400);
      next(new Error("Error inserting user. ⚠"));
    }
  }
);

/* LOGIN ROUTER */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = loginValidation(req.body);
      if (error) {
        res.status(400);
        next(new Error(error.details[0].message));
      } else {
        const user = await users.findOne({ username: value.username });
        if (user) {
          const match = await bcrypt.compare(value.password, user.password);
          if (match) {
            delete user.password;
            const expiration = process.env.COOKIE_EXPIRATION;

            // Generate token
            const token = generateToken(user);
            res
              .cookie("token", token, {
                expires: new Date(Date.now() + Number(expiration)),
                httpOnly: true,
                secure: false,
              })
              .json({
                user,
                token,
              });
          } else {
            res.status(400);
            next(new Error("Username & password not match! 🔑"));
          }
        } else {
          res.status(401);
          next(new Error("User doesn't exist. ⚠"));
        }
      }
    } catch (error) {
      res.status(400);
      next(new Error("Error finding existing user. ⚠"));
    }
  }
);

export default router;
