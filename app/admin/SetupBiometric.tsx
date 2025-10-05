'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, X } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import { useToast } from '@/components/ui/use-toast';

export default function SetupBiometric({ hasPasskeys }: { hasPasskeys: boolean }) {
  const [show, setShow] = useState(false);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!hasPasskeys && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
        if (available) {
          setAvailable(true);
          setShow(true);
        }
      });
    }
  }, [hasPasskeys]);

  async function setupBiometric() {
    setLoading(true);

    try {
      // Get registration options
      const optionsRes = await fetch('/api/auth/webauthn/register-options', {
        method: 'POST',
      });

      if (!optionsRes.ok) {
        throw new Error('Failed to get registration options');
      }

      const options = await optionsRes.json();

      // Start WebAuthn registration
      const credential = await startRegistration(options);

      // Verify registration
      const verifyRes = await fetch('/api/auth/webauthn/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: credential,
          challenge: options.challenge,
          deviceName: navigator.userAgent.includes('Mac') ? 'MacBook' : 'Device',
        }),
      });

      if (!verifyRes.ok) {
        throw new Error('Failed to verify registration');
      }

      toast({
        title: '✅ Biometric login enabled!',
        description: 'You can now use Face ID or Touch ID to login.',
      });

      setShow(false);
    } catch (err: any) {
      console.error('Setup error:', err);
      if (err.name === 'NotAllowedError') {
        toast({
          title: 'Setup cancelled',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to setup biometric login',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!show || !available) return null;

  return (
    <Card className="mb-6 border-primary/50 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Enable Biometric Login</CardTitle>
            <CardDescription>Login faster with Face ID or Touch ID</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShow(false)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Button onClick={setupBiometric} disabled={loading}>
          <Fingerprint className="w-4 h-4 mr-2" />
          {loading ? 'Setting up...' : 'Enable Now'}
        </Button>
      </CardContent>
    </Card>
  );
}
