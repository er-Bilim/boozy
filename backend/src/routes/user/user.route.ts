import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { imagesUpload } from '../../middlewares/multer.ts';
import type { IUserReg } from '../../types/user/user.types.ts';
import isValidationError from '../../utils/validationError.ts';
import User from '../../model/user/User.ts';
import { MINUTES_15, WEEK } from '../../constants/constants.ts';
import { clearCookieToken, setCookieToken } from '../../utils/sendToken.ts';
import deleteImage from '../../utils/deleteImage.ts';
import auth, { type RequestWithUser } from '../../middlewares/auth.ts';
import { OAuth2Client } from 'google-auth-library';
import config from '../../config.ts';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import axios from 'axios';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

const usersRouter = Router();

usersRouter.post(
  '/',
  imagesUpload.single('avatar'),
  async (req: Request, res: Response, next: NextFunction) => {
    const body: IUserReg = req.body;

    const correctUserData: IUserReg = {
      email: body.email,
      displayName: body.displayName,
      avatar: req.file ? `uploads/users/avatar/${req.file.filename}` : null,
      password: body.password,
    };

    try {
      const user = new User(correctUserData);
      const refreshToken = user.generateRefreshToken();
      const accessToken = user.generateAccessToken();

      setCookieToken(res, 'refreshToken', refreshToken, WEEK);
      setCookieToken(res, 'accessToken', accessToken, MINUTES_15);

      await user.save();
      res.json({
        message: 'Registration successful',
        user,
      });
    } catch (error) {
      await deleteImage({ image: correctUserData.avatar });
      if (isValidationError(error)) {
        res.status(400).json({ error: isValidationError(error) });
      }

      next(error);
    }
  },
);

usersRouter.post(
  '/google',
  imagesUpload.single('avatar'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = new OAuth2Client(config.googleClientID);

      const credential: string = req.body.credential;
      if (!credential) {
        res.status(403).json({
          message: 'Credential not found',
        });
      }

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: config.googleClientID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      const {
        email,
        sub: googleID,
        given_name: displayName,
        picture: avatarGoogle,
      } = payload;

      let user = await User.findOne({ googleID });
      let isNewUser: boolean = false;

      if (!user) {
        isNewUser = true;
        let savedAvatar = '';

        if (avatarGoogle) {
          try {
            const fileName = `${randomUUID()}.jpg`;
            const destDir = path.join(config.publicPath, 'uploads/users/avatar');
            const fullPath = path.join(destDir, fileName);
            await fs.mkdir(destDir, { recursive: true });

            const response = await axios.get(avatarGoogle, {
              responseType: 'arraybuffer',
            });
            await fs.writeFile(fullPath, response.data);

            savedAvatar = `uploads/users/avatar/${fileName}`;
          } catch (error) {
            console.error(error);
          }
        }

        user = new User({
          email,
          password: crypto.randomUUID(),
          googleID,
          displayName,
          avatar: savedAvatar,
        });

        await user.save();
      }

      const refreshToken = user.generateRefreshToken();
      const accessToken = user.generateAccessToken();

      setCookieToken(res, 'refreshToken', refreshToken, WEEK);
      setCookieToken(res, 'accessToken', accessToken, MINUTES_15);

      res.send({
        message: isNewUser
          ? 'Registration successful'
          : 'Authentication successful',
        user: user,
      });
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  '/sessions',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User is not found' });
      }

      const isMatch: boolean = await user.checkPassword(password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Password is incorrect' });
      }

      const refreshToken: string = user.generateRefreshToken();
      const accessToken: string = user.generateAccessToken();

      setCookieToken(res, 'refreshToken', refreshToken, WEEK);
      setCookieToken(res, 'accessToken', accessToken, MINUTES_15);

      res.json({
        message: 'Authentication successful',
        user,
      });
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.delete(
  '/sessions',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as RequestWithUser;

      user.refreshToken = '';
      await user.save();

      clearCookieToken(res, 'refreshToken');
      clearCookieToken(res, 'accessToken');

      return res.json({
        message: 'Logout successfully!',
      });
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  '/token',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: 'No refresh token present',
        });
      }

      const decoded = jwt.verify(refreshToken, config.refreshJWTSecret) as {
        _id: string;
      };

      const user = await User.findOne({
        _id: decoded._id,
        refreshToken,
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid or expired refresh token',
        });
      }

      const accessToken = user.generateAccessToken();

      if (!accessToken) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      setCookieToken(res, 'accessToken', accessToken, MINUTES_15);

      res.json({
        message: 'Access token refreshed successfully',
      });
    } catch (error) {
      res.status(401).json({
        error: 'Invalid or expected refresh token',
      });
      next(error);
    }
  },
);

export default usersRouter;
