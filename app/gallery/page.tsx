import { prisma } from '@/lib/db';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export default async function PublicGalleryPage() {
  // Get all users (for multi-user support in future, for now just get first)
  const user = await prisma.user.findFirst();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Portfolio Yet</h1>
          <p className="text-muted-foreground">The photographer hasn't set up their portfolio.</p>
        </div>
      </div>
    );
  }

  // Get public categories (no password)
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      password: null, // Only public categories
    },
    include: {
      _count: {
        select: { photos: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get public photos (no password on photo or category)
  const photos = await prisma.photo.findMany({
    where: {
      userId: user.id,
      password: null, // Only public photos
      category: {
        password: null, // In public categories
      },
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <GalleryClient user={user} categories={categories} photos={photos} />;
}
