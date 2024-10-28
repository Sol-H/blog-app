import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { MongoDBAdapter } from "@auth/mongodb-adapter"
import type { Adapter } from "next-auth/adapters";
import clientPromise from "@/lib/db";
import type { NextAuthOptions, Session } from 'next-auth'
import type { User } from 'next-auth'
import type { Account } from 'next-auth'

export const authOptions: NextAuthOptions = {
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
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection("users");

        const username = user.name?.toLowerCase().replace(/\s+/g, '') || '';
        let uniqueUsername = username;
        let counter = 1;

        while (await usersCollection.findOne({ username: uniqueUsername })) {
          uniqueUsername = `${username}${counter}`;
          counter++;
        }

        await usersCollection.updateOne(
          { email: user.email },
          { $set: { username: uniqueUsername } },
          { upsert: true }
        );

        user.username = uniqueUsername;
      }
      return true;
    },
    async session({ session, user }: { 
      session: { user?: { username?: string } & User } & Session; 
      user: User & { username?: string }
    }) {
      if (session.user) {
        session.user.username = user.username;
      }
      return session;
    },
  },
}
