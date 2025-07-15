import { getUser, createPasswordResetToken } from '@/lib/db/queries';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateUUID } from '@/lib/utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists
    const users = await getUser(email);
    
    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (users.length === 0) {
      return NextResponse.json({
        message: 'If an account with that email exists, we\'ve sent a password reset link.',
      });
    }

    const [user] = users;

    // Generate reset token
    const resetToken = generateUUID();
    
    // Save token to database
    await createPasswordResetToken(user.id, resetToken);

    // Send email
    const baseUrl = new URL(request.url).origin;
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      resetToken,
      baseUrl,
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we\'ve sent a password reset link.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to process forgot password request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
