import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { MongoDBAdapter } from "@auth/mongodb-adapter"
import type { Adapter } from "next-auth/adapters";
import clientPromise from "../../../server/db";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
