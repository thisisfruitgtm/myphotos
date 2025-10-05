import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptionsForUser } from '@/lib/webauthn';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    const options = await generateAuthenticationOptionsForUser(username);
    
    return NextResponse.json(options);
  } catch (error) {
    console.error('Auth options error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication options' },
      { status: 500 }
    );
  }
}
