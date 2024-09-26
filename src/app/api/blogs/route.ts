import { NextResponse } from 'next/server';
import { getBlogs } from "../../server/dbFunctions";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user?.email ?? '';

  try {
    const blogs = await getBlogs(userEmail);
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
