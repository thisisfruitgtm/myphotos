import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyRegistration } from '@/lib/webauthn';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { response, challenge, deviceName } = await request.json();

    await verifyRegistration(session.userId, response, challenge, deviceName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify registration' },
      { status: 500 }
    );
  }
}
