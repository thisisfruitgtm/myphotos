import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Security: only allow alphanumeric and hyphens
    if (!/^[a-z0-9-]+\.jpg$/i.test(filename)) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    const fileBuffer = await readFile(filepath);

    // Convert Buffer to Uint8Array for Next.js 15 compatibility
    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
