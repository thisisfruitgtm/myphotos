import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth';
import { processImage } from '@/lib/image';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const formData = await request.formData();

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const password = formData.get('password') as string;

    if (!file || !title || !categoryId) {
      return NextResponse.json(
        { error: 'File, title, and category are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image and extract metadata
    const { filename, metadata } = await processImage(buffer, file.name);

    // Hash password if provided
    const hashedPassword = password ? await hashPassword(password) : null;

    // Create photo record
    const photo = await prisma.photo.create({
      data: {
        title,
        description,
        filename,
        originalName: file.name,
        mimeType: metadata.mimeType,
        size: metadata.size,
        width: metadata.width,
        height: metadata.height,
        password: hashedPassword,
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        dateTaken: metadata.dateTaken,
        camera: metadata.camera,
        lens: metadata.lens,
        focalLength: metadata.focalLength,
        aperture: metadata.aperture,
        shutterSpeed: metadata.shutterSpeed,
        iso: metadata.iso,
        categoryId,
        userId: session.userId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
