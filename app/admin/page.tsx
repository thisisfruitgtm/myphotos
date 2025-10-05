import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardClient from './DashboardClient';
import SetupBiometric from './SetupBiometric';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.userId },
    include: {
      _count: {
        select: { photos: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const photos = await prisma.photo.findMany({
    where: { userId: session.userId },
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const passkeys = await prisma.passkey.findMany({
    where: { userId: session.userId },
  });

  return (
    <>
      <SetupBiometric hasPasskeys={passkeys.length > 0} />
      <DashboardClient 
        categories={categories} 
        photos={photos} 
        username={session.user.username}
        userName={session.user.name}
      />
    </>
  );
}
