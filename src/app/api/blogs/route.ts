import { NextResponse } from 'next/server';
import clientPromise from "@/app/server/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const blogsCollection = db.collection('blogs');
    
    const blogs = await blogsCollection.find({}).toArray();
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

