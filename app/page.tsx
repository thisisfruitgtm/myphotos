import { prisma } from '@/lib/db';
import GalleryClient from './gallery/GalleryClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getSession();
  
  // If logged in, redirect to admin
  if (session) {
    redirect('/admin');
  }

  // Get all users (for multi-user support in future, for now just get first)
  const user = await prisma.user.findFirst();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to MyPhoto</h1>
          <p className="text-muted-foreground mb-6">Create your photographer portfolio</p>
          <Link href="/signup">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
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
