import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types';
import { prisma } from './db';

const rpName = 'MyPhoto';
const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function generateRegistrationOptionsForUser(userId: string, userName: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { passkeys: true },
  });

  if (!user) throw new Error('User not found');

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.username,
    userDisplayName: user.name,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
    excludeCredentials: user.passkeys.map((passkey) => ({
      id: passkey.credentialId,
      transports: ['internal' as const],
    })),
  });

  return options;
}

export async function verifyRegistration(
  userId: string,
  response: RegistrationResponseJSON,
  challenge: string,
  deviceName?: string
) {
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error('Verification failed');
  }

  const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

  await prisma.passkey.create({
    data: {
      userId,
      credentialId: Buffer.from(credentialID).toString('base64'),
      publicKey: Buffer.from(credentialPublicKey).toString('base64'),
      counter,
      deviceName,
    },
  });

  return verification;
}

export async function generateAuthenticationOptionsForUser(username?: string) {
  let allowCredentials;

  if (username) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { passkeys: true },
    });

    if (user && user.passkeys.length > 0) {
      allowCredentials = user.passkeys.map((passkey) => ({
        id: passkey.credentialId,
        transports: ['internal' as const],
      }));
    }
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: 'preferred',
  });

  return options;
}

export async function verifyAuthentication(
  response: AuthenticationResponseJSON,
  challenge: string
) {
  const credentialId = Buffer.from(response.id, 'base64url').toString('base64');

  const passkey = await prisma.passkey.findUnique({
    where: { credentialId },
    include: { user: true },
  });

  if (!passkey) {
    throw new Error('Passkey not found');
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: passkey.credentialId,
      credentialPublicKey: new Uint8Array(Buffer.from(passkey.publicKey, 'base64')),
      counter: passkey.counter,
    },
  });

  if (!verification.verified) {
    throw new Error('Verification failed');
  }

  // Update counter and last used
  await prisma.passkey.update({
    where: { id: passkey.id },
    data: {
      counter: verification.authenticationInfo.newCounter,
      lastUsedAt: new Date(),
    },
  });

  return { verified: true, user: passkey.user };
}
