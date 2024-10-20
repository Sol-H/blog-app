import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    username?: string;
  }
}
