'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { guestRegex } from '@/lib/constants';

interface ProfileFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Redirect guests to login
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
          </div>
        </div>
      </div>
    );
  }

  const isGuest = guestRegex.test(session?.user?.email ?? '');

  if (isGuest) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          <p className="text-muted-foreground mb-6">
            You need to create an account to access profile settings.
          </p>
          <Button onClick={() => router.push('/login')}>
            Login to Your Account
          </Button>
        </div>
      </div>
    );
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.currentPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail: formData.email,
          currentPassword: formData.currentPassword,
        }),
      });

      if (response.ok) {
        toast.success('Email updated successfully');
        await update(); // Refresh session
        setFormData(prev => ({ ...prev, currentPassword: '' }));
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update email');
      }
    } catch (error) {
      toast.error('An error occurred while updating email');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Email Update Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Update Email Address</h2>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="new-email">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter new email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="email-password">Current Password</Label>
              <Input
                id="email-password"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, currentPassword: e.target.value }))
                }
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Email'}
            </Button>
          </form>
        </Card>

        <Separator />

        {/* Password Update Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, currentPassword: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, newPassword: e.target.value }))
                }
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
                }
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
