import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateRegistrationOptionsForUser } from '@/lib/webauthn';

export async function POST() {
  try {
    const session = await requireAuth();
    
    const options = await generateRegistrationOptionsForUser(session.userId, session.user.username);
    
    return NextResponse.json(options);
  } catch (error) {
    console.error('Register options error:', error);
    return NextResponse.json(
      { error: 'Failed to generate registration options' },
      { status: 500 }
    );
  }
}
