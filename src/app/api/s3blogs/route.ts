import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from '@aws-sdk/client-s3';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/app/server/db";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET!
  },
  region: process.env.AWS_REGION
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  if (!session.user) {
    return NextResponse.json({ error: "Invalid session. Please log in again." }, { status: 401 });
  }

  const { content, title } = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db();
    const blogsCollection = db.collection('blogs');

    // Generate a new unique blogLocationId
    const lastBlog = await blogsCollection.findOne({}, { sort: { blogLocationId: -1 } });
    const newBlogLocationId = lastBlog ? lastBlog.blogLocationId + 1 : 1;

    const user = await db.collection('users').findOne({ email: session.user.email });

    // Insert new blog metadata into MongoDB
    await blogsCollection.insertOne({
      blogLocationId: newBlogLocationId,
      blogTitle: title,
      blogDescription: content.split('\n')[0] + '...',
      date: new Date().toISOString(),
      userEmail: session.user.email,
      userId: user?._id || null
    });

    // Upload blog content to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `blogs/${newBlogLocationId}.md`,
      Body: content,
    });

    await s3.send(command);

    return NextResponse.json({ blogId: newBlogLocationId }, { status: 200 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: "Error creating blog" }, { status: 500 });
  }
}
