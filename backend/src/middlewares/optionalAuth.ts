import type { Request, Response, NextFunction } from 'express';
import type { HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config.ts';
import User from '../model/user/User.ts';
import type { IUser } from '../types/user/user.types.ts';

export interface RequestOptionalUser extends Request {
  user: HydratedDocument<IUser>;
}

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userReq = req as RequestOptionalUser;

  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, config.accessJWTSecret) as {
        _id: string;
      };
      const user = await User.findOne({ _id: decoded._id });

      if (!user) {
        return res.status(403).json({
          error: 'Access denied. Invalid token',
        });
      }

      userReq.user = user;
    } catch (error) {
      next(error);
    }
  }

  next();
};

export default optionalAuth;
