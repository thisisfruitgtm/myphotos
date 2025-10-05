'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Fingerprint } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasUsers, setHasUsers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if WebAuthn is available
    if (window.PublicKeyCredential) {
      setBiometricAvailable(true);
    }

    // Check if any users exist
    fetch('/api/auth/check-users')
      .then(res => res.json())
      .then(data => setHasUsers(data.hasUsers))
      .catch(() => setHasUsers(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login for username:', username);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', res.status);

      const data = await res.json();
      console.log('Login response data:', data);

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('Login successful, redirecting to admin...');
      // Use window.location for full page reload to ensure cookie is available
      window.location.href = '/admin';
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setLoading(false);
    }
  }

  async function handleBiometricLogin() {
    setError('');
    setLoading(true);

    try {
      // Get authentication options
      const optionsRes = await fetch('/api/auth/webauthn/auth-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username || undefined }),
      });

      if (!optionsRes.ok) {
        setError('Failed to initialize biometric login');
        return;
      }

      const options = await optionsRes.json();

      // Start WebAuthn authentication
      const credential = await startAuthentication(options);

      // Verify authentication
      const verifyRes = await fetch('/api/auth/webauthn/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: credential,
          challenge: options.challenge,
        }),
      });

      if (!verifyRes.ok) {
        setError('Biometric authentication failed');
        return;
      }

      // Use window.location for full page reload to ensure cookie is available
      window.location.href = '/admin';
    } catch (err: any) {
      console.error('Biometric login error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Biometric authentication cancelled');
      } else {
        setError('Biometric authentication failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <Camera className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to MyPhoto</CardTitle>
          <CardDescription>Enter your credentials to access your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            {biometricAvailable && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBiometricLogin}
                  disabled={loading}
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  {loading ? 'Authenticating...' : 'Use Face ID / Touch ID'}
                </Button>
              </>
            )}

            {!hasUsers && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  No account yet?
                </p>
                <Link href="/signup">
                  <Button variant="link" className="text-primary">
                    Create your first account
                  </Button>
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
