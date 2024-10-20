import { NextResponse } from 'next/server';
import clientPromise from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    const session = await getServerSession(authOptions);
    const blogs = await blogsCollection.find({userEmail: session?.user?.email}).toArray();
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

