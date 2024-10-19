import { NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

export async function GET(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  console.log("Attempting to fetch blog with ID:", params.blogId);

  const session = await getServerSession(authOptions);
  console.log("Server session:", session);

  const blogId = params.blogId;

  try {
    const client = await clientPromise;
    const db = client.db();
    const blogsCollection = db.collection('blogs');

    // Fetch blog metadata from MongoDB
    const blogMetadata = await blogsCollection.findOne({ blogLocationId: parseInt(blogId) });

    if (!blogMetadata) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Fetch blog content from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `blogs/${blogId}.md`,
    });

    const response = await s3.send(command);
    const blogContent = await response.Body?.transformToString();

    if (!blogContent) {
      return NextResponse.json({ error: "Blog content not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      content: blogContent,
      userEmail: blogMetadata.userEmail,
      blogTitle: blogMetadata.blogTitle
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: "Error fetching blog" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  console.log("Attempting to update blog with ID:", params.blogId);

  const session = await getServerSession(authOptions);
  console.log("Server session:", session);

  if (!session) {
    console.error("No server session found. User is not authenticated.");
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  if (!session.user) {
    console.error("Session found, but no user data present.");
    return NextResponse.json({ error: "Invalid session. Please log in again." }, { status: 401 });
  }

  console.log("Authenticated user:", session.user.email);

  const blogId = params.blogId;
  const { content, title } = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db();
    const blogsCollection = db.collection('blogs');

    // Check if the blog belongs to the authenticated user
    const blog = await blogsCollection.findOne({ 
      blogLocationId: parseInt(blogId),
      userEmail: session.user?.email
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or you don't have permission to edit it" }, { status: 403 });
    }
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `blogs/${blogId}.md`,
      Body: content,
    });

    await s3.send(command);

    const result = await blogsCollection.updateOne(
      { blogLocationId: parseInt(blogId) },
      { 
        $set: { 
          blogTitle: title,
          blogDescription: content.split('\n')[2] + '...',
          date: new Date().toISOString()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found in database" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog updated successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: "Error updating blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  if (!session.user) {
    return NextResponse.json({ error: "Invalid session. Please log in again." }, { status: 401 });
  }

  const blogId = params.blogId;

  try {
    const client = await clientPromise;
    const db = client.db();
    const blogsCollection = db.collection('blogs');

    // Check if the blog belongs to the authenticated user
    const blog = await blogsCollection.findOne({ 
      blogLocationId: parseInt(blogId),
      userEmail: session.user?.email
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or you don't have permission to delete it" }, { status: 403 });
    }

    // Delete blog from MongoDB
    await blogsCollection.deleteOne({ blogLocationId: parseInt(blogId) });

    // Delete blog from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `blogs/${blogId}.md`,
    });

    await s3.send(command);

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: "Error deleting blog" }, { status: 500 });
  }
}