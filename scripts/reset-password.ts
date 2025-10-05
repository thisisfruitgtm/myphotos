import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function resetPassword() {
  try {
    console.log('\n🔑 MyPhoto - Reset Password\n');

    const username = await question('Enter your username: ');

    if (!username) {
      console.error('❌ Username is required');
      process.exit(1);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    console.log(`\nResetting password for: ${user.name} (@${user.username})\n`);

    const newPassword = await question('Enter new password (min 8 characters): ');
    const confirmPassword = await question('Confirm new password: ');

    if (!newPassword || newPassword.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    if (newPassword !== confirmPassword) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Invalidate all existing sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    console.log(`\n✅ Password reset successfully!`);
    console.log(`All existing sessions have been invalidated for security.`);
    console.log(`\nAdmin Login: http://localhost:3000/login\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

resetPassword();
