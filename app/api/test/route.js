import { NextResponse } from 'next/server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const { filename, contentType, userId } = await request.json();

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${userId}/${uuidv4()}-${filename}`,
      Conditions: [
        ['content-length-range', 0, 10485760],
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 600,
    });

    return NextResponse.json({ url, fields });
  } catch (error) {
    console.error('Error creating presigned URL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const key = searchParams.get('key'); 

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL for image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}