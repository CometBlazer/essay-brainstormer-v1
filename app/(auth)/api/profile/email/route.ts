import { auth } from '@/app/(auth)/auth';
import { updateUserEmail, getUser } from '@/lib/db/queries';
import { compare } from 'bcrypt-ts';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newEmail, currentPassword } = updateEmailSchema.parse(body);

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

    // Check if new email is already in use
    const existingUser = await getUser(newEmail);
    if (existingUser.length > 0 && existingUser[0].id !== currentUser.id) {
      return NextResponse.json(
        { message: 'Email address is already in use' },
        { status: 400 }
      );
    }

    // Update email
    await updateUserEmail(currentUser.id, newEmail);

    return NextResponse.json({
      message: 'Email updated successfully',
      newEmail,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update email:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
