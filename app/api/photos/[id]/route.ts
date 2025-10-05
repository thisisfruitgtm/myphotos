import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo || photo.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Delete file
    const filepath = path.join(process.cwd(), 'public', 'uploads', photo.filename);
    try {
      await unlink(filepath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Delete from database
    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
