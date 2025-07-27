import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from './logger';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Return the public URL
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    logger.error('Error uploading to S3:');
    throw new Error(`Failed to upload file to S3 - Context: throw new Error('Failed to upload file to S3');...`);
  }
} 