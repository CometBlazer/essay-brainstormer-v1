import { auth } from '@/app/(auth)/auth';
import { updateUserPassword, getUser } from '@/lib/db/queries';
import { compare } from 'bcrypt-ts';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = updatePasswordSchema.parse(body);

    // Get current user from database
    if (!session.user.email) {
      return NextResponse.json(
        { message: 'User email not found in session' },
        { status: 400 }
      );
    }

    const [currentUser] = await getUser(session.user.email);

    if (!currentUser || !currentUser.password) {
      return NextResponse.json(
        { message: 'User not found or invalid account' },
        { status: 400 }
      );
    }

    // Verify current password
    const passwordMatch = await compare(currentPassword, currentUser.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password
    await updateUserPassword(currentUser.id, newPassword);

    return NextResponse.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update password:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
