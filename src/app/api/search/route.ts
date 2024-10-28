import { NextResponse } from 'next/server';
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Create a case-insensitive regex pattern
    const searchRegex = new RegExp(query, 'i');

    // Search using $or to match either title or description
    const blogs = await db.collection('blogs')
      .find({
        $or: [
          { blogTitle: { $regex: searchRegex } },
          { blogDescription: { $regex: searchRegex } }
        ]
      })
      .sort({ date: -1 })
      .toArray();

    // Get user information for each blog
    const blogsWithUserInfo = await Promise.all(
      blogs.map(async (blog) => {
        const user = await db.collection('users').findOne(
          { _id: blog.userId },
          { projection: { username: 1 } }
        );

        return {
          blogTitle: blog.blogTitle,
          blogDescription: blog.blogDescription,
          date: blog.date,
          blogLocationId: blog.blogLocationId.toString(),
          username: user?.username || 'Unknown User'
        };
      })
    );

    return NextResponse.json(blogsWithUserInfo);
  } catch (error) {
    console.error('Error searching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
