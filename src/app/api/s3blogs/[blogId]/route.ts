import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client } from '@aws-sdk/client-s3';

type ResponseData = {
 url: string,
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET!
  },
  region: process.env.AWS_REGION
});

export async function GET(request: Request,
  { params }: { params: { blogId: string } }): Promise<ResponseData> {
    const blogId = params.blogId;
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `blogs/${blogId}.md`,
    });

    const url = await getSignedUrl(s3, command);

    return new NextResponse(url)
  } catch (error) {
    console.error('Error fetching blog from S3:', error);
    return new Response('Error fetching blog from S3', { status: 500 });
  }
}