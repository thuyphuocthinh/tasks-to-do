import { NextFunction, Request, Response } from "express";
import { Users } from "../models/users.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = await Users.findOne({ token: token });
      if (user) {
        req["user"] = user;
        next();
      } else {
        res.json({
          status: 400,
          message: "Invalid token",
        });
      }
    } else {
      res.json({
        status: 400,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 404,
      message: "Token does not exist",
    });
  }
};
