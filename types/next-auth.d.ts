import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: number;
      userName: string;
      isAdministrator: boolean;
      passwordExpired: boolean;
      daysTillPasswordExpiry: number;
      exp: date;
      iat: date;
      jti: string;
      expiresIn: number /* In seconds */;
      tokenType: string;
      accessToken: string;
      refreshToken: string;
      permissions?: Array<string>;
      emailAddress?: string;
      roles?: Array<string>;
      oiTKNId?: string;
      iss?: string;
    };
    error?: any;
  }
}
