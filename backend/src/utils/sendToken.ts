import type { Response } from 'express';

export const setCookieToken = (
  res: Response,
  nameToken: string,
  token: string,
  time: number,
) => {
  res.cookie(nameToken, token, {
    httpOnly: true,
    secure: false,
    sameSite: true,
    maxAge: time,
  });
};

export const clearCookieToken = (res: Response, nameToken: string) => {
  res.clearCookie(nameToken, {
    httpOnly: true,
    secure: false,
    sameSite: true,
    maxAge: 0,
  });
};
