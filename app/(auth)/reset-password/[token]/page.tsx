'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { AuthNavbar } from '@/components/auth-navbar';

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [token, setToken] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Get token from params and validate
    const initializeComponent = async () => {
      try {
        const resolvedParams = await params;
        const tokenValue = resolvedParams.token;
        setToken(tokenValue);

        // Validate token
        const response = await fetch(`/api/auth/validate-reset-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenValue }),
        });

        setIsValidToken(response.ok);
      } catch (error) {
        setIsValidToken(false);
      }
    };

    initializeComponent();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      if (response.ok) {
        toast.success('Password reset successfully');
        router.push('/login?message=password-reset');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-muted-foreground">
              Validating reset link...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <>
        <AuthNavbar />
        <div className="min-h-screen flex items-center justify-center bg-background pt-16">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-destructive">
                Invalid Reset Link
              </h1>
              <p className="text-muted-foreground">
                This password reset link is invalid or has expired.
              </p>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/forgot-password">Request New Reset Link</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <Card className="w-full max-w-md p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Reset Your Password</h1>
              <p className="text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
