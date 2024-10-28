import { NextResponse } from 'next/server';
import clientPromise from "@/lib/db";
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  let { username } = params;

  username = username.replace(/%20/g, ' ');

  try {
    const client = await clientPromise;
    const db = client.db();

    // First, find the user by username
    const user = await db.collection('users').findOne({ username: username });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Then, fetch the blogs for this user
    const blogs = await db.collection('blogs')
      .find({ userId: new ObjectId(user._id) })
      .sort({ date: -1 })
      .toArray();

    // Map the blogs to the expected format
    const formattedBlogs = blogs.map(blog => ({
      blogTitle: blog.blogTitle,
      blogDescription: blog.blogDescription,
      date: blog.date,
      blogLocationId: blog.blogLocationId.toString(),
    }));

    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching blogs by username:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
