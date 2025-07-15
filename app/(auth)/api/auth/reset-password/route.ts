import { 
  getPasswordResetToken, 
  markPasswordResetTokenAsUsed, 
  updateUserPassword 
} from '@/lib/db/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = resetPasswordSchema.parse(body);

    // Get reset token from database
    const resetTokens = await getPasswordResetToken(token);
    
    if (resetTokens.length === 0) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const [resetToken] = resetTokens;

    // Update user password
    await updateUserPassword(resetToken.userId, newPassword);

    // Mark token as used
    await markPasswordResetTokenAsUsed(resetToken.id);

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to reset password:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
