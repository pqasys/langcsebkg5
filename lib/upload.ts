import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import { logger } from './logger';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function ensureDirectoryExists(path: string) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

export async function uploadFile(file: File, type: string, institutionId: string): Promise<string> {
  try {
    // Ensure base upload directory exists
    await ensureDirectoryExists(UPLOAD_DIR);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      throw new Error(`Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed. - Context: throw new Error('Invalid file type. Only JPG, PNG,...`);
    }

    const fileName = `${uuidv4()}.${fileExtension}`;
    const typeDir = join(UPLOAD_DIR, type);
    const institutionDir = join(typeDir, institutionId);
    const filePath = join(institutionDir, fileName);
    const relativePath = `/uploads/${type}/${institutionId}/${fileName}`;

    // Create type and institution directories
    await ensureDirectoryExists(typeDir);
    await ensureDirectoryExists(institutionDir);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    return relativePath;
  } catch (error) {
    logger.error('Error uploading file:');
    throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    // Convert URL to filesystem path
    const fsPath = filePath.replace('/uploads/', '');
    const absolutePath = join(process.cwd(), 'public', 'uploads', fsPath);
    if (existsSync(absolutePath)) {
      await unlink(absolutePath);
    }
  } catch (error) {
    logger.error('Error deleting file:');
    throw new Error(`Failed to delete file - Context: } catch (error) {
    console.error('Error occurred:', error);...`);
  }
} 