import { Request, Response } from 'express';

type TokenOptions = {
  accessExpires: number,
}

export class CookieUtils {
  static getRequestJwt =  (req: Request) => {
    const cookies = req.cookies as object;
    return cookies?.['access_token'] as string;
  };

  static setResponseCookie (
    res: Response,
    token: string,
    { accessExpires }: TokenOptions,
  ) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      expires: new Date(accessExpires),
    });
  }

  static clearResponseCookie (res: Response) {
    CookieUtils.setResponseCookie(res, '', {
      accessExpires: 0,
    });
  }
}
