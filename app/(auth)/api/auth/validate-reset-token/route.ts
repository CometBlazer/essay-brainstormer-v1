import { getPasswordResetToken } from '@/lib/db/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = validateTokenSchema.parse(body);

    const resetTokens = await getPasswordResetToken(token);
    
    if (resetTokens.length === 0) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Token is valid' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to validate reset token:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
