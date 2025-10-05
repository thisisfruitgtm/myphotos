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

async function createUser() {
  try {
    console.log('\n🎨 MyPhoto - Create User Account\n');

    const name = await question('Enter your full name: ');
    const username = await question('Enter username (for login): ');
    const password = await question('Enter password: ');

    if (!name || !username || !password) {
      console.error('❌ All fields are required');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.error('❌ Username already taken');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    console.log(`\n✅ Account created successfully!`);
    console.log(`Name: ${user.name}`);
    console.log(`Username: ${user.username}`);
    console.log(`\n📱 You can enable biometric login (Face ID/Touch ID) after your first login!`);
    console.log(`\nPublic Gallery: http://localhost:3000`);
    console.log(`Admin Login: http://localhost:3000/login\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createUser();
