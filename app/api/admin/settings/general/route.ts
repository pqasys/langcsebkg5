import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'prisma', 'admin_settings.json');

export async function GET() {
  try {
    const data = await fs.readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(data);
    return NextResponse.json({ fileUploadMaxSizeMB: settings.fileUploadMaxSizeMB || 10 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ fileUploadMaxSizeMB: 10 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileUploadMaxSizeMB } = body;
    const data = await fs.readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(data);
    settings.fileUploadMaxSizeMB = fileUploadMaxSizeMB;
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
} 